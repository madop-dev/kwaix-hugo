"use strict";

// Standard-FAQ-Block, der laut Domain Specification auf jeder Schicht-1/2-Seite
// verpflichtend ist (Content-Factory-Regel 7: Pflichtblock Art. 4 KI-VO).
// Eigenes Modul, damit sowohl templates.js als auch faq-builder.js darauf
// zugreifen koennen, ohne einen zirkulaeren require zu erzeugen.
function pflichtFaqArt4() {
  return {
    q: "Was ist der Kompetenznachweis nach Artikel 4 KI-Verordnung?",
    a: "Seit 2. August 2025 müssen Unternehmen nachweisbar sicherstellen, dass Mitarbeitende mit KI-Kompetenz ausgestattet sind (Artikel 4, Verordnung (EU) 2024/1689). Unser Training liefert diesen Nachweis für jeden Teilnehmenden. Details: [Kompetenznachweis](/ki-verordnung/kompetenznachweis/).",
  };
}

module.exports = { pflichtFaqArt4 };
