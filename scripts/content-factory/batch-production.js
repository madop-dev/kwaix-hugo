#!/usr/bin/env node
"use strict";

// Batch-Produktionsläufer für kontrollierten Serienproduktionslauf.
// Erzeugt mehrere Seiten in einem Lauf, sammelt QA-Ergebnisse je Kombination
// und schreibt anschliessend den Produktionsbericht nach docs/.
//
// Aufruf: node scripts/content-factory/batch-production.js [--write] [--report=<dateiname>]
// Ohne --write: Dry-Run (kein Schreiben).

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { loadEntity, resolveRef, resolveRefs } = require("./lib/data-loader");
const { checkThresholds, checkDifferentiation } = require("./lib/thresholds");
const { regionGewerkFrontmatter, bracheUseCaseFrontmatter, toFrontmatterYaml } = require("./lib/templates");
const qa = require("./lib/qa");

const CONTENT_ROOT = path.join(__dirname, "..", "..", "content");
const DOCS_ROOT = path.join(__dirname, "..", "..", "docs");

const args = process.argv.slice(2);
const write = args.includes("--write");
// --update: wie --write, überschreibt aber bestehende Ordner (kein Slug-Eindeutigkeit-FAIL).
// Verwendung ausschliesslich fuer Regeneration mit geaendertem Template.
const update = args.includes("--update");
const reportArg = args.find((a) => a.startsWith("--report="));
const reportFilename = reportArg ? reportArg.split("=")[1] : "PRODUKTIONSBERICHT-BATCH-01.md";

// ---- Batch-Definition ----
// 20 Kombinationen: alle 5 Gewerke mehrfach, Spread ueber DE/AT/CH,
// nur Regionen und Kombinationen, die noch nicht als Content-Ordner existieren.
const BATCH = [
  // Holzbau: DE + AT
  { type: "region-gewerk", region: "hamburg",   gewerk: "holzbau" },
  { type: "region-gewerk", region: "wien",      gewerk: "holzbau" },
  { type: "region-gewerk", region: "koeln",     gewerk: "holzbau" },
  { type: "region-gewerk", region: "muenster",  gewerk: "holzbau" },

  // SHK: DE + AT
  { type: "region-gewerk", region: "berlin",    gewerk: "shk" },
  { type: "region-gewerk", region: "muenchen",  gewerk: "shk" },
  { type: "region-gewerk", region: "innsbruck", gewerk: "shk" },
  { type: "region-gewerk", region: "linz",      gewerk: "shk" },

  // Dachdecker: DE + AT + CH
  { type: "region-gewerk", region: "berlin",    gewerk: "dachdecker" },
  { type: "region-gewerk", region: "muenchen",  gewerk: "dachdecker" },
  { type: "region-gewerk", region: "wien",      gewerk: "dachdecker" },
  { type: "region-gewerk", region: "bern",      gewerk: "dachdecker" },

  // Elektro: DE + AT + CH
  { type: "region-gewerk", region: "berlin",    gewerk: "elektro" },
  { type: "region-gewerk", region: "muenchen",  gewerk: "elektro" },
  { type: "region-gewerk", region: "wien",      gewerk: "elektro" },
  { type: "region-gewerk", region: "zuerich",   gewerk: "elektro" },

  // Maler: DE + AT + CH
  { type: "region-gewerk", region: "berlin",    gewerk: "maler" },
  { type: "region-gewerk", region: "wien",      gewerk: "maler" },
  { type: "region-gewerk", region: "koeln",     gewerk: "maler" },
  { type: "region-gewerk", region: "zuerich",   gewerk: "maler" },
];

function buildCombo(spec) {
  if (spec.type === "region-gewerk") {
    const region = loadEntity("region", spec.region);
    const gewerk = loadEntity("gewerk", spec.gewerk);
    const branche = resolveRef(gewerk.branche_ref);
    const usecases = resolveRefs(gewerk.usecase_refs);
    const toolIdSet = new Set();
    usecases.forEach((u) => (u.tool_refs || []).forEach((t) => toolIdSet.add(t)));
    const tools = Array.from(toolIdSet).map(resolveRef);
    const training = loadEntity("training", "ki-training-live");
    return { region, branche, gewerk, usecases, tools, training };
  }
  if (spec.type === "branche-usecase") {
    const branche = loadEntity("branche", spec.branche);
    const usecase = loadEntity("use-case", spec.usecase);
    const unternehmensbereich = resolveRef(usecase.unternehmensbereich_ref);
    const tools = resolveRefs(usecase.tool_refs);
    const training = loadEntity("training", "ki-training-live");
    return { branche, usecase, usecases: [usecase], unternehmensbereich, tools, training };
  }
  throw new Error(`Unbekannter Batch-Typ: ${spec.type}`);
}

function templateFn(spec) {
  return spec.type === "region-gewerk" ? regionGewerkFrontmatter : bracheUseCaseFrontmatter;
}

function distinguishingTerms(spec, combo) {
  return spec.type === "region-gewerk"
    ? [combo.gewerk.name, combo.region.name]
    : [combo.branche.name, combo.usecase.name];
}

function comboLabel(spec) {
  return spec.type === "region-gewerk"
    ? `${spec.gewerk} × ${spec.region}`
    : `${spec.branche} × ${spec.usecase}`;
}

// ---- QA-Erweiterung: Seiten-übergreifende Checks ----
// Gesammelt nach dem Lauf über alle Seiten.
function auditCrossPage(results) {
  const titleMap = {};
  const faqMap = {};
  results.forEach((r) => {
    if (!r.frontmatter) return;
    const title = r.frontmatter.title.replace(/\[REDAKTIONELL\]\s*/, "").trim();
    (titleMap[title] = titleMap[title] || []).push(r.slug);
    (r.frontmatter.faqItems || []).forEach((f) => {
      if (/Artikel 4/.test(f.q)) return;
      (faqMap[f.q] = faqMap[f.q] || []).push(r.slug);
    });
  });
  const titleDupes = Object.entries(titleMap).filter(([, v]) => v.length > 1);
  const faqDupes = Object.entries(faqMap).filter(([, v]) => v.length > 1);
  return { titleDupes, faqDupes };
}

// ---- Produktionsbericht ----
function writeBericht(results, crossAudit, reportPath, dryRun) {
  const now = new Date().toISOString().slice(0, 10);
  const ok = results.filter((r) => r.status === "OK").length;
  const warn = results.filter((r) => r.status === "WARN").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  const skip = results.filter((r) => r.status === "SKIP").length;

  const lines = [
    `# KWAIX Produktionsbericht – Batch 01`,
    ``,
    `Datum: ${now} · Modus: ${dryRun ? "DRY-RUN (nicht geschrieben)" : "PRODUKTIV (geschrieben)"}`,
    `Gesamt: ${results.length} Kombinationen · OK: ${ok} · WARN: ${warn} · FAIL: ${fail} · SKIP: ${skip}`,
    ``,
    `---`,
    ``,
    `## Seiten-Übersicht`,
    ``,
    `| # | Kombination | Slug | Status | Auffälligkeiten |`,
    `|---|---|---|---|---|`,
  ];

  results.forEach((r, i) => {
    const auff = r.warnings.length ? r.warnings.join("; ") : "–";
    lines.push(`| ${i + 1} | ${r.label} | \`${r.slug || "–"}\` | ${r.status} | ${auff} |`);
  });

  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Seitenweiser Detailbericht`);
  lines.push(``);

  results.forEach((r, i) => {
    lines.push(`### ${i + 1}. ${r.label}`);
    lines.push(``);
    lines.push(`**Slug:** \`${r.slug || "–"}\`  **Status:** ${r.status}  **Schritt:** ${r.stoppedAt || "abgeschlossen"}`);
    lines.push(``);

    if (r.qaChecks && r.qaChecks.length) {
      lines.push(`**QA-Prüfungen:**`);
      lines.push(``);
      r.qaChecks.forEach((c) => lines.push(`- [${c.status}] ${c.regel}${c.hinweis ? ": " + c.hinweis : ""}`));
      lines.push(``);
    }

    if (r.warnings.length) {
      lines.push(`**Auffälligkeiten:**`);
      r.warnings.forEach((w) => lines.push(`- ${w}`));
      lines.push(``);
    }

    if (r.verbesserungsvorschlaege.length) {
      lines.push(`**Verbesserungsvorschläge:**`);
      r.verbesserungsvorschlaege.forEach((v) => lines.push(`- ${v}`));
      lines.push(``);
    }

    if (!r.warnings.length && !r.verbesserungsvorschlaege.length) {
      lines.push(`Keine Auffälligkeiten.`);
      lines.push(``);
    }
  });

  lines.push(`---`);
  lines.push(``);
  lines.push(`## Seitenübergreifende Prüfungen`);
  lines.push(``);

  lines.push(`**Duplicate-Content (Title):**`);
  if (crossAudit.titleDupes.length) {
    crossAudit.titleDupes.forEach(([t, ss]) =>
      lines.push(`- [FAIL] Identischer Title "${t}" auf ${ss.length} Seiten: ${ss.join(", ")}`)
    );
  } else {
    lines.push(`- [OK] Keine Title-Dubletten`);
  }

  lines.push(``);
  lines.push(`**Duplicate-Content (FAQ-Fragen, exkl. Pflichtblock):**`);
  if (crossAudit.faqDupes.length) {
    crossAudit.faqDupes.forEach(([q, ss]) =>
      lines.push(`- [WARN] Frage "${q}" auf ${ss.length} Seiten: ${ss.join(", ")}`)
    );
  } else {
    lines.push(`- [OK] Keine FAQ-Fragen-Dubletten`);
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Zusammenfassung und offene Punkte`);
  lines.push(``);
  lines.push(`Alle Seiten tragen \`draft: true\` und erscheinen nicht im Produktions-Build ohne \`--buildDrafts\`.`);
  lines.push(`Keine automatische Nachbesserung — Auffälligkeiten sind ausschließlich dokumentiert.`);
  lines.push(``);
  lines.push(`*Erzeugt von \`scripts/content-factory/batch-production.js\`*`);

  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
}

// ---- Hauptlauf ----
const mode = update ? "UPDATE (überschreibt bestehende Ordner)" : write ? "SCHREIBEN" : "DRY-RUN";
console.log(`KWAIX Content Factory – Batch-Produktionslauf`);
console.log(`Modus: ${mode} · ${BATCH.length} Kombinationen\n`);

const results = [];

for (const spec of BATCH) {
  const label = comboLabel(spec);
  const result = { label, slug: null, status: "OK", stoppedAt: null, qaChecks: [], warnings: [], verbesserungsvorschlaege: [], frontmatter: null };

  try {
    const combo = buildCombo(spec);

    // Schwellenprüfung
    const thr = checkThresholds(combo);
    if (!thr.passed) {
      result.status = "SKIP";
      result.stoppedAt = "Schwellenprüfung";
      result.warnings.push(`Schwelle: ${thr.findings.filter(f=>f.status==="FAIL").map(f=>f.regel).join(", ")}`);
      results.push(result);
      console.log(`[SKIP] ${label} – Schwellenprüfung nicht bestanden`);
      continue;
    }

    // Differenzierungsprüfung
    const diff = checkDifferentiation(combo);
    if (!diff.passed) {
      result.status = "SKIP";
      result.stoppedAt = "Differenzierungsprüfung";
      result.warnings.push(`Differenzierungssignale: ${diff.signals.join(", ") || "keine"}`);
      results.push(result);
      console.log(`[SKIP] ${label} – Keine Differenzierungssignale`);
      continue;
    }

    // Template
    const { slug, url, frontmatter } = templateFn(spec)(combo);
    result.slug = slug;
    result.frontmatter = frontmatter;
    const terms = distinguishingTerms(spec, combo);

    // QA
    // Im Update-Modus: Slug-Eindeutigkeit nicht als Fehler werten,
    // da vorhandene Ordner bewusst ueberschrieben werden.
    const qaResult = qa.runAll(frontmatter, {
      expectedUrl: url,
      slug,
      contentRoot: update ? null : CONTENT_ROOT,
      distinguishingTerms: terms,
    });
    result.qaChecks = qaResult.checks;

    const warnChecks = qaResult.checks.filter(c => c.status === "WARN");
    const failChecks = qaResult.checks.filter(c => c.status === "FAIL");

    if (failChecks.length) {
      result.status = "FAIL";
      result.stoppedAt = "Pre-Publish-QA";
      failChecks.forEach(c => result.warnings.push(`[FAIL] ${c.regel}: ${c.hinweis || ""}`));
      results.push(result);
      console.log(`[FAIL] ${label} (${slug}) – QA: ${failChecks.map(c=>c.regel).join(", ")}`);
      continue;
    }

    if (warnChecks.length) {
      result.status = "WARN";
      warnChecks.forEach(c => {
        result.warnings.push(`[WARN] ${c.regel}: ${c.hinweis || ""}`);
        if (c.regel === "Description-Länge") {
          result.verbesserungsvorschlaege.push("Description vor Veröffentlichung auf max. 165 Zeichen kürzen – Template erzeugt für diesen Orts-/Gewerksnamen einen zu langen String.");
        }
      });
    }

    // Schreiben
    if (write || update) {
      const targetDir = path.join(CONTENT_ROOT, slug);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, "index.md"), toFrontmatterYaml(frontmatter), "utf8");
    }

    console.log(`[${result.status}] ${label} → ${slug}${write ? " (geschrieben)" : " (dry-run)"}`);
  } catch (err) {
    result.status = "FAIL";
    result.stoppedAt = "Fehler";
    result.warnings.push(`Fehler: ${err.message}`);
    console.error(`[ERR] ${label}: ${err.message}`);
  }

  results.push(result);
}

console.log(`\nErgebnis: ${results.length} Kombinationen – OK: ${results.filter(r=>r.status==="OK").length}, WARN: ${results.filter(r=>r.status==="WARN").length}, FAIL: ${results.filter(r=>r.status==="FAIL").length}, SKIP: ${results.filter(r=>r.status==="SKIP").length}`);

// Seitenübergreifendes Audit
const crossAudit = auditCrossPage(results);
console.log(`\nDuplicate-Content: ${crossAudit.titleDupes.length} Title-Dubletten, ${crossAudit.faqDupes.length} FAQ-Fragen-Dubletten`);

// Bericht schreiben
const reportPath = path.join(DOCS_ROOT, reportFilename);
writeBericht(results, crossAudit, reportPath, !write);
console.log(`\nProduktionsbericht: docs/${reportFilename}`);
