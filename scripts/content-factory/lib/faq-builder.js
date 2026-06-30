"use strict";
const { pflichtFaqArt4 } = require("./faq-pflicht");

// FAQ-Differenzierungslogik (Content-Factory-Fix nach Testlauf-Befund 1).
//
// Vorher: die FAQ-Frage "Welche Aufgaben uebernimmt KI bei <Gewerk>-Betrieben
// konkret?" war wortgleich auf jeder Region-Instanz desselben Gewerks --
// Duplicate-Content-/Kannibalisierungsrisiko im FAQPage-Schema.
//
// Jetzt: jede Frage bindet mindestens zwei unterscheidende Bezeichner ein
// (z.B. Gewerk + Region, oder Branche + Use-Case), und die Formulierung
// variiert nach usecase.suchintention (transaktional vs. informational) --
// dieselbe Aufgabe wird je Suchintention unterschiedlich gefragt, nicht nur
// unterschiedlich benannt.

function suchintentionFrage(usecase, subjektLabel) {
  if (usecase.suchintention === "transaktional") {
    return `Lohnt sich KI für ${usecase.name} bei ${subjektLabel}?`;
  }
  return `Wie unterstützt KI ${subjektLabel} beim Thema ${usecase.name}?`;
}

// Region x Gewerk: bis zu 4 individuelle Fragen + Pflichtblock.
function buildRegionGewerkFaq({ gewerk, region, usecases, training }) {
  const subjektLabel = `${gewerk.name}-Betrieben in ${region.name}`;
  const items = [];

  items.push({
    q: `Welche Aufgaben übernimmt KI bei ${subjektLabel} konkret?`,
    a: "[REDAKTIONELL: aus den referenzierten Use-Cases ableiten, mit Bezug auf das Gewerk und die Region formulieren.]",
  });

  // Zweite Frage: nutzt einen ANDEREN Use-Case als die erste (falls vorhanden)
  // und variiert die Formulierung nach dessen Suchintention -- verhindert,
  // dass zwei Fragen auf derselben Seite dieselbe Struktur wiederholen.
  const zweiterUseCase = (usecases || [])[1];
  if (zweiterUseCase) {
    items.push({
      q: suchintentionFrage(zweiterUseCase, subjektLabel),
      a: "[REDAKTIONELL]",
    });
  }

  // Regionale Differenzierung: nutzt das individuelle Wirtschaftsprofil der
  // Region als Frage-Gegenstand. Dieser Satz existiert je Region nur einmal
  // in den Masterdaten -- macht die Frage pro Konstruktion einzigartig und
  // liefert zugleich eine zitierfaehige, faktenbasierte Kurzantwort (GEO).
  if (region.wirtschaftsprofil) {
    items.push({
      q: `Was macht ${region.name} als Standort für ${gewerk.name}-Betriebe besonders?`,
      a: `[REDAKTIONELL, Ausgangspunkt aus Masterdaten: "${region.wirtschaftsprofil}". Auf 2-3 Saetze als eigenstaendig zitierbare Antwort ausbauen.]`,
    });
  }

  items.push({
    q: `Was kostet das ${gewerk.name}-Training in ${region.name}?`,
    a: `Ab ${training.preis_von} € netto für Teams bis 5 Personen, gestaffelt nach Teamgröße. Details unter [/preise/](/ki-training-kosten/).`,
  });

  items.push(pflichtFaqArt4());
  return items;
}

// Branche x Use Case: Differenzierung gegenueber dem branchenneutralen
// Use-Case-Hub ist hier die zentrale Anforderung (Domain Spec Abschnitt 6).
function buildBrancheUseCaseFaq({ branche, usecase, training }) {
  const subjektLabel = `${branche.name}-Betrieben`;
  const items = [];

  items.push({
    q: `Warum unterscheidet sich ${usecase.name} in der ${branche.name} vom allgemeinen Anwendungsfall?`,
    a: "[REDAKTIONELL: konkretes, branchentypisches Beispiel nennen, das den generischen Anwendungsfall klar abgrenzt.]",
  });

  items.push({
    q: suchintentionFrage(usecase, subjektLabel),
    a: "[REDAKTIONELL]",
  });

  items.push({
    q: `Was kostet das Training für ${branche.name}-Betriebe?`,
    a: `Ab ${training.preis_von} € netto für Teams bis 5 Personen, gestaffelt nach Teamgröße. Details unter [/preise/](/ki-training-kosten/).`,
  });

  items.push(pflichtFaqArt4());
  return items;
}

module.exports = { buildRegionGewerkFaq, buildBrancheUseCaseFaq, suchintentionFrage };
