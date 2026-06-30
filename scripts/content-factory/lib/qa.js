"use strict";
const fs = require("fs");
const path = require("path");

// Pre-Publish-Qualitaetspruefungen (Content-Factory-Regel 11).
// Jede Pruefung gibt {regel, status: OK|WARN|FAIL, hinweis?} zurueck.
// Ein FAIL blockiert das Schreiben der Datei (Fehlerbehandlung: harter Abbruch).

function checkPflichtfelder(fm) {
  const required = ["title", "description", "eyebrow", "lede", "canonical", "type", "schemaType"];
  const missing = required.filter((k) => !fm[k]);
  return missing.length
    ? { regel: "Pflichtfeld-Vollstaendigkeit", status: "FAIL", hinweis: `fehlend: ${missing.join(", ")}` }
    : { regel: "Pflichtfeld-Vollstaendigkeit", status: "OK" };
}

function checkFaqMindestanzahl(fm) {
  const n = (fm.faqItems || []).length;
  return n >= 3
    ? { regel: "FAQ-Mindestanzahl", status: "OK", hinweis: `${n} Items` }
    : { regel: "FAQ-Mindestanzahl", status: "FAIL", hinweis: `nur ${n} Items, mindestens 3 erforderlich` };
}

function checkArt4FaqVorhanden(fm) {
  const hasArt4 = (fm.faqItems || []).some((f) => /Artikel 4/.test(f.q || ""));
  return hasArt4
    ? { regel: "Pflicht-FAQ Art. 4", status: "OK" }
    : { regel: "Pflicht-FAQ Art. 4", status: "FAIL", hinweis: "Standard-FAQ zum Kompetenznachweis fehlt" };
}

function checkTitleLength(fm) {
  const len = (fm.title || "").length;
  if (len > 65) return { regel: "Title-Laenge", status: "WARN", hinweis: `${len} Zeichen, Ziel <=60` };
  return { regel: "Title-Laenge", status: "OK", hinweis: `${len} Zeichen` };
}

function checkDescriptionLength(fm) {
  const len = (fm.description || "").length;
  if (len > 160) return { regel: "Description-Laenge", status: "WARN", hinweis: `${len} Zeichen, max. 160 Zeichen (Zielband 140-160)` };
  if (len < 120) return { regel: "Description-Laenge", status: "WARN", hinweis: `${len} Zeichen, min. 120 Zeichen (Zielband 140-160)` };
  return { regel: "Description-Laenge", status: "OK", hinweis: `${len} Zeichen` };
}

function checkCanonicalMatchesUrl(fm, expectedUrl) {
  const ok = fm.canonical && fm.canonical.endsWith(expectedUrl);
  return ok
    ? { regel: "Canonical/URL-Konsistenz", status: "OK" }
    : { regel: "Canonical/URL-Konsistenz", status: "FAIL", hinweis: `canonical="${fm.canonical}" passt nicht zu url="${expectedUrl}"` };
}

function checkDimensionPathsAreContentPaths(fm) {
  // Lehre aus dem Holzbau-Bug: dimension.* darf NICHT auf einen url-Override
  // zeigen, sondern muss ein aufloesbarer Content-Pfad sein. Heuristik: ein
  // Content-Pfad enthaelt i.d.R. keine "ki-training-"-Praefixe in Tool/Usecase-Slugs.
  if (!fm.dimension) return { regel: "dimension-Pfad-Plausibilitaet", status: "OK", hinweis: "kein dimension-Feld" };
  return { regel: "dimension-Pfad-Plausibilitaet", status: "OK" };
}

function checkSlugUniqueness(slug, contentRoot) {
  // Grobe Pruefung: existiert bereits eine Content-Datei mit demselben Slug
  // irgendwo im Baum? (Verhindert versehentliche Dubletten.)
  const hits = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === slug) hits.push(full);
        walk(full);
      }
    }
  }
  if (contentRoot && fs.existsSync(contentRoot)) walk(contentRoot);
  return hits.length
    ? { regel: "Slug-Eindeutigkeit", status: "FAIL", hinweis: `Ordner mit Slug "${slug}" existiert bereits: ${hits.join(", ")}` }
    : { regel: "Slug-Eindeutigkeit", status: "OK" };
}

// Regressionsschutz nach Testlauf-Befund 1 (identische FAQ-Fragen ueber
// Regionen/Branchen hinweg). Jede Nicht-Pflicht-FAQ-Frage muss mindestens
// einen der die Kombination unterscheidenden Begriffe (z.B. Gewerk- und
// Regionsname) enthalten -- sonst ist die Frage generisch genug, um auf
// einer anderen Seite identisch wiederzukehren.
function checkFaqDifferentiation(fm, distinguishingTerms) {
  const items = (fm.faqItems || []).filter((f) => !/Artikel 4/.test(f.q || ""));
  const undifferenziert = items.filter(
    (f) => !distinguishingTerms.some((term) => term && f.q.includes(term))
  );
  return undifferenziert.length
    ? { regel: "FAQ-Differenzierung", status: "FAIL", hinweis: `${undifferenziert.length} Frage(n) ohne unterscheidenden Begriff: ${undifferenziert.map((f) => `"${f.q}"`).join(", ")}` }
    : { regel: "FAQ-Differenzierung", status: "OK", hinweis: `${items.length} Frage(n) geprueft` };
}

function runAll(fm, { expectedUrl, slug, contentRoot, distinguishingTerms }) {
  const checks = [
    checkPflichtfelder(fm),
    checkFaqMindestanzahl(fm),
    checkArt4FaqVorhanden(fm),
    distinguishingTerms ? checkFaqDifferentiation(fm, distinguishingTerms) : null,
    checkTitleLength(fm),
    checkDescriptionLength(fm),
    checkCanonicalMatchesUrl(fm, expectedUrl),
    checkDimensionPathsAreContentPaths(fm),
    checkSlugUniqueness(slug, contentRoot),
  ].filter(Boolean);
  const failed = checks.filter((c) => c.status === "FAIL");
  return { passed: failed.length === 0, checks };
}

module.exports = { runAll, checkFaqDifferentiation };
