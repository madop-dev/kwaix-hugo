# KWAIX Content Factory v1.0

Status: **produktionsreif für zwei Kombinationstypen, noch nicht für Serienerzeugung freigegeben.** Baut auf Domain Specification v1.1, Masterdata Schema v1.0 und Masterkatalog v1.0 auf. Implementierung unter `scripts/content-factory/`.

**Kombinationstyp 1 — Region×Gewerk:** Goldstandard-Cluster "Holzbau Freiburg", getestet im Dry-Run gegen die bestehenden Pilot-Kombinationen (Freiburg×Holzbau, Freiburg×SHK) — beide reproduzieren exakt den bestehenden Slug.

**Kombinationstyp 2 — Branche×Use-Case (neu):** Goldstandard-Cluster "Industrie × Baustellendokumentation" (`/branchen/industrie/baustellendokumentation/`), vollständig redaktionell ausgearbeitet, real-content-differenziert gegenüber dem branchenneutralen Use-Case-Hub, build-verifiziert. CLI-Aufruf: `node scripts/content-factory/generate.js --combo=branche-usecase --branche=<id> --usecase=<id>`.

**FAQ-Differenzierungs-Fix (nach erstem produktivem Testlauf, siehe `docs/CONTENT-FACTORY-TESTLAUF-v1.md`):** behoben, verifiziert gegen den Referenz-Cluster, siehe Punkt 7 und 11 unten.

**Bekannter, separater Folgepunkt (nicht Teil dieses Fixes):** `"in der ${branche.name}"` in `lede`/`herocta`/FAQ ist grammatikalisch nicht für jede Branche korrekt (z. B. "in der Handwerk" statt "im Handwerk" — Genus variiert je Branche). Betrifft Text-Templates generell, nicht die FAQ-Differenzierungslogik. Empfehlung: vor Serienerzeugung eine Genus-Zuordnungstabelle je Branche in den Masterdaten ergänzen oder die Formulierung auf ein genus-neutrales Muster umstellen (z. B. "für die Branche ${branche.name}").

---

## Teil A: Verbindliche Content-Regeln

### 1. Vollständig aus Masterdaten übernommen

Namen, IDs, Klassifikationsfelder (Klasse, Branchenreichweite, Förderrelevanz, Suchvolumen-Indikator), Preisspannen, Rechtsgrundlage-Verweise, alle Referenzpfade für `dimension`. Diese Felder werden 1:1 aus `data/*.yaml` übernommen, nie redaktionell überschrieben — Single Source of Truth ist die Masterdaten-Datei, nicht die Content-Seite.

### 2. Automatisch generiert

`title`-Grundgerüst, `eyebrow`, `canonical`, `url`, vollständiger `dimension`-Block, `heroCards` (Standard-3er-Muster), `kpiStrip`-Werte, CTA-Strings (`herocta`, `herocta2href`), Schema.org-JSON-LD (über `schemaType`, kein manueller Eingriff), der Pflicht-FAQ-Block "Kompetenznachweis Art. 4" (Regel 7).

### 3. Redaktionell gepflegt (Factory generiert das nicht)

Der differenzierende Lede-Satz, vertiefende Fließtext-Absätze mit echten Beispielen, kombinationsspezifische FAQ-Antworten (außer dem Pflichtblock), jede Freigabe-Entscheidung selbst (`draft: true` bleibt nach Generierung gesetzt, bis ein Mensch bestätigt), Anpassungen bei rechtlichen Änderungen. Die Implementierung markiert diese Felder explizit mit `[REDAKTIONELL]` im generierten Frontmatter, statt sie zu erraten — eine Seite mit `[REDAKTIONELL]`-Markern darf nicht veröffentlicht werden.

### 4. Aus anderen Entitäten referenziert, nie dupliziert

Trainingspreise/-format (Link auf Training-Entität, nicht kopierter Text), Zertifizierungstext (Link auf `/ki-verordnung/kompetenznachweis/`, nicht Volltext), Wissensbereich-Definitionen (Link/Snippet, nicht Volltext-Kopie). Verstoß gegen dieses Prinzip wäre die häufigste Ursache für Duplicate Content bei automatisierter Erzeugung.

### 5. Individuell pro Kombination erzeugt

Die Schnittmenge der tatsächlich gezeigten Use-Cases (abhängig von `gewerk.usecase_refs`, nicht alle global verfügbaren), die Auswahl der Differenzierungssignale (Lokalprofil vs. Förderrelevanz vs. Sprachen), die FAQ-Reihenfolge je nach `branchenreichweite`.

### 6. Interne Verlinkung

`dimension`-Feld ist für jede generierte Seite Pflicht und muss vollständig sein (alle anwendbaren Schlüssel: `region`, `branche`, `gewerk`, `unternehmensbereich`, `tools`, `usecases`). Jede Seite verlinkt mindestens einmal nach oben (übergeordneter Hub) und einmal nach unten (Use Case oder Training). **Kritische Regel, am Holzbau-Bug gelernt:** `dimension`-Pfade zeigen ausschließlich auf Content-Pfade (`site.GetPage`-auflösbar), niemals auf einen `url`-Frontmatter-Override. Der Generator leitet Region-Content-Pfade deshalb aus `region.seiten_pfad` ab, nicht aus `region.id` (siehe `templates.js::regionContentPath`).

### 7. FAQ-Generierung

Mindestens 3 Items pro Seite. Pflicht: exakt ein Item zum Kompetenznachweis Art. 4, wortgleich aus der Vorlage (`lib/faq-pflicht.js::pflichtFaqArt4`) — verhindert Drift zwischen hunderten Seiten. Die restlichen Items werden aus den referenzierten Use-Cases abgeleitet, aber nicht automatisch formuliert (Punkt 3) — der Generator legt FAQ-Fragen mit `[REDAKTIONELL]`-Antwort-Platzhalter an, keine generischen Phrasen.

**Update (FAQ-Differenzierungs-Fix, nach erstem Testlauf):** Implementiert in `lib/faq-builder.js`. Jede Nicht-Pflicht-FAQ-Frage bindet mindestens zwei unterscheidende Bezeichner ein (Region×Gewerk: Gewerk- und Regionsname; Branche×Use-Case: Branche- und Use-Case-Name) und variiert ihre Formulierung nach `usecase.suchintention` (transaktional → "Lohnt sich KI für..."; informational → "Wie unterstützt KI..."). Bei Region×Gewerk kommt zusätzlich eine Frage hinzu, die `region.wirtschaftsprofil` direkt aufgreift — liefert pro Region eine faktisch einzigartige, zitierfähige Antwort statt einer generischen Floskel (siehe Punkt 10, GEO-Eignung). Automatisierter Regressionsschutz: `qa.js::checkFaqDifferentiation` prüft bei jedem Lauf, dass jede Nicht-Pflicht-Frage einen der unterscheidenden Begriffe enthält, und blockiert sonst das Schreiben (`FAIL`).

### 8. Meta-Title / Description / Canonical / OpenGraph

- **Title:** Formel `KI-Training <Gewerk/Use-Case> <Region>: <Differenzierung>`, Zielwert ≤ 60 Zeichen, QA-Warnung ab 65.
- **Description:** Pflicht-Keyword + Erwähnung Kompetenznachweis, Zielband 150–160 Zeichen, QA-Warnung außerhalb.
- **Canonical:** muss exakt mit `url` übereinstimmen — automatisch geprüft (`qa.js::checkCanonicalMatchesUrl`).
- **OpenGraph:** wird vom bestehenden Theme automatisch aus `title`/`description` abgeleitet, kein separates Factory-Feld nötig (kein eigener OG-Layer in diesem Repo gefunden — falls das Theme das nicht automatisch tut, ist das ein offener technischer Punkt, kein Content-Factory-Thema).

### 9. Schema.org automatisch erzeugt

`schemaType` fix pro Entitätstyp (Tabelle aus Domain Specification 10): `service` (Region/Branche/Gewerk-Kombinationen, Zertifizierung), `howto` (Use Case), `softwareapplication` (KI-Tool), `course` (Training). FAQ → `FAQPage` automatisch über bestehendes `faqItems`-Frontmatter. Breadcrumb automatisch über Hugo `.Parent`. Kein manueller JSON-LD-Eingriff in einer generierten Seite zulässig.

### 10. AI-Search-/GEO-Regeln

Erster Fließtext-Absatz muss eine eigenständig zitierfähige Kurzantwort enthalten (Featured-Snippet-Format: Frage im Kontext beantwortbar ohne weiteren Kontext). FAQ-Antworten müssen vollständige, eigenständige Sätze sein, keine Verweise wie "siehe oben". Terminologie pro Entität konsistent — der Generator verwendet immer `entity.name` aus den Masterdaten, nie eine Redaktions-Variante, um Synonym-Drift zwischen Seiten zur selben Entität zu verhindern.

### 11. Pre-Publish-Qualitätsprüfungen

Implementiert in `lib/qa.js`, automatisch bei jedem Lauf: Pflichtfeld-Vollständigkeit, FAQ-Mindestanzahl (≥3), Pflicht-FAQ-Vorhandensein, **FAQ-Differenzierung** (neu, siehe Punkt 7), Title-/Description-Längenprüfung, Canonical/URL-Konsistenz, `dimension`-Pfad-Plausibilität, Slug-Eindeutigkeit gegen den bestehenden Content-Baum. Ein `FAIL` blockiert das Schreiben vollständig (Exit-Code 1), ein `WARN` lässt den Lauf durch, wird aber protokolliert.

### 12. Duplicate Content / Keyword-Kannibalisierung

Vor jeder Generierung: Generierungsschwellen-Pflichtprüfung (`lib/thresholds.js`, identisch zu Domain Spec Abschnitt 6 — Suchvolumen, Inhaltstiefe, Wiederverwendung, Konversionsrelevanz) und Differenzierungspflicht (mindestens ein individuelles Unterscheidungsmerkmal wie Lokalprofil oder Förderrelevanz, sonst Abbruch). Slug-Eindeutigkeitsprüfung (Punkt 11) verhindert zusätzlich technische Dubletten.

---

## Teil B: Technische Spezifikation des Generators

### Eingabedaten

- Produktive Masterdaten unter `data/<typ>/<id>.yaml` (Masterdata Schema v1.0).
- Kombinationsanfrage über CLI-Argumente, aktuell unterstützt: `--region=<id> --gewerk=<id>` (Region×Gewerk, der im Referenz-Cluster validierte Pfad). Weitere Kombinationstypen sind Erweiterungspunkte (siehe unten), noch nicht implementiert.
- `--write` schaltet von Dry-Run (Standard) auf tatsächliches Schreiben um.

### Verarbeitungslogik (`generate.js`)

1. **Laden:** `data-loader.js` liest die Basis-Entität und löst alle `<typ>:<id>`-Referenzen rekursiv auf (`resolveRef`/`resolveRefs`). Fehlt eine Referenz, wird sofort mit Fehlermeldung abgebrochen — keine Teilverarbeitung.
2. **Schwellenprüfung:** `thresholds.js::checkThresholds` gegen die vier Domain-Spec-Kriterien.
3. **Differenzierungsprüfung:** `thresholds.js::checkDifferentiation`.
4. **Frontmatter-Ableitung:** `templates.js` baut das vollständige Frontmatter-Objekt nach Goldstandard-Muster, markiert nicht ableitbare Felder mit `[REDAKTIONELL]`.
5. **Pre-Publish-QA:** `qa.js::runAll` gegen das erzeugte Frontmatter plus Ziel-Slug.
6. **Ausgabe:** bei `--write` und bestandener QA wird `content/<slug>/index.md` geschrieben; ohne `--write` nur Konsolenbericht.

### Ausgabestruktur

Hugo-Markdown mit YAML-Frontmatter (`js-yaml`-Dump), Body-Bereich mit Platzhalter-Hinweis auf die nach Goldstandard zu ergänzenden `{{% section %}}`/`{{< cards >}}`/`{{< cta >}}`-Shortcode-Blöcke. Zielpfad exakt nach Domain Specification Abschnitt 8 (URL-System).

### Validierungsschritte

Siehe Teil A, Punkte 11 und 12 — technisch identisch in `lib/qa.js` und `lib/thresholds.js` implementiert, nicht nur dokumentiert.

### Erweiterungspunkte

- **Weitere Kombinationstypen** (Branche×Use-Case, Gewerk×Use-Case, KI-Tool×Branche): jeweils eine neue `build<Combo>()`-Funktion in `generate.js` plus eine neue `<combo>Frontmatter()`-Funktion in `templates.js`, nach demselben Muster wie `buildRegionGewerkCombo`/`regionGewerkFrontmatter`.
- **Neue QA-Regeln:** zusätzliche Funktion in `qa.js`, in `runAll()` registrieren.
- **Neue `schemaType`-Werte:** Template ergänzt `schemaType`-Feld, JSON-LD-Zweig in `layouts/partials/seo/jsonld.html` muss parallel ergänzt werden (siehe Domain Spec 10).
- **Body-Text-Generierung:** aktuell bewusst nicht automatisiert (Regel 3). Ein künftiger Erweiterungspunkt wäre ein optionaler, klar gekennzeichneter Textbaustein-Generator pro Use-Case — explizit nicht Teil von v1.0, da Risiko für generischen/redundanten Content.

### Fehlerbehandlung

- **Harter Abbruch (Exit-Code 1), keine Datei geschrieben:** fehlende Masterdaten-Referenz, nicht erfüllte Generierungsschwelle, fehlende Differenzierung, jeder QA-`FAIL`.
- **Warnung, Lauf wird fortgesetzt:** QA-`WARN` (z. B. Description-Länge außerhalb des Zielbands) — wird protokolliert, blockiert aber nicht, da diese Fälle redaktionelle Nachschärfung statt Abbruch verdienen.
- **Keine stillen Fallbacks:** der Generator rät an keiner Stelle fehlende Werte, sondern bricht ab oder markiert explizit `[REDAKTIONELL]`.

---

## Kombinationstyp 2: Branche × Use Case (produktionsreif)

**URL-Muster (final festgelegt):** `/branchen/<branche>/<usecase>/`, technisch aus demselben Grund wie beim Gewerk-Hub (Domain Spec 4.3) unter eigenem Content-Pfad `content/<branche>-<usecase>/index.md` mit `url`-Override angelegt — kein Unterordner einer bestehenden Leaf-Bundle-Branchenseite.

**Differenzierungsregel (Domain Spec Abschnitt 6, jetzt im Code umgesetzt):** Eine Branche×Use-Case-Seite entsteht nur, wenn `usecase.branchenreichweite == "branchenspezifisch"` UND die Branche in `usecase.branchen_refs` steht — d. h. die Auswertung "Ausprägung erkennbar verschieden vom universellen Hub" ist jetzt eine harte, automatisierte Prüfung (`thresholds.js::checkDifferentiation`), kein redaktionelles Ermessen mehr.

**Goldstandard-Cluster:** Branche Industrie × Use Case Baustellendokumentation. Redaktionell vollständig ausgearbeitet mit echter inhaltlicher Differenzierung zum branchenneutralen Use-Case-Hub (Montage-/Inbetriebnahme-/Abnahmeprotokolle über mehrtägige Anlagenprojekte statt einzelnes Übergabeprotokoll nach einem Termin). Build-verifiziert: `HowTo`-Schema, `FAQPage`-Schema, automatische Verlinkung zu Use-Case-Hub und Unternehmensbereich über `related-context.html`, manuelle Rückverlinkung von der Branchen-Hub-Seite ergänzt.

## Selbsttest-Nachweis (Dry-Run, keine Seiten erzeugt)

```
node scripts/content-factory/generate.js --region=freiburg --gewerk=holzbau
node scripts/content-factory/generate.js --region=freiburg --gewerk=shk
```

Beide Läufe: alle Generierungsschwellen und Differenzierungssignale bestanden, alle Pre-Publish-QA-Checks bis auf die erwartete Slug-Kollision bestanden (`ki-training-holzbau-freiburg`, `ki-training-shk-freiburg` existieren bereits — der Generator erkennt das korrekt und bricht ab, statt zu überschreiben). Das belegt: Der Generator reproduziert exakt die Ziel-URLs der bestehenden Goldstandard-Seiten aus reinen Masterdaten heraus.

**Offene Abhängigkeit, beim Selbsttest aufgedeckt:** Die Masterdaten-Vervollständigung (Trainings, Zertifizierungen, Wissensbereiche, Unternehmensbereiche, Ressourcen) war zum Zeitpunkt dieses Tests erst teilweise abgeschlossen. Für den Selbsttest wurden die drei zwingend nötigen Entitäten (`training:ki-training-live`, `zertifizierung:kompetenznachweis-art4`, `wissensbereich:artikel-4-ki-vo`) mit realen, bereits extrahierten Werten ergänzt. Die übrigen ausstehenden Masterdaten-Entitäten aus dem Masterkatalog v1.0 sind weiterhin offen und sollten vor jeder Serienerzeugung vervollständigt werden.

---

*Ende der KWAIX Content Factory v1.0. Keine Seiten wurden in Serie erzeugt — ausschließlich der Generator selbst wurde spezifiziert, implementiert und im Dry-Run gegen den Referenz-Cluster verifiziert.*
