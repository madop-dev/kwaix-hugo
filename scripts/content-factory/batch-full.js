#!/usr/bin/env node
"use strict";

// Vollständige Erschließung: alle Region×Gewerk-Kombinationen,
// die noch nicht als Content-Ordner existieren.
// Generiert Body-Sections automatisch über body-builder.js.
// National-Ebenen (deutschland, oesterreich, schweiz) werden übersprungen
// und später separat als Landes-Hubs behandelt.

const fs = require("fs");
const path = require("path");
const { loadEntity } = require("./lib/data-loader");

const CONTENT_ROOT = path.join(__dirname, "..", "..", "content");
const NATIONAL = new Set(["deutschland", "oesterreich", "schweiz"]);
const GEWERKE = ["holzbau", "shk", "dachdecker", "elektro", "maler"];

// Ermittle alle offenen Kombinationen
const regionen = fs.readdirSync(path.join(__dirname, "../../data/regionen"))
  .map(f => f.replace(".yaml", ""))
  .filter(id => !NATIONAL.has(id));

const existing = new Set(
  fs.readdirSync(CONTENT_ROOT)
    .filter(d => d.startsWith("ki-training-"))
    .map(d => d)
);

const BATCH = [];
GEWERKE.forEach(g => {
  regionen.forEach(r => {
    const slug = `ki-training-${g}-${r}`;
    if (!existing.has(slug)) {
      BATCH.push({ type: "region-gewerk", gewerk: g, region: r });
    }
  });
});

console.log(`Offene Kombinationen: ${BATCH.length}`);

// Schreibe eine Mini-BATCH-Datei, die batch-production.js importieren kann
const batchCode = `module.exports = ${JSON.stringify(BATCH, null, 2)};`;
fs.writeFileSync(path.join(__dirname, "_batch_full_list.js"), batchCode);
console.log("Liste geschrieben nach scripts/content-factory/_batch_full_list.js");
console.log("Starte jetzt: node scripts/content-factory/batch-production.js --full-batch [--write]");
