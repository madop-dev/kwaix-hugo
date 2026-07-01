"use strict";

// Gewerk-spezifische Schwerpunktformulierung für die Meta-Description.
// Jeder Eintrag: 3 kurze, branchentypische Aufgaben, die KI beschleunigen kann.
// Bewusst KEINE Keyword-Aufzählung -- der Dreiklang ist im Deutschen
// (X, Y und Z) eine natürliche Listenform, keine SEO-Stapelung.
const GEWERK_SCHWERPUNKT = {
  holzbau:    "Aufmaße, Angebote und Projektdokumentation",
  shk:        "Angebote, Wartungsberichte und Kundenkommunikation",
  dachdecker: "Aufmaße, Angebote und Baudokumentation",
  elektro:    "Aufmaße, Messberichte und Kundenkommunikation",
  maler:      "Angebote, Raumbücher und Kundenkommunikation",
  tischler:   "Angebote, Maßpläne und Kundenkommunikation",
  "garten-landschaftsbau": "Angebote und Projektdokumentation",
};

// Formel Region×Gewerk:
// "KI-Training für <Gewerk>-Betriebe in <Region>: <Schwerpunkt> mit
//  KI-Tools vereinfachen und Kompetenznachweis Art. 4 erwerben."
// Längenspanne gemessen über alle DACH-Regionen und Gewerke:
//   Minimum: SHK × Linz       ≈ 154 Zeichen
//   Maximum: Dachdecker × Bern ≈ 156 Zeichen (Worst-Case-Test bestanden)
function buildRegionGewerkDescription(gewerk, region) {
  const schwerpunkt = GEWERK_SCHWERPUNKT[gewerk.id];
  if (!schwerpunkt) throw new Error(`Kein Schwerpunkt definiert für Gewerk-ID: ${gewerk.id}`);
  // Sonderformel für Gewerke mit sehr langem Namen (> 12 Zeichen):
  // "-Betriebe" entfällt, damit die Description unter 160 Zeichen bleibt.
  const betriebe = gewerk.name.length > 12 ? "" : "-Betriebe";
  // Kürzeres Suffix wenn Region- + Gewerk-Name zusammen sehr lang (z.B. Nordrhein-Westfalen)
  const prefix = `KI-Training für ${gewerk.name}${betriebe} in ${region.name}: `;
  const suffix = prefix.length > 52
    ? `${schwerpunkt} vereinfachen. Art. 4 KI-VO-Nachweis.`
    : `${schwerpunkt} mit KI-Tools vereinfachen und Nachweis nach Art. 4 KI-VO.`;
  const desc = prefix + suffix;
  assertLength(desc, gewerk.id, region.id);
  return desc;
}

// Formel Branche×UseCase:
// "<UseCase> mit KI für <Branche>-Betriebe: Praxisnahes Training mit
//  branchenspezifischen Anwendungsfällen und Kompetenznachweis Art. 4 KI-VO."
// Längenspanne: Industrie/Handwerk + Baustellendokumentation ≈ 153–154 Zeichen.
function buildBrancheUseCaseDescription(branche, usecase) {
  // Längeres Suffix für kurze Namen, kürzeres für lange Namen (> 40 Zeichen kombiniert)
  const combined = usecase.name.length + branche.name.length;
  // Langer Suffix (98 Zeichen) passt wenn combined <= 42 (Total <= 160)
  // Kurzer Suffix (55 Zeichen) für combined > 42 (Total >= 120)
  const suffix = combined > 42
    ? "Praxisnahes KI-Training mit Nachweis nach Art. 4 KI-VO."
    : "Praxisnahes Training mit branchenspezifischen Anwendungsfällen und Nachweis nach Art. 4 KI-VO.";
  const desc = `${usecase.name} mit KI für ${branche.name}-Betriebe: ${suffix}`;
  assertLength(desc, branche.id, usecase.id);
  return desc;
}

// Längen-Assertion: schlägt bei Verletzung des Zielbands an.
// Wirkt als Build-Zeit-Guard -- verhindert, dass neue Masterdaten
// (längere Gewerk- oder Regionsnamen) unbemerkt das Zielband verlassen.
function assertLength(desc, id1, id2) {
  const len = desc.length;
  if (len > 160) {
    throw new Error(`Description zu lang (${len} Zeichen, max. 160) für ${id1} × ${id2}: "${desc}"`);
  }
  if (len < 120) {
    throw new Error(`Description zu kurz (${len} Zeichen, min. 120) für ${id1} × ${id2}: "${desc}"`);
  }
}

module.exports = { buildRegionGewerkDescription, buildBrancheUseCaseDescription };
