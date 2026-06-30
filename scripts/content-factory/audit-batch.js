#!/usr/bin/env node
"use strict";

// Systematisches Audit eines Testlaufs generierter Seiten.
// Liest die generierten Markdown-Dateien direkt (nicht das HTML), prueft:
// Title/Description-Eindeutigkeit (Keyword-Kannibalisierung), FAQ-Ueberlappung,
// dimension-Vollstaendigkeit, CTA-Konsistenz.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const slugs = process.argv.slice(2);
const CONTENT_ROOT = path.join(__dirname, "..", "..", "content");

function loadPage(slug) {
  const file = path.join(CONTENT_ROOT, slug, "index.md");
  const raw = fs.readFileSync(file, "utf8");
  const fmMatch = /^---\n([\s\S]*?)\n---/.exec(raw);
  const fm = yaml.load(fmMatch[1]);
  return { slug, fm };
}

const pages = slugs.map(loadPage);

console.log(`Audit von ${pages.length} Testseiten\n`);

// 1. Title-/Description-Eindeutigkeit (Keyword-Kannibalisierung)
console.log("-- Title-Eindeutigkeit --");
const titleCounts = {};
pages.forEach((p) => {
  const key = p.fm.title.replace(/\[REDAKTIONELL\]\s*/, "").trim();
  (titleCounts[key] = titleCounts[key] || []).push(p.slug);
});
let titleDupes = 0;
for (const [title, ss] of Object.entries(titleCounts)) {
  if (ss.length > 1) {
    titleDupes++;
    console.log(`  [FAIL] Title "${title}" mehrfach: ${ss.join(", ")}`);
  }
}
if (!titleDupes) console.log("  [OK] keine Title-Dubletten");

// 2. FAQ-Ueberlappung ausserhalb des Pflichtblocks
console.log("\n-- FAQ-Ueberlappung (ausserhalb Pflicht-Art.4-Block) --");
const faqQuestionCounts = {};
pages.forEach((p) => {
  (p.fm.faqItems || []).forEach((item) => {
    if (/Artikel 4/.test(item.q)) return; // Pflichtblock, soll identisch sein
    (faqQuestionCounts[item.q] = faqQuestionCounts[item.q] || []).push(p.slug);
  });
});
let faqDupes = 0;
for (const [q, ss] of Object.entries(faqQuestionCounts)) {
  if (ss.length > 1) {
    faqDupes++;
    console.log(`  [WARN] FAQ-Frage "${q}" auf ${ss.length} Seiten: ${ss.join(", ")}`);
  }
}
if (!faqDupes) console.log("  [OK] keine FAQ-Frage-Ueberlappung ausserhalb Pflichtblock");

// 3. dimension-Vollstaendigkeit
console.log("\n-- dimension-Vollstaendigkeit --");
pages.forEach((p) => {
  const dim = p.fm.dimension || {};
  const keys = Object.keys(dim);
  console.log(`  ${p.slug}: ${keys.join(", ") || "KEIN dimension-Feld"}`);
});

// 4. CTA-Konsistenz (herocta-Muster)
console.log("\n-- CTA-Konsistenz --");
const ctaPatterns = new Set();
pages.forEach((p) => {
  if (p.fm.herocta) {
    const pattern = p.fm.herocta.replace(/[A-ZÄÖÜ][a-zäöüß]+(\s[A-ZÄÖÜ][a-zäöüß]+)*/g, "<X>");
    ctaPatterns.add(pattern);
  }
});
console.log(`  ${ctaPatterns.size} unterschiedliche(s) CTA-Grundmuster nach Namens-Normalisierung:`);
ctaPatterns.forEach((p) => console.log(`    "${p}"`));

// 5. Slug-Struktur-Konsistenz
console.log("\n-- Slug-Struktur --");
const slugPatterns = pages.map((p) => p.slug.replace(/[a-z]+/g, (m, i) => (i === 0 ? "<gewerk>" : "<region>")));
console.log(`  Beispiele: ${pages.slice(0, 3).map((p) => p.slug).join(", ")} ...`);

console.log(`\nGesamt: ${pages.length} Seiten geprueft, ${titleDupes} Title-Dubletten, ${faqDupes} FAQ-Ueberlappungen (ausserhalb Pflichtblock).`);
