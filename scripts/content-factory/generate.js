#!/usr/bin/env node
"use strict";

/*
 * KWAIX Content Factory -- Generator
 *
 * Eingabedaten: produktive Masterdaten unter data/ (Masterdata Schema v1.0).
 * Verarbeitungslogik: Referenzen aufloesen -> Generierungsschwellen pruefen ->
 *   Differenzierung pruefen -> Frontmatter aus Goldstandard-Templates ableiten ->
 *   Pre-Publish-QA -> (nur bei --write) Datei schreiben.
 * Ausgabestruktur: Hugo-Markdown mit YAML-Frontmatter, Pfad nach Domain
 *   Specification v1.1 Abschnitt 8.
 *
 * WICHTIG: Standardmodus ist --dry-run. Ohne --write wird NICHTS in content/
 * geschrieben -- per Auftrag ("noch keine Seiten in Serie erzeugen").
 */

const path = require("path");
const fs = require("fs");
const { loadEntity, resolveRef, resolveRefs } = require("./lib/data-loader");
const { checkThresholds, checkDifferentiation } = require("./lib/thresholds");
const { regionGewerkFrontmatter, bracheUseCaseFrontmatter, toFrontmatterYaml } = require("./lib/templates");
const qa = require("./lib/qa");

const CONTENT_ROOT = path.join(__dirname, "..", "..", "content");

function buildRegionGewerkCombo(regionId, gewerkId) {
  const region = loadEntity("region", regionId);
  const gewerk = loadEntity("gewerk", gewerkId);
  const branche = resolveRef(gewerk.branche_ref);
  const usecases = resolveRefs(gewerk.usecase_refs);
  const toolIdSet = new Set();
  usecases.forEach((u) => (u.tool_refs || []).forEach((t) => toolIdSet.add(t)));
  const tools = Array.from(toolIdSet).map(resolveRef);
  // Trainingsreferenz: produktionsreif waere dies ueber eine explizite
  // Zuordnungstabelle Branche->Standardtraining gesteuert. Fuer den
  // Selbsttest verwenden wir das bekannte Goldstandard-Training.
  const training = loadEntity("training", "ki-training-live");

  return { region, branche, gewerk, usecases, tools, training };
}

function buildBrancheUseCaseCombo(brancheId, usecaseId) {
  const branche = loadEntity("branche", brancheId);
  const usecase = loadEntity("use-case", usecaseId);
  const unternehmensbereich = resolveRef(usecase.unternehmensbereich_ref);
  const tools = resolveRefs(usecase.tool_refs);
  const training = loadEntity("training", "ki-training-live");

  return { branche, usecase, usecases: [usecase], unternehmensbereich, tools, training };
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const comboArg = args.find((a) => a.startsWith("--combo="));
  const comboTyp = comboArg ? comboArg.split("=")[1] : "region-gewerk";

  console.log(`KWAIX Content Factory -- Kombinationstyp: ${comboTyp}`);
  console.log(write ? "Modus: WRITE (schreibt nach content/)" : "Modus: DRY-RUN (schreibt nichts)");
  console.log("");

  let combo, templateFn;
  try {
    if (comboTyp === "region-gewerk") {
      const regionArg = args.find((a) => a.startsWith("--region="));
      const gewerkArg = args.find((a) => a.startsWith("--gewerk="));
      const regionId = regionArg ? regionArg.split("=")[1] : "freiburg";
      const gewerkId = gewerkArg ? gewerkArg.split("=")[1] : "holzbau";
      console.log(`Kombination: Region x Gewerk: ${regionId} x ${gewerkId}\n`);
      combo = buildRegionGewerkCombo(regionId, gewerkId);
      templateFn = regionGewerkFrontmatter;
    } else if (comboTyp === "branche-usecase") {
      const brancheArg = args.find((a) => a.startsWith("--branche="));
      const usecaseArg = args.find((a) => a.startsWith("--usecase="));
      const brancheId = brancheArg ? brancheArg.split("=")[1] : "industrie";
      const usecaseId = usecaseArg ? usecaseArg.split("=")[1] : "baustellendokumentation";
      console.log(`Kombination: Branche x Use Case: ${brancheId} x ${usecaseId}\n`);
      combo = buildBrancheUseCaseCombo(brancheId, usecaseId);
      templateFn = bracheUseCaseFrontmatter;
    } else {
      throw new Error(`Unbekannter Kombinationstyp: ${comboTyp}`);
    }
  } catch (err) {
    console.error(`FEHLER beim Laden der Masterdaten: ${err.message}`);
    process.exit(1);
  }

  const thresholdResult = checkThresholds(combo);
  console.log("-- Generierungsschwellen (Domain Spec Abschnitt 6) --");
  thresholdResult.findings.forEach((f) => console.log(`  [${f.status}] ${f.regel}${f.grund ? ": " + f.grund : f.hinweis ? " (" + f.hinweis + ")" : ""}`));
  if (!thresholdResult.passed) {
    console.error("\nABGEBROCHEN: Generierungsschwellen nicht erfuellt. Keine Datei erzeugt.");
    process.exit(1);
  }

  const diff = checkDifferentiation(combo);
  console.log("\n-- Differenzierungspruefung (Regel 12) --");
  console.log(`  [${diff.passed ? "OK" : "FAIL"}] Signale: ${diff.signals.join(", ") || "keine"}`);
  if (!diff.passed) {
    console.error("\nABGEBROCHEN: Keine Differenzierungssignale -- Kombination wuerde Duplicate/Thin Content erzeugen.");
    process.exit(1);
  }

  const { slug, url, frontmatter } = templateFn(combo);

  // Unterscheidende Begriffe je Kombinationstyp -- Grundlage fuer die
  // automatisierte FAQ-Differenzierungspruefung (qa.js::checkFaqDifferentiation).
  const distinguishingTerms =
    comboTyp === "region-gewerk"
      ? [combo.gewerk.name, combo.region.name]
      : [combo.branche.name, combo.usecase.name];

  console.log("\n-- Pre-Publish-QA (Regel 11) --");
  const qaResult = qa.runAll(frontmatter, { expectedUrl: url, slug, contentRoot: CONTENT_ROOT, distinguishingTerms });
  qaResult.checks.forEach((c) => console.log(`  [${c.status}] ${c.regel}${c.hinweis ? " (" + c.hinweis + ")" : ""}`));

  if (!qaResult.passed) {
    console.error("\nABGEBROCHEN: Pre-Publish-QA fehlgeschlagen. Keine Datei erzeugt.");
    process.exit(1);
  }

  console.log(`\nErgebnis-Slug: ${slug}`);
  console.log(`Ziel-URL: ${url}`);
  console.log(`Zielpfad: content/${slug}/index.md`);
  console.log("\nHinweis: title/description/lede/FAQ-Antworten sind mit [REDAKTIONELL] markiert --");
  console.log("diese Felder werden bewusst NICHT vollautomatisch befuellt (Content-Factory-Regel 3).");

  if (write) {
    const targetDir = path.join(CONTENT_ROOT, slug);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.md"), toFrontmatterYaml(frontmatter));
    console.log(`\nGeschrieben: ${path.join(targetDir, "index.md")}`);
  } else {
    console.log("\n(Dry-Run -- keine Datei geschrieben. Mit --write erneut aufrufen, um zu schreiben.)");
  }
}

main();
