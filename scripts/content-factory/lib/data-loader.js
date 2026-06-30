"use strict";
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const DATA_ROOT = path.join(__dirname, "..", "..", "..", "data");

const ENTITY_FOLDERS = {
  region: "regionen",
  branche: "branchen",
  gewerk: "gewerke",
  unternehmensbereich: "unternehmensbereiche",
  "use-case": "use-cases",
  "ki-tool": "ki-tools",
  training: "trainings",
  zertifizierung: "zertifizierungen",
  wissensbereich: "wissensbereiche",
  ressource: "ressourcen",
};

// Laedt eine einzelne Masterdaten-Instanz nach Masterdata Schema v1.0.
function loadEntity(typ, id) {
  const folder = ENTITY_FOLDERS[typ];
  if (!folder) throw new Error(`Unbekannter Entitaetstyp: ${typ}`);
  const filePath = path.join(DATA_ROOT, folder, `${id}.yaml`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Masterdaten fehlen: ${typ}:${id} (erwartet unter ${filePath})`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(raw);
  if (data.id !== id) {
    throw new Error(`ID-Inkonsistenz in ${filePath}: Feld id="${data.id}" != Dateiname "${id}"`);
  }
  return data;
}

// Loest einen Referenzstring "<typ>:<id>" zur vollen Entitaet auf.
// Wirft, wenn die Zielentitaet nicht existiert (referenzielle Integritaet, Schema-Regel 3).
function resolveRef(ref) {
  if (!ref || typeof ref !== "string" || !ref.includes(":")) {
    throw new Error(`Ungueltiges Referenzformat: "${ref}" (erwartet "<typ>:<id>")`);
  }
  const [typ, id] = ref.split(":");
  return loadEntity(typ, id);
}

function resolveRefs(refs) {
  return (refs || []).map(resolveRef);
}

module.exports = { loadEntity, resolveRef, resolveRefs, ENTITY_FOLDERS, DATA_ROOT };
