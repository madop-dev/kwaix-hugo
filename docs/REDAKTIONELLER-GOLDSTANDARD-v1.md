# KWAIX Redaktioneller Goldstandard v1.0

Drei verbindliche Referenzseiten, vollständig redaktionell ausgearbeitet, QA-fehlerfrei. Dienen als Qualitätsmaßstab für alle zukünftigen Serienproduktionen der Content Factory.

Datum: 2026-06-30

---

## Auswahl und Kombinationstypen

| Seite | Kombinationstyp | Status vor diesem Schritt | Status nach diesem Schritt |
|---|---|---|---|
| [KI-Training SHK Freiburg](/ki-training-shk-freiburg/) | Region×Gewerk | Vollständig, aber 2 QA-Defekte | Vollständig, QA-fehlerfrei |
| [KI-Training Elektro Zürich](/ki-training-elektro-zuerich/) | Region×Gewerk | `[REDAKTIONELL]`-Platzhalter (Batch 01) | Vollständig redaktionell neu erstellt, QA-fehlerfrei |
| [Industrie × Baustellendokumentation](/branchen/industrie/baustellendokumentation/) | Branche×UseCase | Vollständig, aber 2 QA-Defekte | Vollständig, QA-fehlerfrei |

Bewusste Auswahl: beide produktionsreifen Kombinationstypen sind vertreten, drei unterschiedliche Länder (DE-Region Freiburg, CH-Region Zürich, branchenweite Seite ohne Regionsbezug), drei unterschiedliche Suchintentionen.

---

## Elektro Zürich — vollständig neu ausgearbeitet

Einzige der drei Seiten mit echten `[REDAKTIONELL]`-Platzhaltern aus Batch 01. Redaktionelle Differenzierung:

**Zentrale Erzählachse:** Zürich ist eine Finanz- und Technologiestadt, kein Handwerksstandort (`region.wirtschaftsprofil`: "Finanzsektor, Beratung, Technologie und Versicherung"). Das erzeugt zwei reale, recherchierbare Effekte für Elektrobetriebe vor Ort: einen engen Arbeitsmarkt (Wettbewerb um Fachkräfte gegen besser zahlende Bürojobs) und eine anspruchsvolle Kundschaft (Tempo- und Qualitätserwartung aus der eigenen Branche). Diese Spannung trägt Hero, Einleitung, Cards und FAQ gleichermaßen — keine austauschbare Floskel.

**Use-Case-Bezug:** Elektro hat als einziges der fünf Gewerke `Recruiting` statt `Kundenkommunikation`/`Wissensmanagement` als dritten Use-Case (Masterdaten-Fakt). Die Seite macht daraus die Hauptdifferenzierung gegenüber SHK Freiburg, statt das Faktum zu ignorieren.

**KI-Tool-Bezug:** ChatGPT/Microsoft Copilot allgemein, BauGPT für baunahe Dokumentation — konsistent mit dem Tool-Set aus den Masterdaten, im Fließtext eingeordnet statt als Aufzählung präsentiert.

**FAQ:** 5 Items, davon 4 individuell formuliert (Zürich+Elektro-spezifisch) + Pflichtblock Art. 4. Keine Überschneidung mit Fragen anderer Seiten (automatisiert geprüft).

**Title/Description:** "KI-Training Elektro Zürich: Angebote & Fachkräfte" (49 Zeichen) / 155 Zeichen Description im Zielband 140–160. OpenGraph-Description wird automatisch aus demselben `description`-Feld übernommen (kein separates Feld im Schema vorgesehen, `layouts/partials/seo/meta.html:10`).

`draft: true` → `draft: false` gesetzt — Seite ist veröffentlichungsfähig.

---

## Nachträglich behobene Defekte (SHK Freiburg, Industrie×Baustellendokumentation)

Beide Seiten waren bereits vollständig redaktionell ausgearbeitet (kein `[REDAKTIONELL]`-Marker), bestanden aber den heutigen, verschärften QA-Standard nicht. Auf Rückfrage freigegeben, da alle drei Seiten als Goldstandard QA-fehlerfrei sein müssen:

| Seite | Defekt | Fix |
|---|---|---|
| SHK Freiburg | Pflicht-FAQ-Block Art. 4 fehlte komplett im Frontmatter (`faqItems`) — vorhanden nur im Seitentext, nicht im FAQPage-Schema | Pflichtblock ergänzt (`faq-pflicht.js`-Wortlaut) |
| SHK Freiburg | Description 167 Zeichen (über 160) | Auf 142 Zeichen gekürzt, inhaltlich unverändert |
| Industrie×Baustellendokumentation | Title 67 Zeichen (Ziel ≤60) | Auf 59 Zeichen gekürzt: "Baustellendokumentation in der Industrie: Montage & Abnahme" |
| Industrie×Baustellendokumentation | Description 181 Zeichen (über 160) | Auf 152 Zeichen gekürzt, inhaltlich unverändert |

Keine inhaltlichen Aussagen verändert, nur Längen-Korrekturen und ein fehlender Pflichtblock.

---

## QA-Ergebnisse (final, nach allen Fixes)

| Prüfung | SHK Freiburg | Elektro Zürich | Industrie×Baustellendokumentation |
|---|---|---|---|
| Pflichtfeld-Vollständigkeit | OK | OK | OK |
| FAQ-Mindestanzahl | OK (5 Items) | OK (5 Items) | OK (4 Items) |
| Pflicht-FAQ Art. 4 | OK | OK | OK |
| FAQ-Differenzierung | OK (4 Fragen geprüft) | OK (4 Fragen geprüft) | OK (3 Fragen geprüft) |
| Title-Länge | OK (60 Zeichen) | OK (49 Zeichen) | OK (59 Zeichen) |
| Description-Länge | OK (142 Zeichen) | OK (155 Zeichen) | OK (152 Zeichen) |
| Canonical/URL-Konsistenz | OK | OK | OK |
| dimension-Pfad-Plausibilität | OK | OK | OK |
| Slug-Eindeutigkeit | OK | OK | OK |

**Alle drei Seiten: vollständig PASSED, 0 WARN, 0 FAIL.**

### Build- und Cross-Page-Verifikation

- Hugo-Build (`--cleanDestinationDir`): fehlerfrei, Exit 0
- Schema.org je Seite: `Service`+`FAQPage`+`BreadcrumbList` (Region×Gewerk), `HowTo`+`FAQPage`+`BreadcrumbList` (Branche×UseCase) — korrekt
- Canonical: 3/3 exakte Übereinstimmung mit der erwarteten URL
- "Verwandte Seiten"-Block: auf allen 3 Seiten im gerenderten HTML vorhanden
- Cross-Page Duplicate-Check (Title, FAQ exkl. Pflichtblock) über alle 3 Seiten: 0 Title-Dubletten, 0 FAQ-Dubletten

---

## Status

Alle drei Seiten sind `draft: false` und damit Teil des Produktions-Builds. Sie gelten ab sofort als verbindlicher redaktioneller Qualitätsmaßstab für die KWAIX-Plattform: jede künftige Serienseite muss in Differenzierungstiefe, FAQ-Schema-Vollständigkeit und Title-/Description-Längenband diesem Standard entsprechen.

*Bezug: [docs/PRODUKTIONSBERICHT-BATCH-01.md](PRODUKTIONSBERICHT-BATCH-01.md), [docs/PRODUKTIONSBERICHT-BATCH-01-v2.md](PRODUKTIONSBERICHT-BATCH-01-v2.md), [docs/CONTENT-FACTORY-v1.0.md](CONTENT-FACTORY-v1.0.md)*
