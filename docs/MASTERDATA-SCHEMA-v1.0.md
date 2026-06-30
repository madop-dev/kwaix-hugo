# KWAIX Masterdata Schema v1.0

Begleitdokument zur [Domain Specification v1.0](DOMAIN-SPECIFICATION-v1.0.md), eingefroren im selben Sinne. Definiert ausschließlich die **Datenstruktur** für die zehn primären Entitäten — keine Inhalte, keine Seiten, keine Migration. Jede konkrete Dateninstanz (eine echte Region, ein echtes KI-Tool) wird erst in einem späteren Arbeitsschritt angelegt.

---

## 1. Grundprinzipien der Datenstruktur

1. **Trennung von Masterdaten und Content.** Masterdaten beschreiben eine Entität strukturiert und maschinenlesbar (`data/`). Eine Content-Seite (`content/`) entsteht erst, wenn die Generierungsschwellen aus der Domain Specification (Abschnitt 6) erfüllt sind. Eine Entität ohne eigene Seite bleibt reine Masterdaten — referenzierbar, aber ohne URL.
2. **Dateiformat: YAML.** Konsistent mit Hugo-Konvention (`site.Data`), eine Datei pro Entitätsinstanz, keine Sammeldateien — das hält Diffs klein und Merge-Konflikte selten.
3. **Verzeichnisstruktur:** ein Ordner pro Entitätstyp unter `data/`, Dateiname = ID der Instanz.
4. **ID-Schema:** kebab-case-Slug, eindeutig **innerhalb seines Entitätstyp-Ordners** (nicht global eindeutig nötig, da der Ordner den Typ disambiguiert).
5. **Referenzformat:** `<entitaetstyp>:<id>` als String (z. B. `branche:handwerk`). Das macht jede Referenz selbstbeschreibend und eindeutig auflösbar, unabhängig davon, ob die Zielentität bereits eine eigene Seite hat oder noch reine Masterdaten ist.
6. **Referenzielle Integrität ist Pflicht.** Jede Referenz muss auf eine existierende Datei im jeweiligen Ordner zeigen. Eine Validierung (Build-Schritt oder CI-Check) muss das vor jedem Deploy prüfen — Spezifikation dieser Prüfung in Abschnitt 13.

```
data/
├── regionen/<id>.yaml
├── branchen/<id>.yaml
├── gewerke/<id>.yaml
├── unternehmensbereiche/<id>.yaml
├── use-cases/<id>.yaml
├── ki-tools/<id>.yaml
├── trainings/<id>.yaml
├── zertifizierungen/<id>.yaml
├── wissensbereiche/<id>.yaml
└── ressourcen/<id>.yaml
```

7. **Gemeinsame Basisfelder** (in jeder Entität, nicht wiederholt aufgeführt):

| Feld | Typ | Pflicht | Bedeutung |
|---|---|---|---|
| `id` | string | ja | muss exakt dem Dateinamen ohne Endung entsprechen |
| `entitaetstyp` | enum | ja | einer der zehn Typnamen, redundant zum Ordner, aber für typsichere Validierung ohne Pfad-Parsing nötig |
| `name` | string | ja | Anzeigename, **nicht** SEO-Title — der SEO-Title entsteht erst auf Content-Ebene, falls eine Seite generiert wird |
| `status` | enum: `aktiv` / `inaktiv` | ja | `inaktiv` = Datensatz existiert, wird aber aktuell nirgends referenziert/verwendet (z. B. zurückgestellte Erweiterung) |
| `schicht` | enum: `1` / `2` / `3` / `4` | ja | Schichtzugehörigkeit gemäß Domain Specification Abschnitt 5.3 |
| `hat_eigene_seite` | boolean | ja | steuert, ob die Content-Engine für diese Instanz eine URL erwarten darf; `false` = reine Masterdaten |
| `seiten_pfad` | string oder `null` | nur wenn `hat_eigene_seite: true` | vollständiger Content-Pfad der zugehörigen Seite |

---

## 2. Region

**Ordner:** `data/regionen/<id>.yaml`
**ID-Beispielmuster:** `<stadt-slug>` (z. B. Stadt-Slug ohne Land-Präfix, da Land ein eigenes Feld ist, kein Pfadbestandteil der ID)

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `land` | enum: `DE` / `AT` / `CH` | ja | |
| `bundesland_kanton` | string | optional | |
| `wirtschaftsprofil` | string | ja | Kurzbeschreibung der lokalen Besonderheit (z. B. Solarwirtschaft, Grenzregion) |
| `branchenschwerpunkte` | list[ref:branche] | optional | |
| `sprachen` | list[string] | optional | ISO-639-1-Codes, nur wenn abweichend von `de` |
| `suchvolumen_indikator` | enum: `hoch` / `mittel` / `niedrig` | ja | Eingabe für Generierungsschwelle 1 (Domain Spec Abschnitt 6) |

**Referenzen:** `branchenschwerpunkte` → `branche:<id>` (n:n).

---

## 3. Branche

**Ordner:** `data/branchen/<id>.yaml`

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `hat_gewerke` | boolean | ja | steuert, ob Gewerk-Unterordnung zulässig ist |
| `typische_teamgroesse` | string | optional | z. B. „3–50 MA" |
| `standard_tools` | list[ref:ki-tool] | optional | branchenweite Empfehlung, unabhängig von einzelnen Use Cases |
| `standard_usecases` | list[ref:use-case] | optional | |
| `suchvolumen_indikator` | enum: `hoch` / `mittel` / `niedrig` | ja | |

**Referenzen:** `standard_tools` → `ki-tool:<id>` (n:n); `standard_usecases` → `use-case:<id>` (n:n).
**Validierungsregel (entitätsspezifisch):** wenn `hat_gewerke: false`, dürfen keine `gewerk`-Datensätze auf diese Branche per `branche_ref` zeigen (siehe Abschnitt 4) — Verstoß ist ein Build-Fehler, nicht nur eine Warnung.

---

## 4. Gewerk

**Ordner:** `data/gewerke/<id>.yaml`

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `branche_ref` | ref:branche | ja | Subtyp-Restriktion, **keine Vererbung** (Domain Spec 5.2) |
| `typische_projektgroesse` | string | optional | |
| `foerderrelevanz` | boolean | optional, Default `false` | |
| `usecase_refs` | list[ref:use-case] | ja, ≥1 | Teilmenge der branchenweiten Use Cases |
| `suchvolumen_indikator` | enum: `hoch` / `mittel` / `niedrig` | ja | |

**Referenzen:** `branche_ref` → `branche:<id>` (1:1, Pflicht); `usecase_refs` → `use-case:<id>` (n:n).
**Validierungsregel:** `branche_ref` muss auf eine Branche mit `hat_gewerke: true` zeigen.

---

## 5. Unternehmensbereich

**Ordner:** `data/unternehmensbereiche/<id>.yaml`

> Hinweis zur URL: Die fachliche Entität Unternehmensbereich ist von ihrer aktuellen Content-URL (`/use-cases/<bereich>/`, siehe Domain Spec 5.4/12.1) entkoppelt. Das Masterdaten-Feld `seiten_pfad` trägt deshalb vorerst den Bestandspfad, nicht den fachlich „korrekten" Pfad — die Migration ist ein eigenständiger, zurückgestellter Task und betrifft nur die Content-Ebene, nicht dieses Schema.

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `usecase_refs` | list[ref:use-case] | ja, ≥3 | |

**Referenzen:** `usecase_refs` → `use-case:<id>` (1:n aus Sicht des Use Case, n:1 invertiert).
**Validierungsregel:** jeder in `usecase_refs` referenzierte Use Case muss in seinem eigenen Datensatz (`unternehmensbereich_ref`, siehe Abschnitt 6) exakt auf diesen Unternehmensbereich zurückverweisen — beidseitige Konsistenzpflicht, da die Beziehung n:1 ist und nicht divergieren darf.

---

## 6. Use Case

**Ordner:** `data/use-cases/<id>.yaml`

> Hinweis zur URL: Der Content-Pfad dieser Entität ist laut Domain Spec 4.5/5.4 bewusst **nicht** `/use-cases/`, sondern ein eigener, bei Umsetzung von Phase 0 final zu benennender Namensraum. Das Masterdaten-Feld `entitaetstyp: use-case` und der Ordnername `data/use-cases/` sind davon unabhängig und bleiben unverändert — Ordnernamen unter `data/` sind interne Strukturbezeichner, keine öffentlichen URLs.

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `unternehmensbereich_ref` | ref:unternehmensbereich | ja | n:1 |
| `branchenreichweite` | enum: `universell` / `branchenspezifisch` | ja | |
| `branchen_refs` | list[ref:branche] | nur wenn `branchenreichweite: branchenspezifisch` | |
| `tool_refs` | list[ref:ki-tool] | ja, ≥1 | |
| `suchintention` | enum: `informational` / `transaktional` | ja | |
| `verwendungs_zaehler` | integer, ≥0 | ja, Default `0` | Anzahl der Branchen/Gewerke, die diesen Use Case aktuell referenzieren — automatisch abgeleitet, nicht händisch gepflegt; speist die Generierungsschwelle „≥2 Verwendungen" (Domain Spec Abschnitt 6) |

**Referenzen:** `unternehmensbereich_ref` → `unternehmensbereich:<id>` (n:1, Pflicht); `tool_refs` → `ki-tool:<id>` (n:n); `branchen_refs` → `branche:<id>` (n:n, bedingt).
**Validierungsregel:** wenn `branchenreichweite: branchenspezifisch`, muss `branchen_refs` mindestens einen Eintrag haben (sonst widersprüchlicher Zustand).

---

## 7. KI-Tool

**Ordner:** `data/ki-tools/<id>.yaml`

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `klasse` | enum: `allgemein` / `vertikal` | ja | |
| `anbieter` | string | ja | |
| `domaene` | string | nur wenn `klasse: vertikal` | z. B. „Bau/Handwerk" |
| `vergleichbare_tools` | list[ref:ki-tool] | optional | für Vergleichsabschnitte, darf sich nicht selbst referenzieren |
| `ist_automatisierungstool` | boolean | ja, Default `false` | `true` für n8n/Make/Zapier-artige Tools — markiert „kein Trainingsgegenstand, nur Wissensreferenz" (Domain Spec 4.6) |
| `verwendungs_zaehler` | integer, ≥0 | ja, Default `0` | analog Use Case, automatisch abgeleitet |

**Referenzen:** `vergleichbare_tools` → `ki-tool:<id>` (n:n, symmetrisch — wenn A B referenziert, sollte B A referenzieren; Validierung prüft das, korrigiert aber nicht automatisch).
**Validierungsregel:** wenn `ist_automatisierungstool: true`, darf das Tool in keinem `trainings`-Datensatz als Trainingsgegenstand auftauchen (siehe Abschnitt 8).

---

## 8. Training

**Ordner:** `data/trainings/<id>.yaml`

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `preis_von` | number | ja | netto, EUR |
| `preis_bis` | number | optional | |
| `format` | enum: `remote` / `vor-ort` / `beides` | ja | |
| `tool_refs` | list[ref:ki-tool] | optional | im Training eingesetzte Tools |
| `zertifizierung_ref` | ref:zertifizierung | ja | 1:1, jedes Training erzeugt einen Nachweis |
| `dimension_branche_ref` | ref:branche | optional | nur bei spezialisierten Trainingsvarianten |
| `dimension_region_ref` | ref:region | optional | nur bei spezialisierten Trainingsvarianten |

**Referenzen:** `tool_refs` → `ki-tool:<id>` (n:n, mit Validierungsregel aus Abschnitt 7); `zertifizierung_ref` → `zertifizierung:<id>` (1:1, Pflicht).
**Validierungsregel:** jedes `training`-Objekt muss `hat_eigene_seite: true` haben — es gibt laut Domain Specification keine reinen Masterdaten-Trainings ohne Seite (kleine, geschlossene Menge, Abschnitt 4.7).

---

## 9. Zertifizierung

**Ordner:** `data/zertifizierungen/<id>.yaml`

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `rechtsgrundlage_ref` | ref:wissensbereich oder externe Norm-ID | ja | 1:1 |
| `gueltigkeitsbedingung` | string | optional | z. B. „pro Teilnehmendem, pro Trainingsdurchlauf" |

**Referenzen:** `rechtsgrundlage_ref` → `wissensbereich:<id>` (1:1, Pflicht) — Recht-&-Compliance-Inhalte werden in diesem Schema als Spezialfall von Wissensbereich geführt (siehe Hinweis in Abschnitt 10), nicht als eigener Datenordner, da sie strukturell identische Felder hätten.

---

## 10. Wissensbereich

**Ordner:** `data/wissensbereiche/<id>.yaml`

> Hinweis: Dieser Ordner führt sowohl klassische Wissensbereiche (Begriffsdefinitionen) als auch Recht-&-Compliance-Inhalte, unterschieden über das Feld `kategorie`. Beide haben in der Domain Specification eigene Abschnitte (4.9 und 4.10), aber identische Datenstruktur — eine Aufspaltung in zwei Ordner hätte keinen strukturellen Mehrwert, nur Redundanz.

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `kategorie` | enum: `begriffsdefinition` / `recht-compliance` | ja | |
| `definition_kurz` | string, ≤300 Zeichen | ja | für GEO/Featured-Snippet |
| `verwandte_begriffe` | list[ref:wissensbereich] | optional | |
| `artikel_norm` | string | nur wenn `kategorie: recht-compliance` | z. B. „Art. 4 EU-KI-VO" |
| `inkrafttretensdatum` | date (`YYYY-MM-DD`) | nur wenn `kategorie: recht-compliance` und zutreffend | |
| `pflichtadressat` | string | nur wenn `kategorie: recht-compliance` | |
| `erklaert_fuer_refs` | list[string, Format `<entitaetstyp>:<id>`] | optional | freie Typreferenz, da Wissensbereiche jede beliebige Entität erklären können (1:n laut Domain Spec) |

**Referenzen:** `verwandte_begriffe` → `wissensbereich:<id>`; `erklaert_fuer_refs` → beliebiger Entitätstyp, deshalb als generischer typisierter String statt festem `ref:`-Feld.
**Validierungsregel:** bei `kategorie: recht-compliance` mit gesetztem `inkrafttretensdatum` in der Zukunft muss das Feld `status` automatisiert auf eine Vorlaufwarnung prüfbar sein (z. B. Art. 26, August 2026) — die konkrete CI-Prüfung ist nicht Teil dieses Schemas, aber das Datenfeld muss dafür auswertbar vorliegen.

---

## 11. Ressource

**Ordner:** `data/ressourcen/<id>.yaml`

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `ressourcentyp` | enum: `rechner` / `checkliste` / `glossar` / `vorlage` | ja | |
| `unterstuetzt_training_ref` | ref:training | optional | n:1 |
| `fasst_zusammen_refs` | list[ref:wissensbereich] | nur wenn `ressourcentyp: glossar` | n:n |

**Referenzen:** `unterstuetzt_training_ref` → `training:<id>`; `fasst_zusammen_refs` → `wissensbereich:<id>`.

---

## 12. Übersicht: Referenzgraph der Masterdaten

| Quelle | Feld | Ziel | Kardinalität |
|---|---|---|---|
| Region | `branchenschwerpunkte` | Branche | n:n |
| Branche | `standard_tools` | KI-Tool | n:n |
| Branche | `standard_usecases` | Use Case | n:n |
| Gewerk | `branche_ref` | Branche | 1:1 |
| Gewerk | `usecase_refs` | Use Case | n:n |
| Unternehmensbereich | `usecase_refs` | Use Case | 1:n (mit Rückbindungspflicht) |
| Use Case | `unternehmensbereich_ref` | Unternehmensbereich | n:1 |
| Use Case | `tool_refs` | KI-Tool | n:n |
| Use Case | `branchen_refs` | Branche | n:n, bedingt |
| KI-Tool | `vergleichbare_tools` | KI-Tool | n:n, symmetrisch |
| Training | `tool_refs` | KI-Tool | n:n |
| Training | `zertifizierung_ref` | Zertifizierung | 1:1 |
| Zertifizierung | `rechtsgrundlage_ref` | Wissensbereich | 1:1 |
| Ressource | `unterstuetzt_training_ref` | Training | n:1 |
| Ressource | `fasst_zusammen_refs` | Wissensbereich | n:n |

---

## 13. Validierungsregeln (Build-/CI-Ebene)

Diese Regeln gelten unabhängig vom konkreten Implementierungswerkzeug (Hugo-Build-Hook, eigenständiges Lint-Skript, CI-Job) und müssen vor jedem Deploy greifen:

1. **ID-Format:** `^[a-z0-9]+(-[a-z0-9]+)*$`, Dateiname ohne Endung muss exakt dem `id`-Feld entsprechen.
2. **Eindeutigkeit:** keine zwei Dateien im selben Entitätsordner mit identischem `id`-Feld (wird durch Dateisystem ohnehin verhindert, aber `id`-Feld muss zur Kontrolle trotzdem stimmen).
3. **Referenzielle Integrität:** jede `ref:<typ>:<id>`-Angabe muss auf eine existierende Datei zeigen. Fehlende Referenz = Build-Fehler, nicht Warnung.
4. **Pflichtfeld-Vollständigkeit:** alle in Abschnitt 2–11 als „Pflicht" markierten Felder müssen gesetzt sein; bedingte Pflichtfelder (z. B. `domaene` nur bei `klasse: vertikal`) werden nur geprüft, wenn die Bedingung zutrifft.
5. **Enum-Konformität:** jedes Enum-Feld darf ausschließlich die in diesem Dokument gelisteten Werte annehmen — keine impliziten neuen Werte ohne Schema-Update (vgl. Erweiterungsregeln, Domain Spec Abschnitt 13).
6. **Zyklusfreiheit bei symmetrischen Referenzen:** `vergleichbare_tools` darf keine Selbstreferenz enthalten.
7. **Konsistenz bidirektionaler Beziehungen:** Unternehmensbereich ↔ Use Case muss beidseitig übereinstimmen (Abschnitt 5/6); ein Use Case, der einen Unternehmensbereich referenziert, der ihn nicht zurückreferenziert, ist ein Validierungsfehler.
8. **`hat_eigene_seite`-Konsistenz:** wenn `true`, muss `seiten_pfad` gesetzt und (sobald die Content-Seite existiert) mit deren tatsächlichem `url`-Frontmatter übereinstimmen.
9. **Schicht-Konsistenz:** das `schicht`-Feld muss mit der in der Domain Specification (Abschnitt 5.3) festgelegten Schichtzugehörigkeit des Entitätstyps übereinstimmen (z. B. Use Case grundsätzlich Schicht 2, Training immer Schicht 4) — Abweichungen sind nur bei begründeten Ausnahmefällen zulässig und müssen im Datensatz kommentiert werden.

---

## 14. Ausdrücklich nicht Teil dieses Dokuments

- Keine konkreten Dateninstanzen (keine reale Region, keine reale Branche etc.).
- Keine Content-Frontmatter-Generierung aus diesen Daten (das ist Aufgabe der Content-Engine-Logik, vgl. Domain Spec Abschnitt 11, nicht dieses Schema-Dokuments).
- Keine Entscheidung über das konkrete Validierungswerkzeug (Hugo-natives Templating, externes Skript, CI-Pipeline) — nur die Regeln, die es durchsetzen muss.

---

*Ende des KWAIX Masterdata Schema v1.0.*
