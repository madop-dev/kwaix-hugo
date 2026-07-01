"use strict";

// Baut den Hugo-Markdown-Body für Region×Gewerk-Seiten aus Masterdaten.
// Ziel: wirtschaftsprofil-verankerte Differenzierung ohne manuelle Texterstellung.
// Jeder Abschnitt ist datenbankgestützt, nicht generisch.

// Gewerk-spezifische Herausforderung im lokalen Kontext
function gewerkChallenge(gewerk, region) {
  const wp = region.wirtschaftsprofil;
  const n = region.name;
  const g = gewerk.name;
  switch (gewerk.id) {
    case "holzbau":
      return `${n}s Wirtschaft, geprägt von ${wp}, schafft für Holzbau-Betriebe Aufträge, bei denen Nachhaltigkeit und Schnelligkeit gleichzeitig gefordert werden, von Büroerweiterungen bis Aufstockungen auf bestehenden Gebäuden. Angebote müssen schnell stehen, Projektdokumentation muss auch nach Monaten noch nachvollziehbar sein. KI-Training setzt genau dort an, ohne die statische Planung zu ersetzen.`;
    case "shk":
      return `${n} ist geprägt von ${wp}. Das formt die Kundschaft von SHK-Betrieben: anspruchsvolle Gewerbe- und Privatkunden, die Angebote erwarten, die schnell kommen, Wartungsprotokolle, die nachvollziehbar sind, und Terminkommunikation, die zu ihren eigenen Abläufen passt. KI-Training setzt dort an, wo Schreibarbeit Zeit kostet, die eigentlich dem nächsten Einsatz gehört.`;
    case "dachdecker":
      return `${n}s Wirtschaft, von ${wp} geprägt, bringt Dachdecker-Betrieben Kunden mit klaren Qualitätserwartungen, von Privathäusern bis Gewerbeimmobilien. Angebote, Baudokumentation und Fördernachweise müssen schnell und lückenlos sein. KI-Training hilft, diesen administrativen Standard effizient zu halten, ohne die Facharbeit zu ersetzen.`;
    case "elektro":
      return `${n} mit seiner Wirtschaftsstruktur aus ${wp} bringt Elektrobetrieben ein breites Kundenprofil: von anspruchsvollen Gewerbekunden bis zu privaten Bauherren mit hohen Erwartungen. Gleichzeitig ist der Arbeitsmarkt für Elektrofachkräfte eng, die Konkurrenz um Nachwuchs real. KI-Training hilft bei Angeboten, Dokumentation und Stellenausschreibungen.`;
    case "maler":
      return `${n}s Wirtschaftsstruktur, geprägt von ${wp}, bestimmt das Kundenprofil von Maler-Betrieben: von terminkritischen Gewerbeprojekten bis zu qualitätsbewussten Privatkunden. Angebote, Raumbücher und Kundenkommunikation müssen dem Tempo und Anspruch dieser Kundschaft entsprechen. KI-Training hilft, diesen Standard ohne Mehraufwand zu halten.`;
    default:
      return `${n}, bekannt für ${wp}, stellt ${g}-Betriebe vor spezifische Anforderungen an Angebote, Dokumentation und Kundenkommunikation. KI-Training setzt genau dort an.`;
  }
}

// Gewerk-spezifische Karten (6 Stück)
function gewerkCards(gewerk, region) {
  const g = gewerk.name;
  const r = region.name;
  switch (gewerk.id) {
    case "holzbau":
      return [
        { icon: "prompt", title: `Angebote für ${g}projekte`, text: `Angebote aus Aufmaßdaten klar und schnell formulieren, auch bei komplexen Konstruktionen.` },
        { icon: "backlog", title: "Projektdokumentation", text: `Bauabschnitte und Übergaben strukturiert und nachvollziehbar festhalten.` },
        { icon: "training", title: "Wissensmanagement", text: `Erfahrungswissen zu Konstruktionsdetails und bewährten Lösungen systematisch dokumentieren.` },
        { icon: "prompt", title: "Kundenkommunikation", text: `Statusupdates und Rückfragen für Privat- und Gewerbekunden klar formulieren.` },
        { icon: "policy", title: "Nachhaltigkeitsdokumentation", text: `Holzherkunft und CO2-Bilanz für ESG-bewusste Kunden aufbereiten.` },
        { icon: "proof", title: "Kompetenznachweis", text: `Dokumentierter Nachweis nach Artikel 4 KI-Verordnung für alle Teilnehmenden.` },
      ];
    case "shk":
      return [
        { icon: "prompt", title: "Angebote für Heizung & Sanitär", text: `Angebote aus Aufmaßdaten und Gebäudedaten schnell und verständlich formulieren.` },
        { icon: "backlog", title: "Wartungsprotokolle", text: `Wartungs- und Inspektionsberichte aus Stichpunkten strukturiert erstellen.` },
        { icon: "prompt", title: "Kundenkommunikation", text: `Terminabsprachen und Statusupdates für Privat- und Gewerbekunden klar formulieren.` },
        { icon: "policy", title: "Förderanträge", text: `BAFA- und KfW-Anträge für Heizungsmodernisierungen inhaltlich vorbereiten.` },
        { icon: "training", title: "Energieberatung dokumentieren", text: `Beratungsgespräche zu Förderfähigkeit und Einsparpotenzial nachvollziehbar zusammenfassen.` },
        { icon: "proof", title: "Kompetenznachweis", text: `Dokumentierter Nachweis nach Artikel 4 KI-Verordnung für alle Teilnehmenden.` },
      ];
    case "dachdecker":
      return [
        { icon: "prompt", title: "Angebote für Dacharbeiten", text: `Angebote für Neudächer, Sanierungen und PV-Nachrüstung aus Aufmaßdaten formulieren.` },
        { icon: "backlog", title: "Baudokumentation", text: `Ausführungsschritte und Materialien nachvollziehbar für Kunden und Behörden dokumentieren.` },
        { icon: "training", title: "Wissensmanagement Dachsysteme", text: `Erfahrungswissen zu Dachkonstruktionen und Materialien systematisch festhalten.` },
        { icon: "prompt", title: "Kundenkommunikation", text: `Statusupdates und Terminabsprachen für Privat- und Gewerbekunden klar formulieren.` },
        { icon: "policy", title: "Behördenunterlagen", text: `Unterlagen für Bauanträge und Förderprogramme strukturiert vorbereiten.` },
        { icon: "proof", title: "Kompetenznachweis", text: `Dokumentierter Nachweis nach Artikel 4 KI-Verordnung für alle Teilnehmenden.` },
      ];
    case "elektro":
      return [
        { icon: "prompt", title: "Angebote für Elektroinstallationen", text: `Angebote aus Aufmaß- und Materialdaten schnell und verständlich formulieren.` },
        { icon: "backlog", title: "Mess- und Abnahmeprotokolle", text: `Messberichte und Übergabeprotokolle aus Stichpunkten strukturiert erstellen.` },
        { icon: "training", title: "Stellenausschreibungen, die auffallen", text: `Im lokalen Arbeitsmarkt Anzeigen formulieren, die für das Elektrohandwerk überzeugen.` },
        { icon: "prompt", title: "Kundenkommunikation", text: `Terminabsprachen und Statusupdates für Privat- und Gewerbekunden klar formulieren.` },
        { icon: "policy", title: "Normgerechte Dokumentation", text: `Installationen nach aktuellen Normen nachvollziehbar dokumentieren.` },
        { icon: "proof", title: "Kompetenznachweis", text: `Dokumentierter Nachweis nach Artikel 4 KI-Verordnung für alle Teilnehmenden.` },
      ];
    case "maler":
      return [
        { icon: "prompt", title: "Angebote für Malerarbeiten", text: `Angebote aus Aufmaßdaten schnell und überzeugend formulieren.` },
        { icon: "backlog", title: "Raumbücher", text: `Farbkonzepte und Ausführungsdetails strukturiert und einheitlich dokumentieren.` },
        { icon: "training", title: "Wissensmanagement Materialien", text: `Bewährte Farb- und Materialkombinationen systematisch festhalten.` },
        { icon: "prompt", title: "Kundenkommunikation", text: `Terminabsprachen und Statusupdates für Privat- und Gewerbekunden klar formulieren.` },
        { icon: "policy", title: "Farbberatung dokumentieren", text: `Beratungsgespräche zu Farbkonzepten nachvollziehbar zusammenfassen.` },
        { icon: "proof", title: "Kompetenznachweis", text: `Dokumentierter Nachweis nach Artikel 4 KI-Verordnung für alle Teilnehmenden.` },
      ];
    default:
      return [
        { icon: "prompt", title: "Angebote", text: `Angebote aus Aufmaßdaten schnell und überzeugend formulieren.` },
        { icon: "backlog", title: "Dokumentation", text: `Projekte und Einsätze nachvollziehbar dokumentieren.` },
        { icon: "proof", title: "Kompetenznachweis", text: `Dokumentierter Nachweis nach Artikel 4 KI-Verordnung für alle Teilnehmenden.` },
      ];
  }
}

// Gewerk-spezifische Body-FAQ-Fragen (anders als frontmatter-FAQ, ergänzend)
function gewerkBodyFaq(gewerk, region) {
  const g = gewerk.name;
  const r = region.name;
  switch (gewerk.id) {
    case "holzbau":
      return [
        { q: `Ersetzt KI die statische Planung oder Bauleitung?`, a: `Nein. KI unterstützt bei Angeboten, Dokumentation und Wissensmanagement, die statische Planung bleibt beim Fachpersonal.` },
        { q: `Lohnt sich das auch für kleine ${g}-Betriebe?`, a: `Ja, gerade bei 2–5 Personen ist die Inhaberin oder der Meister oft selbst für Angebote zuständig, dort wirkt die Zeitersparnis am direktesten.` },
        { q: `Wie hilft KI beim Wissenstransfer bei ausscheidendem Fachpersonal?`, a: `KI ersetzt keine Erfahrung, hilft aber, Wissen erfahrener Mitarbeitender strukturiert zu dokumentieren, bevor es mit deren Ausscheiden verloren geht.` },
      ];
    case "shk":
      return [
        { q: `Ersetzt KI die technische Auslegung der Anlage?`, a: `Nein. KI unterstützt bei Angeboten, Protokollen und Kommunikation, die technische Auslegung bleibt beim Fachpersonal.` },
        { q: `Lohnt sich das auch für kleine SHK-Betriebe?`, a: `Ja, gerade bei 2–5 Personen ist die Inhaberin oder der Meister oft selbst für Angebote zuständig, dort wirkt die Zeitersparnis am direktesten.` },
        { q: `Wie geht KI mit vertraulichen Gebäudedaten um?`, a: `Im Training arbeiten wir mit anonymisierten Beispielen. Welche Daten in welche Tools eingegeben werden dürfen, klären wir im Vorgespräch.` },
      ];
    case "dachdecker":
      return [
        { q: `Ersetzt KI die statische Prüfung der Dachkonstruktion?`, a: `Nein. KI unterstützt bei Angeboten, Dokumentation und Wissensmanagement, die statische Prüfung bleibt beim Fachpersonal.` },
        { q: `Lohnt sich das auch für kleine Dachdecker-Betriebe?`, a: `Ja, gerade bei 2–5 Personen ist die Inhaberin oder der Meister oft selbst für Angebote zuständig, dort wirkt die Zeitersparnis am direktesten.` },
        { q: `Hilft KI auch bei Förderanträgen für Dachsanierungen?`, a: `Ja, KI hilft beim inhaltlichen Aufbereiten von Förderanträgen. Die fachliche und technische Prüfung der Förderfähigkeit bleibt beim Fachpersonal.` },
      ];
    case "elektro":
      return [
        { q: `Ersetzt KI die technische Ausführung oder Abnahme?`, a: `Nein. KI unterstützt bei Angeboten, Messberichten und Stellenausschreibungen, die technische Ausführung bleibt beim Fachpersonal.` },
        { q: `Lohnt sich das auch für kleine Elektrobetriebe?`, a: `Ja, gerade bei 2–5 Personen ist die Inhaberin oder der Meister oft selbst für Angebote und Stellenanzeigen zuständig, dort wirkt die Zeitersparnis am direktesten.` },
        { q: `Wie hilft KI konkret beim Fachkräftemangel im Elektrohandwerk?`, a: `KI ersetzt keine Ausbildungsplätze, hilft aber Stellenausschreibungen so zu formulieren, dass das Elektrohandwerk als attraktive Karriereoption erscheint.` },
      ];
    case "maler":
      return [
        { q: `Ersetzt KI die handwerkliche Ausführung?`, a: `Nein. KI unterstützt bei Angeboten, Raumbüchern und Kommunikation, die handwerkliche Ausführung bleibt beim Fachpersonal.` },
        { q: `Lohnt sich das auch für kleine Maler-Betriebe?`, a: `Ja, gerade bei 2–5 Personen ist die Inhaberin oder der Meister oft selbst für Angebote zuständig, dort wirkt die Zeitersparnis am direktesten.` },
        { q: `Klingen KI-generierte Angebote nicht alle gleich?`, a: `Mit den richtigen Vorlagen und der eigenen Tonalität entsteht konsistente Qualität ohne Austauschbarkeit. Das ist Teil des Trainings.` },
      ];
    default:
      return [
        { q: `Ersetzt KI die Facharbeit?`, a: `Nein. KI unterstützt bei Angeboten, Dokumentation und Kommunikation, die Facharbeit bleibt beim Fachpersonal.` },
      ];
  }
}

// Generiert den vollständigen Hugo-Body als Markdown-String
function buildRegionGewerkBody({ gewerk, region, training, usecases }) {
  const g = gewerk.name;
  const r = region.name;
  const challenge = gewerkChallenge(gewerk, region);
  const cards = gewerkCards(gewerk, region);
  const bodyFaq = gewerkBodyFaq(gewerk, region);
  const mailSubject = `KI-Training%20${g.replace(/\s+/g, '%20')}%20${r.replace(/\s+/g, '%20')}%20anfragen`;
  const mailHref = `mailto:info@kwaix.de?subject=${mailSubject}`;
  const usecaseList = usecases.slice(0, 3).map(u => u.name).join(', ');

  const cardMarkup = cards.map(c =>
    `{{< card icon="${c.icon}" title="${c.title}" text="${c.text}" >}}`
  ).join('\n');

  const faqMarkup = bodyFaq.map(f =>
    `**${f.q}**\n${f.a}`
  ).join('\n\n');

  return `{{% section tone="plain" %}}

## ${g} in ${r}: Mehr Zeit für die Arbeit, weniger für Schreibarbeit

${challenge}

## Auf einen Blick

- **Für wen:** ${g}-Betriebe in ${r} mit ${gewerk.typische_projektgroesse} Mitarbeitenden
- **Typische Use Cases:** ${usecaseList}
- **Werkzeuge:** ChatGPT, Microsoft Copilot, ergänzend BauGPT für baunahe Dokumentation
- **Ergebnis:** Kompetenznachweis nach Artikel 4 KI-Verordnung für alle Teilnehmenden

{{< kpiStrip k1_label="Gewerk" k1_value="${g}" k2_label="Region" k2_value="${r}" k3_label="Training ab" k3_value="${training.preis_von} € netto" k4_label="Nachweis" k4_value="Art. 4 KI-VO" >}}

{{% /section %}}

{{% section tone="tint" %}}

## Typische Use Cases für ${g}-Betriebe in ${r}

{{< cards cols="3" >}}
${cardMarkup}
{{< /cards >}}

{{< cta primaryHref="${mailHref}" primaryText="Vorgespräch für ${g} ${r} anfragen" secondaryHref="/preise/ki-roi-rechner/" secondaryText="ROI berechnen" >}}

{{% /section %}}

{{% section tone="plain" %}}

## FAQ: KI-Training für ${g} in ${r}

${faqMarkup}

{{< cta primaryHref="${mailHref}" primaryText="KI-Training ${g} ${r} anfragen" secondaryHref="/branchen/ki-training-handwerk/" secondaryText="Branche Handwerk ansehen" >}}

{{% /section %}}
`;
}

module.exports = { buildRegionGewerkBody };
