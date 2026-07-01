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
  const desc = `KI-Training für ${gewerk.name}-Betriebe in ${region.name}: ${schwerpunkt} mit KI-Tools vereinfachen und Kompetenznachweis Art. 4 erwerben.`;
  assertLength(desc, gewerk.id, region.id);
  return desc;
}

// Formel Branche×UseCase:
// "<UseCase> mit KI für <Branche>-Betriebe: Praxisnahes Training mit
//  branchenspezifischen Anwendungsfällen und Kompetenznachweis Art. 4 KI-VO."
// Längenspanne: Industrie/Handwerk + Baustellendokumentation ≈ 153–154 Zeichen.
function buildBrancheUseCaseDescription(branche, usecase) {
  const desc = `${usecase.name} mit KI für ${branche.name}-Betriebe: Praxisnahes Training mit branchenspezifischen Anwendungsfällen und Kompetenznachweis Art. 4 KI-VO.`;
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
