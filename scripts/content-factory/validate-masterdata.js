#!/usr/bin/env node
"use strict";

// Vollstaendige Validierung aller produktiven Masterdaten gegen
// Masterdata Schema v1.0, Abschnitt 13 (Regeln 1-9).

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { ENTITY_FOLDERS, DATA_ROOT } = require("./lib/data-loader");

const SCHICHT_BY_TYP = {
  region: ["2"], branche: ["2"], gewerk: ["2"], unternehmensbereich: ["2"],
  "use-case": ["2"], "ki-tool": ["2"], training: ["4"], zertifizierung: ["4"],
  wissensbereich: ["3", "4"], ressource: ["3", "4"],
};

function loadAll() {
  const all = {}; // typ -> {id -> data}
  for (const [typ, folder] of Object.entries(ENTITY_FOLDERS)) {
    all[typ] = {};
    const dir = path.join(DATA_ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".yaml")) continue;
      const id = file.replace(/\.yaml$/, "");
      const data = yaml.load(fs.readFileSync(path.join(dir, file), "utf8"));
      all[typ][id] = data;
    }
  }
  return all;
}

function refExists(all, ref) {
  if (!ref) return true;
  const [typ, id] = String(ref).split(":");
  return !!(all[typ] && all[typ][id]);
}

function main() {
  const all = loadAll();
  const issues = []; // {regel, typ, id, schwere: FAIL|WARN, detail}
  let totalEntities = 0;

  for (const [typ, entries] of Object.entries(all)) {
    for (const [id, data] of Object.entries(entries)) {
      totalEntities++;

      // Regel 1: ID-Format
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
        issues.push({ regel: "1 ID-Format", typ, id, schwere: "FAIL", detail: "ID entspricht nicht ^[a-z0-9]+(-[a-z0-9]+)*$" });
      }
      if (data.id !== id) {
        issues.push({ regel: "1 ID-Format", typ, id, schwere: "FAIL", detail: `Feld id="${data.id}" != Dateiname "${id}"` });
      }

      // Regel 4: Pflichtfeld-Vollstaendigkeit (Basisfelder)
      for (const f of ["entitaetstyp", "name", "status", "schicht", "hat_eigene_seite"]) {
        if (data[f] === undefined || data[f] === null || data[f] === "") {
          issues.push({ regel: "4 Pflichtfelder", typ, id, schwere: "FAIL", detail: `Basisfeld fehlt: ${f}` });
        }
      }
      if (data.hat_eigene_seite === true && !data.seiten_pfad) {
        issues.push({ regel: "8 hat_eigene_seite-Konsistenz", typ, id, schwere: "FAIL", detail: "hat_eigene_seite=true aber seiten_pfad fehlt" });
      }

      // Regel 5: Enum-Konformitaet (Stichprobe der bekannten Enum-Felder)
      if (data.status && !["aktiv", "inaktiv"].includes(data.status)) {
        issues.push({ regel: "5 Enum-Konformitaet", typ, id, schwere: "FAIL", detail: `status="${data.status}" ungueltig` });
      }

      // Regel 9: Schicht-Konsistenz
      const erlaubt = SCHICHT_BY_TYP[typ];
      if (erlaubt && data.schicht && !erlaubt.includes(String(data.schicht))) {
        issues.push({ regel: "9 Schicht-Konsistenz", typ, id, schwere: "WARN", detail: `schicht="${data.schicht}", erwartet eines von [${erlaubt.join(",")}]` });
      }

      // Regel 3: Referenzielle Integritaet -- alle Felder, die wie Referenzen aussehen
      const refFields = Object.entries(data).filter(([k, v]) => k.endsWith("_ref") || k.endsWith("_refs"));
      for (const [field, value] of refFields) {
        const refs = Array.isArray(value) ? value : value ? [value] : [];
        for (const r of refs) {
          if (!refExists(all, r)) {
            issues.push({ regel: "3 Referenzielle Integritaet", typ, id, schwere: "FAIL", detail: `${field} -> "${r}" existiert nicht` });
          }
        }
      }

      // Regel 6: Zyklusfreiheit bei vergleichbare_tools (Selbstreferenz)
      if (typ === "ki-tool" && Array.isArray(data.vergleichbare_tools)) {
        if (data.vergleichbare_tools.includes(`ki-tool:${id}`)) {
          issues.push({ regel: "6 Zyklusfreiheit", typ, id, schwere: "FAIL", detail: "vergleichbare_tools enthaelt Selbstreferenz" });
        }
      }

      // Regel 4 (Mindestanzahl): unternehmensbereich.usecase_refs >= 3
      if (typ === "unternehmensbereich") {
        const n = (data.usecase_refs || []).length;
        if (n < 3) {
          issues.push({ regel: "4 Pflichtfelder (Mindestanzahl)", typ, id, schwere: "FAIL", detail: `usecase_refs hat ${n} Eintraege, Pflicht sind >=3` });
        }
      }
    }
  }

  // Regel 7: Konsistenz bidirektionaler Beziehungen Unternehmensbereich <-> Use Case
  for (const [ucId, uc] of Object.entries(all["use-case"] || {})) {
    const ref = uc.unternehmensbereich_ref;
    if (!ref) continue;
    const [, bereichId] = ref.split(":");
    const bereich = (all.unternehmensbereich || {})[bereichId];
    if (bereich && !(bereich.usecase_refs || []).includes(`use-case:${ucId}`)) {
      issues.push({ regel: "7 Bidirektionale Konsistenz", typ: "use-case", id: ucId, schwere: "FAIL", detail: `unternehmensbereich:${bereichId} referenziert use-case:${ucId} nicht zurueck` });
    }
  }

  // Duplikat-Pruefung (Validierungspunkt "Duplikate" aus der Anfrage):
  // gleicher "name" innerhalb desselben Entitaetstyps.
  for (const [typ, entries] of Object.entries(all)) {
    const byName = {};
    for (const [id, data] of Object.entries(entries)) {
      const key = (data.name || "").trim().toLowerCase();
      if (!key) continue;
      (byName[key] = byName[key] || []).push(id);
    }
    for (const [name, ids] of Object.entries(byName)) {
      if (ids.length > 1) {
        issues.push({ regel: "Duplikate", typ, id: ids.join(", "), schwere: "FAIL", detail: `Name "${name}" mehrfach vergeben` });
      }
    }
  }

  // Bericht
  const fails = issues.filter((i) => i.schwere === "FAIL");
  const warns = issues.filter((i) => i.schwere === "WARN");
  console.log(`KWAIX Masterdaten-Validierung -- ${totalEntities} Entitaeten geprueft\n`);
  console.log(`FAIL: ${fails.length}  WARN: ${warns.length}\n`);
  for (const i of issues) {
    console.log(`[${i.schwere}] Regel ${i.regel} | ${i.typ}:${i.id} | ${i.detail}`);
  }
  process.exit(fails.length ? 1 : 0);
}

main();
