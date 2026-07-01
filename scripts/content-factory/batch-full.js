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
const DATA_ROOT = path.join(__dirname, "..", "..", "data");
const NATIONAL = new Set(["deutschland", "oesterreich", "schweiz"]);
// Dynamisch aus Masterdaten lesen -- erkennt neue Gewerke automatisch
const GEWERKE = fs.readdirSync(path.join(DATA_ROOT, "gewerke"))
  .filter(f => f.endsWith(".yaml"))
  .map(f => f.replace(".yaml", ""));

const includeNational = process.argv.includes("--include-national");

// Ermittle alle offenen Kombinationen (national optional)
const regionen = fs.readdirSync(path.join(__dirname, "../../data/regionen"))
  .map(f => f.replace(".yaml", ""))
  .filter(id => includeNational || !NATIONAL.has(id));

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
