# KWAIX Domain Specification v1.2

Status: **Eingefroren.** Dies ist die verbindliche Referenzdokumentation der KWAIX-Plattform. Alle zukünftigen Entwicklungen, Inhalte und Content-Cluster bauen auf diesem Dokument auf. Änderungen am Domänenmodell selbst erfordern eine neue Versionsnummer (v1.1, v2.0) und eine explizite Migrationsentscheidung, keine stille Abweichung.

**Änderungshistorie:** v1.1 — rückwärtskompatible Erweiterung (gemäß Abschnitt 13, Erweiterungsregeln) nach Freigabe des ersten Referenz-Clusters (Holzbau Freiburg): Use-Case-Namensraum finalisiert, zwei neue `schemaType`-Werte, `related-context.html` um `dimension.unternehmensbereich` erweitert, Gewerk-Hub-Strukturregel ergänzt. v1.2 — zweiter Kombinationstyp Branche×Use-Case produktionsreif (Goldstandard: Industrie×Baustellendokumentation): URL-Muster `/branchen/<branche>/<usecase>/` final festgelegt, dieselbe Content-Pfad-Implementierungsregel wie beim Gewerk-Hub angewendet, Differenzierungsregel aus Abschnitt 6 als automatisierte Prüfung in der Content Factory umgesetzt. Beide weiterhin v1.x, keine Änderung an Grundprinzipien/Achsen/Schwellenkriterien.

Zielgruppe dieses Dokuments: Entwickler, Redakteure und KI-Systeme, die an KWAIX weiterarbeiten, ohne den Entstehungskontext zu kennen.

---

## 1. Vision und Ziel der Plattform

KWAIX ist keine klassische Marketing-Website, sondern eine **skalierbare Wissensplattform für KI-Kompetenz im deutschsprachigen Mittelstand** (Deutschland, Österreich, Schweiz). Das Geschäftsmodell: praxisnahe KI-Trainings (KI-Kickoff, KI-Training Live, Trainingsplattform) inklusive Kompetenznachweis nach Artikel 4 EU-KI-Verordnung, vertrieben über ein Trainer-Netzwerk (Gründerin: Marion Dopmann).

Das Ziel der Plattform-Architektur ist, Unternehmen jeder Branche, Region und Größenordnung im DACH-Raum mit relevantem, eigenständigem Content zu erreichen — ohne dass jede neue Kombination aus Region, Branche, Gewerk, Werkzeug oder Aufgabe händisch und inkonsistent neu erfunden wird. Die Plattform soll langfristig tausende qualitativ hochwertige, nicht-generische Seiten tragen können, die alle auf einem gemeinsamen, konsistenten Domänenmodell beruhen.

---

## 2. Grundprinzipien

1. **Entität vor Seite.** Eine fachliche Entität (z. B. ein Use Case) existiert zuerst als Konzept mit Eigenschaften und Beziehungen. Ob daraus eine Seite mit eigener URL entsteht, ist eine nachgelagerte, regelbasierte Entscheidung — nicht der Ausgangspunkt.
2. **Wiederverwendung vor Neuerstellung.** Vor jedem neuen Content-Cluster wird geprüft, ob bestehende Templates, Shortcodes, Felder und Entitäten ausreichen. Vergleiche `feedback_template_reuse`-Grundsatz: maximal wiederverwenden statt neu gestalten.
3. **Kein Content ohne Schwelle.** Eine Kombination wird nur dann zur eigenständigen Seite, wenn Suchvolumen, Inhaltstiefe, Wiederverwendung und Konversionsrelevanz gemeinsam gegeben sind (siehe Abschnitt 6). Sonst bleibt sie eine interne Beziehung ohne eigene URL.
4. **Vier Schichten statt flacher Seitenliste.** Jede Entität gehört zu einer von vier Rollen im Content-Graphen: Programmatic Leaves (Schicht 1), Hubs (Schicht 2), Pillar/Wissen (Schicht 3), Conversion (Schicht 4). Diese Schichtenzugehörigkeit bestimmt Tonalität, Template-Wahl und CTA-Logik.
5. **Eindeutige Begriffe.** Unternehmensbereich (Abteilungsebene: HR, Vertrieb, ...) und Use Case (Aufgabenebene: Angebotserstellung, Recruiting, ...) sind zwei verschiedene Entitäten und dürfen nicht im selben URL-Namespace geführt werden (siehe Migrationsentscheidung in Abschnitt 5.4).
6. **DACH-weite, branchenneutrale Tonalität für Tools.** KI-Tools werden grundsätzlich neutral, nicht werblich beschrieben — auch wenn ein Tool (z. B. BauGPT) strategisch relevant ist.
7. **SEO-Grundhygiene gilt immer.** Datum nur auf Blog/Ratgeber-Inhalten, CTAs immer einzigartig und keyword-reich (bestehender Standard, vgl. `feedback_seo_grundhygiene`).

---

## 3. Domänenmodell (Überblick)

Fünf Achsen strukturieren das gesamte Modell:

- **Geografisch-fachliche Achse** (wo/wer): Region, Branche, Gewerk
- **Funktionale Achse** (was/wie): Unternehmensbereich, Use Case
- **Werkzeug-Achse** (mit was): KI-Tool
- **Konversions- und Vertrauens-Achse** (Ziel + Legitimation): Training, Zertifizierung, Recht & Compliance
- **Erklär-Achse** (Kontext für alle anderen Achsen, nicht selbst transaktional): Wissensbereich, Ressource

Zielgruppe ist explizit **kein Knoten** dieses Modells, sondern ein Filter-/Tonalitätsattribut auf bestehenden Entitäten (Begründung: Abschnitt 4.12).

```
Recht & Compliance ──rechtfertigt──▶ Zertifizierung ──wird ausgestellt nach──▶ Training
        ▲                                                                        ▲
        │ zitiert von                                                           │ Ziel aller CTAs
Wissensbereich ──erklärt Begriffe für──▶ Branche ──hat Unterkategorie──▶ Gewerk
        │                                    │                              │
        ▼                                    └─────────kombiniert mit Region┘
   Ressourcen                                                 │
                                          Region×Branche/Gewerk-Seite (Schicht 1)
                                                         │
                                              nutzt Use-Cases (n:n)
                                                         ▼
                                      Use Case ──gehört zu──▶ Unternehmensbereich
                                                         │
                                              wird unterstützt von
                                                         ▼
                                                     KI-Tool
```

---

## 4. Entitäten

Für jede Entität: Zweck, Pflicht-/optionale Attribute, Beziehungen, URL-Konzept, Schema.org-Typ, Generierungskriterium. Vollständige Frontmatter-Beispiele in Abschnitt 8.

### 4.1 Region
- **Zweck:** geografischer Ankerpunkt lokaler Kaufabsicht.
- **Pflicht:** `title`, `url`, `eyebrow`, `lede`, `land`, `wirtschaftsprofil`.
- **Optional:** `bundesland`/`kanton`, `branchenschwerpunkte`, `sprachen`.
- **Beziehungen:** kombiniert mit Branche/Gewerk (n:n).
- **URL:** `/regionen/<land>/<bundesland>/<stadt>/` (Zielzustand; aktuell teils flach, siehe Abschnitt 12).
- **Schema.org:** `schemaType: service`.
- **Eigene Seite, wenn:** eigenständiges Suchvolumen + mindestens ein differenzierendes Lokalprofil.

### 4.2 Branche
- **Zweck:** fachliche Hauptgliederung, Schicht-2-Hub.
- **Pflicht:** `title`, `url`, `eyebrow`, `lede`, `faqItems` (≥3), `heroCards`.
- **Optional:** `hatGewerke`, `typischeTeamgroesse`, `dimension.tools`/`dimension.usecases` als branchenweite Empfehlung.
- **Beziehungen:** hat Unterkategorie Gewerk (1:1 je Gewerk, nur Handwerk/Bau); kombiniert mit Region (n:n); nutzt Use Case (n:n).
- **URL:** `/branchen/<branche>/`.
- **Schema.org:** `schemaType: service`.
- **Eigene Seite, wenn:** branchentypisches Suchvolumen, ≥3 plausible Use-Cases mit eigenständigem Inhalt.

### 4.3 Gewerk
- **Zweck:** Verfeinerung innerhalb Handwerk/Bau; schließt die Lücke einer fehlenden Zwischenebene.
- **Pflicht:** `title`, `url`, `dimension.branche`, `faqItems`.
- **Optional:** `typischeProjektgroesse`, `foerderrelevanz`.
- **Beziehungen:** gehört zu Branche (1:1, Subtyp-Restriktion — **keine Vererbung**: ein Gewerk erbt keine Eigenschaften, sondern schränkt den Gültigkeitsbereich ein); kombiniert mit Region (n:n); nutzt Use Case (n:n, Teilmenge der Branchen-Use-Cases).
- **URL:** öffentlich `/branchen/handwerk/<gewerk>/`, technisch jedoch **nicht** als Unterordner der bestehenden Branchen-Seite anlegen (siehe Implementierungsregel unten).
- **Schema.org:** `schemaType: service`.
- **Eigene Seite, wenn:** bundesweites Suchvolumen UND mindestens eine Region-Kombination existiert/geplant ist.
- **Implementierungsregel (v1.1, verbindlich):** `content/branchen/handwerk/index.md` ist ein Hugo-Leaf-Bundle. Ein darunter angelegter Unterordner (`content/branchen/handwerk/<gewerk>/index.md`) wird von Hugo als Ressourcen-Asset des Leaf-Bundles interpretiert, nicht als eigene Seite — er wird ohne Fehlermeldung gebaut, aber nicht veröffentlicht. Gewerk-Hub-Seiten werden deshalb unter einem eigenen Content-Pfad `content/gewerke/<id>/index.md` angelegt und erhalten ein `url`-Frontmatter-Feld, das den gewünschten öffentlichen Pfad (`/branchen/handwerk/<gewerk>/`) erzwingt. Referenzen im `dimension`-Feld anderer Seiten (z. B. `dimension.gewerk`) müssen auf den **Content-Pfad** (`/gewerke/<id>`) zeigen, nicht auf den `url`-Override — `site.GetPage` löst nach Content-Pfad auf. Der Ordner `content/gewerke/` selbst erhält eine `_index.md` mit `_build: {render: never, list: never}`, damit Hugo keine generische Sektions-Listenseite unter `/gewerke/` veröffentlicht — Gewerk-Hubs werden ausschließlich über die zugehörige Branchen-Seite verlinkt, nicht über eine eigene Übersichtsseite.

### 4.4 Unternehmensbereich
- **Zweck:** Abteilungsebene, bündelt Use Cases, branchenunabhängig.
- **Pflicht:** `title`, `url`, `lede`, ≥3 verlinkte Use Cases.
- **Beziehungen:** bündelt Use Case (1:n).
- **URL (Stand v1.0):** `/use-cases/<bereich>/` — **historisch gewachsene, fachlich unpassende URL, bewusst vorerst unverändert belassen.** Die fachliche Entität heißt verbindlich Unternehmensbereich; die URL-Struktur folgt dieser Umbenennung erst in einem späteren, eigenständigen Migrationsprojekt (siehe 5.4). Bis dahin gilt: intern/redaktionell als Unternehmensbereich behandeln, technisch unter dem bestehenden Pfad weiterführen.
- **Schema.org:** `schemaType: service`.
- **Eigene Seite, wenn:** bereits vollständig (6 Bereiche: HR, Vertrieb, Kundenservice, Marketing, Office/Projekt, Management).

### 4.5 Use Case
- **Zweck:** atomare, wiederverwendbare Aufgabe — meistverlinkter Knotentyp im Graph.
- **Pflicht:** `title`, `url`, `unternehmensbereich`, `branchenreichweite` (universell/branchenspezifisch + Liste), `dimension.tools` (≥1).
- **Optional:** `suchintention`, `beispielBranchen`.
- **Beziehungen:** gehört zu Unternehmensbereich (n:1); wird unterstützt von KI-Tool (n:n); wird eingesetzt in Branche/Gewerk (n:n).
- **URL:** `/ki-anwendungsfaelle/<use-case>/` — **final festgelegt** (v1.1, am Referenz-Cluster Holzbau Freiburg validiert). Bewusst getrennt von `/use-cases/`, da dieser Pfad durch die Unternehmensbereich-Entität belegt ist (siehe 5.4).
- **Schema.org:** `schemaType: howto`, implementiert in `layouts/partials/seo/jsonld.html` (siehe Abschnitt 9/10).
- **Eigene Seite, wenn:** von ≥2 verschiedenen Branchen/Gewerken referenziert.
- **Nur Referenz, wenn:** hochspezifisch für genau eine Branche/Gewerk.

### 4.6 KI-Tool
- **Zweck:** Werkzeug-Achse, zwei Topologien: allgemein (1:n) vs. vertikal/branchenspezifisch (1:wenige).
- **Pflicht:** `title`, `url`, `klasse` (allgemein/vertikal), `anbieter`.
- **Optional:** `domaene` (nur vertikal), `vergleichbareTools`.
- **Beziehungen:** unterstützt Use Case (n:n); ist Gegenstand von Training (n:n).
- **URL:** `/ki-tools/<tool>/`.
- **Schema.org:** `schemaType: softwareapplication`, implementiert in `layouts/partials/seo/jsonld.html` (siehe Abschnitt 9/10).
- **Tonalität:** neutral, nicht werblich, auch bei strategisch relevanten Tools wie BauGPT.
- **Eigene Seite, wenn:** von ≥2 Use Cases referenziert UND eigenständiges Suchvolumen.
- **Nur Referenz, wenn:** nur einmalig erwähnt — bleibt Fließtext-Erwähnung.
- **Abgrenzung:** Automatisierungs-Tools (n8n, Make, Zapier) sind explizit **kein** Trainingsgegenstand, nur Wissensreferenz zur Abgrenzung von "KI-Training" vs. "KI-Automatisierung".

### 4.7 Training
- **Zweck:** Schicht-4-Conversion-Ziel, Endpunkt aller CTAs. Bestehend, unverändert.
- **Pflicht:** `title`, `url`, `priceRange`, `herocta`, `faqItems`.
- **Optional:** `dimension` (bei spezialisierten Varianten).
- **Beziehungen:** erzeugt Zertifizierung (1:1); konfiguriert mit Branche/Gewerk/Region (n:n über `dimension`).
- **URL:** `/leistungen/<training>/`.
- **Schema.org:** `schemaType: course`.
- **Eigene Seite:** immer (kleine, geschlossene Menge: KI-Kickoff, KI-Training Live, Trainingsplattform).

### 4.8 Zertifizierung
- **Zweck:** rechtlich-formaler Nachweis, eng an Training gekoppelt.
- **Pflicht:** `title`, `url`, `rechtsgrundlage`.
- **Beziehungen:** basiert auf Recht & Compliance (1:1); wird ausgestellt nach Training (1:n).
- **URL:** `/ki-vo/kompetenznachweis/`.
- **Schema.org:** `schemaType: service`.
- **Eigene Seite:** bereits erfüllt.

### 4.9 Wissensbereich
- **Zweck:** lexikalisch-definitorische Schicht-3-Erklärung (abgegrenzt von redaktionellen Themengebieten im Blog).
- **Pflicht:** `title`, `url`, `definition` (Kurzfassung für GEO/Featured-Snippet).
- **Optional:** `verwandteBegriffe`, `dimension`.
- **Beziehungen:** erklärt beliebige Entität (1:n).
- **URL:** `/wissen/<begriff>/`.
- **Schema.org:** `schemaType: definedterm` (neuer Zweig, präziser für GEO als `article`).
- **Eigene Seite, wenn:** Begriff wird in ≥2 anderen Seiten vorausgesetzt UND hat eigenständige Suchintention.
- **Nur Referenz, wenn:** selbsterklärend im Kontext — Inline-Erklärung in Klammern.

### 4.10 Recht & Compliance
- **Zweck:** Rechtsgrundlage, Schicht 4, eigenständig von Zertifizierung wo kein Trainingsbezug besteht (z. B. Urheberrecht).
- **Pflicht:** `title`, `url`, `artikel`/`norm`, `inkrafttretensdatum` (wo zutreffend), `pflichtadressat`.
- **Beziehungen:** ist Rechtsgrundlage für Zertifizierung (1:n); wird zitiert von jeder Branchenseite (n:n, lose über FAQ-Modul).
- **URL:** `/ki-vo/<norm>/`.
- **Schema.org:** `schemaType: article` (erklärend) oder `service` (direkt mit Training verknüpft).
- **Eigene Seite, wenn:** eigenständige Pflicht mit Suchvolumen (z. B. Art. 26 ab August 2026 — zeitkritisch).

### 4.11 Ressource
- **Zweck:** unterstützendes Material, Schicht 3/4 gemischt.
- **Pflicht:** `title`, `url`, `ressourcentyp` (Rechner/Checkliste/Glossar/Vorlage).
- **Beziehungen:** unterstützt Training (n:1); fasst Wissensbereich zusammen (n:n, nur Glossar-Typ).
- **URL:** `/ressourcen/<ressource>/` bzw. bestehend `/preise/ki-roi-rechner/`.
- **Schema.org:** `schemaType: service`.
- **Eigene Seite, wenn:** eigenständig nutzbar (Rechner, Download).
- **Nur Referenz, wenn:** nur Abschnitt einer bestehenden Seite.

### 4.12 Zielgruppe
- **Zweck:** reines Filter-/Tonalitätsattribut.
- **Status:** **kein eigener Knoten, keine eigene URL.** Begründung: kombinatorische Explosion (Region × Branche × Gewerk × Zielgruppe wäre unkontrollierbar) ohne zusätzlichen Suchverkehr — niemand sucht "KI-Training für Geschäftsführer Freiburg".
- **Verwendung:** `zielgruppen: []` als optionales Attribut an Trainings-/Branchenseiten, steuert nur Tonalität/FAQ-Auswahl.

---

## 5. Beziehungen und Vererbung

### 5.1 Kantentypen (vollständig)

| Kante | Kardinalität | Bedeutung |
|---|---|---|
| Gewerk → Branche | 1:1 | Subtyp-Restriktion, keine Vererbung |
| Region ↔ Branche/Gewerk | n:n | Kombination, ggf. eigene Seite |
| Branche/Gewerk → Use Case | n:n | nutzt |
| Use Case → Unternehmensbereich | n:1 | gehört zu |
| Use Case ↔ KI-Tool | n:n | wird unterstützt von |
| Training → Zertifizierung | 1:1 | erzeugt |
| Zertifizierung → Recht & Compliance | 1:1 | basiert auf |
| Wissensbereich → beliebige Entität | 1:n | erklärt |
| Ressource → Training | n:1 | unterstützt |
| KI-Tool → Training | n:n | ist Gegenstand von |

### 5.2 Vererbung — explizit keine

Das Modell enthält **keine klassische Vererbung** (kein Supertyp mit polymorphen Subtypen). Die einzige hierarchische Kante (Gewerk → Branche) ist eine Subtyp-Restriktion: Gültigkeit ist auf den Kontext der Branche beschränkt, es werden keine Eigenschaften vererbt. Zukünftige Erweiterungen dürfen keine echte Vererbungslogik einführen, ohne dieses Dokument zu aktualisieren (würde z. B. bei einer hypothetischen Unterteilung von Use Cases in Sub-Use-Cases relevant).

### 5.3 Schichtenmodell (Rollen im Graph)

| Schicht | Rolle | Tonalität/CTA | Entitäten |
|---|---|---|---|
| 1 — Programmatic Leaves | engste Kombination, höchste lokale Kaufabsicht | Sales-CTA primär | Region×Branche/Gewerk-Kombinationen |
| 2 — Hubs | generische Stammseite, Linkknoten | Sales-CTA primär | Branche, Gewerk, Unternehmensbereich, KI-Tool, Use Case (Hub-Form) |
| 3 — Pillar/Wissen | redaktionelle Autorität, GEO | dezenter Hinweis | Wissensbereich, Themengebiete (Blog) |
| 4 — Conversion | eigentliches Angebot | primäres Sales-Ziel | Training, Zertifizierung, Recht & Compliance |

KI-Tool-Hubs sind eine **Ausnahme** innerhalb Schicht 2: Wissens-/Vergleichscharakter, kein primärer Sales-CTA (Begründung: Neutralitätsgebot, Abschnitt 4.6).

### 5.4 Begriffs-/URL-Trennung: `use-cases/`-Namensraum (Stand v1.0, Migration zurückgestellt)

Der bestehende Ordner `content/use-cases/` (HR, Vertrieb, Kundenservice, Marketing, Office/Projekt, Management) enthält fachlich die **Unternehmensbereich**-Entität, nicht die Use-Case-Entität. Eine vollständige Auswirkungsanalyse (siehe Anhang/Analyseprotokoll) hat ergeben, dass diese 7 Seiten bereits produktiv, im Hauptmenü verlinkt, SEO-optimiert und bereits einmal migriert (bestehende 301-Redirects von älteren Slugs) sind. Eine erneute URL-Migration birgt reales SEO-Risiko ohne unmittelbaren Nutzergewinn.

**Verbindliche Entscheidung für v1.0:**

1. **Fachlich** ist und bleibt die Entität unter `content/use-cases/` ein **Unternehmensbereich** — diese Spezifikation, alle Redaktionsprozesse und alle künftigen Datenmodelle behandeln sie als solche (siehe 4.4).
2. **Technisch/URL-seitig** bleibt der bestehende Pfad `/use-cases/<bereich>/` zunächst unverändert bestehen. Es erfolgt **keine** Migration nach `/unternehmensbereiche/` im Rahmen von v1.0, Phase 0 oder einer der folgenden Roadmap-Phasen.
3. Die **neue Use-Case-Entität** (Angebotserstellung, Kundenkommunikation, Baustellendokumentation, Recruiting, Wissensmanagement, ...) erhält stattdessen von Anfang an einen **eigenen, neuen URL-Namensraum**, der sich nicht mit `/use-cases/` überschneidet (siehe 4.5). Das löst den Konflikt an der Stelle, an der er keine Migrationskosten verursacht — die neue Entität existiert noch nicht produktiv.
4. Die URL-Migration der bestehenden Unternehmensbereich-Seiten nach `/unternehmensbereiche/` wird als **eigenständiger, separat zu planender Architektur-Task** für eine spätere Release-Phase vorgemerkt (siehe 12.1). Sie ist **keine Voraussetzung** für Phase 0 oder jede andere Phase der aktuellen Roadmap.

---

## 6. Regeln der Seitengenerierung

Eine Kombination wird nur zur eigenständigen Landingpage, wenn **alle vier** Schwellen erfüllt sind:

1. **Suchvolumen-Schwelle:** plausible eigenständige Suchintention für genau diese Kombination, nicht nur für die Einzelteile.
2. **Inhaltstiefe-Schwelle:** ≥3 eigenständige, nicht-generische Inhaltspunkte lassen sich formulieren.
3. **Wiederverwendungs-Schwelle:** die beteiligten Entitäten existieren bereits als eigenständige Knoten (z. B. kein Region×Gewerk ohne vorherigen Gewerk-Hub).
4. **Konversionsrelevanz:** die Kombination kann glaubwürdig auf ein Training verweisen.

### Referenztabelle

| Kombination | Landingpage, wenn | Nur interne Beziehung, wenn |
|---|---|---|
| Region × Branche | eigenständiges Lokalprofil + Suchvolumen | kein Lokalprofil → nur Listeneintrag im Branchen-Hub |
| Region × Gewerk | wie oben, zusätzlich: Gewerk-Hub existiert bereits | Gewerk-Hub fehlt → zuerst Hub anlegen |
| Branche × Use Case | Ausprägung in der Branche erkennbar verschieden vom universellen Hub | Ausprägung branchenunabhängig identisch → Erwähnung im generischen Use-Case-Hub |
| Gewerk × Use Case | Use Case gewerkespezifisch und in mehreren Region-Kombinationen wiederverwendet | nur einmalig verwendet → Card in der Region-Kombination, kein eigener Hub |
| KI-Tool × Branche | Tool hat branchenspezifische Eigenheiten (z. B. BauGPT × Handwerk) | Tool wird branchenneutral im Use Case erwähnt → kein eigener Hub |
| Use Case × Unternehmensbereich | **nie** eigenständige Seite — rein strukturelle Zugehörigkeit | immer interne Beziehung |

---

## 7. Regeln für interne Verlinkung

1. **`dimension`-Feld ist der primäre Verlinkungsmechanismus.** Jede Seite kann `dimension.region`, `dimension.branche`, `dimension.gewerk`, `dimension.unternehmensbereich` (seit v1.1), `dimension.tools` (Liste), `dimension.usecases` (Liste) tragen — vollständige Content-Pfade, keine Slugs.
2. **`related-context.html`** rendert daraus automatisch einen "Verwandte Seiten"-Block. Fehlt `dimension`, wird nichts gerendert (bestehende Seiten ohne Feld bleiben unverändert — forward-compatible). Seit v1.1 löst das Partial zusätzlich `dimension.unternehmensbereich` auf — damit kann z. B. eine Use-Case-Seite automatisch auf ihren zugehörigen Unternehmensbereich verweisen.
3. **Selbstreferenz für Rückwärtsauflösung:** Region- und Hub-Seiten tragen `dimension.region`/`dimension.branche` auf sich selbst, damit sie potenziell auffindbar werden, sobald die Rückwärtsauflösung implementiert ist (siehe Abschnitt 12, technische Schuld).
4. **Jede Seite verlinkt mindestens einmal nach oben** (zu ihrem übergeordneten Hub) und **mindestens einmal nach unten** (zu mindestens einem Use Case oder Training) — kein Knoten darf eine Sackgasse sein.
5. **Hub-Seiten listen ihre Kombinationen händisch nach**, bis die automatische Rückwärtsauflösung existiert (aktuelles Muster: Handwerk-Hub verlinkt händisch auf Freiburg-Cluster).
6. **Keine Verlinkung allein über Tags/Taxonomien** — jede Beziehung ist gerichtet und typisiert über `dimension`, nicht über ungerichtete Hugo-Taxonomien.

---

## 8. URL-System

| Entität | URL-Muster | Status |
|---|---|---|
| Region | `/regionen/<land>/<bundesland>/<stadt>/` | Zielzustand, aktuell teils inkonsistent |
| Branche | `/branchen/<branche>/` | bestehend, konsistent |
| Gewerk | öffentlich `/branchen/handwerk/<gewerk>/`, Content-Pfad `/gewerke/<gewerk>/` (siehe 4.3, Implementierungsregel) | seit v1.1 produktiv (Holzbau) |
| Unternehmensbereich | `/use-cases/<bereich>/` | bestehend; Migration nach `/unternehmensbereiche/` zurückgestellt (siehe 5.4, 12.1) |
| Use Case | `/ki-anwendungsfaelle/<use-case>/` | seit v1.1 final festgelegt und produktiv (Baustellendokumentation) |
| KI-Tool | `/ki-tools/<tool>/` | neu anzulegen |
| Training | `/leistungen/<training>/` | bestehend |
| Zertifizierung | `/ki-vo/kompetenznachweis/` | bestehend |
| Wissensbereich | `/wissen/<begriff>/` | teilweise bestehend |
| Recht & Compliance | `/ki-vo/<norm>/` | bestehend |
| Ressource | `/ressourcen/<ressource>/`, `/preise/ki-roi-rechner/` | teilweise bestehend |
| Region×Branche/Gewerk-Kombination | `/ki-training-<gewerk>-<stadt>/` (flach, Pilot-Muster) | bestehend (Freiburg-Cluster) |

---

## 9. Frontmatter-Konzept

Gemeinsame Basis aller Schicht-1/2/4-Seiten (bestehendes, unverändertes Muster):

```yaml
title: "..."
description: "..."
eyebrow: "Kategorie · Kontext"
lede: "..."
draft: false
canonical: "https://kwaix.de/.../"
url: "/.../"
type: leistungen
schemaType: "service"   # oder: course, article, howto, definedterm, softwareapplication
herocta: "... →"
herocta2: "..."
herocta2href: "/..."
dimension:
  region: "/regionen/..."
  branche: "/branchen/..."
  gewerk: "/branchen/handwerk/..."
  tools:
    - "/ki-tools/..."
  usecases:
    - "/use-cases/..."
faqItems:
  - q: "..."
    a: "..."
heroCards:
  - type: "..."
    title: "..."
    subtitle: "..."
```

**Verbindlich:** kein neuer Hugo-`type` für neue Entitäten — `type: leistungen` trägt das gesamte Spektrum über Frontmatter-Variation. Neue Entitätsklassen ohne eigene Seite (z. B. KI-Tool, Use Case, Gewerk vor Erreichen der Generierungsschwelle) werden als strukturierte Daten unter `data/` (YAML) gepflegt, nicht als `content/`-Markdown-Datei.

---

## 10. SEO-/Schema-Regeln

1. **`schemaType`-Werte:** `course`, `article`, `service` (bestehend); `howto` (Use Case) und `softwareapplication` (KI-Tool) seit v1.1 implementiert in `layouts/partials/seo/jsonld.html`; `definedterm` (Wissensbereich) weiterhin offen, noch zu ergänzen.
2. **`faqItems`** rendert automatisch `FAQPage`-Schema — Pflicht auf jeder Schicht-1/2/4-Seite.
3. **Datum nur auf Blog/Ratgeber-Inhalten** — niemals auf Branchen-/Region-/Hub-Seiten (bestehender Standard).
4. **CTAs immer einzigartig formuliert und keyword-reich**, nie generisches "Jetzt anfragen" ohne Kontextbezug.
5. **KI-Tool-Seiten:** kein primärer Sales-CTA im Hero, neutrale Tonalität (Wissens-/Vergleichscharakter).
6. **Jede Branchen-/Region-/Gewerk-Seite trägt das Standard-FAQ-Modul** "Was ist der Kompetenznachweis nach Art. 4 KI-VO" mit Link zur Zertifizierung — durchgängiges Vertrauenssignal.
7. **GEO-Optimierung:** Wissensbereich-Seiten priorisieren `DefinedTerm`-Schema und Kurzdefinitionen im ersten Absatz für KI-Suchmaschinen-Zitierfähigkeit.

---

## 11. Content-Engine: Funktionsweise

Die Content-Engine ist kein separates System, sondern die Summe aus: Domänenmodell (Abschnitt 3–5) + Generierungsregeln (Abschnitt 6) + `dimension`/`related-context.html`-Mechanik (Abschnitt 7) + bestehende Hugo-Templates und Shortcodes (`cards`, `card`, `cta`, `kpiStrip`, `comparison-table`).

**Ablauf für jede neue Kombination:**
1. Prüfen, ob alle beteiligten Entitäten bereits als Knoten existieren (Daten oder Seite).
2. Die vier Generierungsschwellen (Abschnitt 6) gegen die Referenztabelle prüfen.
3. Bei Erfüllung: Seite mit Standard-Frontmatter (Abschnitt 9) anlegen, `dimension`-Feld vollständig setzen.
4. Rückverlinkung im übergeordneten Hub ergänzen (manuell, bis Rückwärtsauflösung existiert).
5. Build-Test und Linkprüfung.

**Bekannte technische Schuld (nicht in v1.0 behoben, für v1.1 vorgesehen):**
- Rückwärtsauflösung in `related-context.html` fehlt — Hubs finden ihre Kombinationen nicht automatisch.
- `dimension`-Feld unterstützt aktuell nur Einzelwerte für `region`/`branche`/`gewerk` (kein 1:n), `tools`/`usecases` sind bereits Listen.

---

## 12. Skalierungsstrategie und Roadmap

Reihenfolge, in der das Modell ausgerollt wird (Begründung: jede Phase ist Voraussetzung für die Wirksamkeit der nächsten):

**Referenz-Cluster (v1.1, freigegeben):** Region Freiburg → Branche Handwerk → Gewerk Holzbau → Unternehmensbereich Office/Projekt → Use Case Baustellendokumentation → KI-Tool BauGPT → Training KI-Training Live → Zertifizierung Kompetenznachweis Art. 4 → Wissensbereich Artikel 4 KI-VO → Ressource ROI-Rechner. Dieser Cluster gilt als Goldstandard für alle folgenden Phase-0-Seiten — Frontmatter-Struktur, Verlinkung und Schema.org-Einbindung sind dort vollständig umgesetzt und build-verifiziert.

**Phase 0 — Bestehende Lücken schließen:** die 5 referenzierten KI-Tool-Hubs (ChatGPT, Copilot, BauGPT zuerst) und 5 Use-Case-Hubs (Angebotserstellung, Kundenkommunikation, Baustellendokumentation, Recruiting, Wissensmanagement) unter dem in 4.5/5.4 festgelegten neuen, von `/use-cases/` getrennten Namensraum anlegen — sie werden von den 6 Freiburg-Pilotseiten bereits referenziert, aber lösen noch nicht auf. **Die `use-cases/`-URL-Migration (12.1) ist explizit keine Voraussetzung für Phase 0** und blockiert sie nicht.

### 12.1 Zurückgestellter Architektur-Task: URL-Migration `/use-cases/` → `/unternehmensbereiche/`

Separat von der laufenden Roadmap vorgemerkt, Umsetzungszeitpunkt offen (frühestens nach Stabilisierung von Phase 0–2, wenn der neue Use-Case-Namensraum etabliert und die Verwechslungsgefahr in der Praxis bewertet werden kann):

- **Auslöser/Begründung:** begriffliche Klarheit zwischen Unternehmensbereich und Use Case langfristig auch in der URL abbilden.
- **Umfang (laut Auswirkungsanalyse):** 7 Content-Seiten, 2 Templates (Header-/Footer-Navigation), 6 bestehende Redirects (Konsolidierung zur Vermeidung von Redirect-Ketten), 14 interne Markdown-Links, alle `canonical`-Felder.
- **Bedingung vor Umsetzung:** eigene Aufwands-/Risikoabschätzung inkl. Such-Performance-Daten der bestehenden Seiten (Google Search Console o. ä.), die zum Zeitpunkt dieser Spezifikation nicht vorlagen.
- **Nicht-Voraussetzung:** keine andere Roadmap-Phase (0–4) ist von dieser Migration abhängig.

**Phase 1 — Muster verlässlich machen:** generische Gewerk-Hubs für die 5 bestehenden Freiburg-Gewerke; zweite Pilotregion zur Validierung des Freiburg-Musters außerhalb seines Spezialprofils.

**Phase 2 — Horizontale Breite:** neue Branchen mit hoher Priorität (Gesundheitswesen/Pflege, Bau als eigene Branche); branchenneutrale Use-Cases mit universeller Reichweite (Rechnungswesen, Content-/Marketingtexte) systematisieren.

**Phase 3 — Autorität/GEO:** Technologie-Grundlagen-Wissensbereiche (LLM, RAG, KI-Agent); Recht & Compliance vertiefen (Art. 26, zeitkritisch vor August 2026; Urheberrecht); Themengebiete als Pillar-Content.

**Phase 4 — Flächenskalierung:** weitere Region×Gewerk-Kombinationen nach validiertem Muster; weitere Branchen-Lücken (Gastronomie, Bildung, Logistik); Bundesland/Kanton-Zwischenebene vereinheitlichen.

Eine Phase vorzuziehen widerspricht Grundprinzip 3 (keine Seite ohne erfüllte Schwellen) — insbesondere darf Phase 4 nicht vor Phase 0/1 begonnen werden, da sonst dieselbe Verlinkungslücke vervielfacht statt geschlossen wird.

---

## 13. Erweiterungsregeln für v1.1+

Diese Regeln gelten für jede zukünftige Erweiterung des Modells, ohne dass dieses Dokument als Ganzes neu geschrieben werden muss:

1. **Neue Entitätsklasse:** muss in das Vier-Schichten-Modell (5.3) und eine der fünf Achsen (Abschnitt 3) einordbar sein. Lässt sie sich keiner Achse zuordnen, ist sie wahrscheinlich kein eigener Knoten, sondern ein Attribut (vgl. Zielgruppe, 4.12).
2. **Neuer `schemaType`-Wert:** erfordert einen entsprechenden Zweig in `layouts/partials/seo/jsonld.html`, dokumentiert in Abschnitt 10.
3. **Neue Kombination zweier Entitäten:** muss gegen die vier Generierungsschwellen (Abschnitt 6) geprüft werden, bevor eine Seite entsteht — keine Ausnahme für "Pilotcluster".
4. **Keine echte Vererbung einführen**, ohne Abschnitt 5.2 explizit zu aktualisieren und auf v1.1 zu heben.
5. **Jede Migration eines bestehenden URL-Namensraums** (wie die in 12.1 zurückgestellte `use-cases/`-Migration) muss mit Redirect erfolgen und in diesem Dokument nachgetragen werden. Eine zurückgestellte Migration darf nicht stillschweigend verfallen — sie bleibt in 12.1 als offener Task sichtbar, bis sie entweder umgesetzt oder bewusst verworfen wird.
6. **Versionierung:** rückwärtskompatible Erweiterungen (neue Entität, neue Kombination nach bestehenden Regeln) → v1.x. Änderungen an Grundprinzipien, Achsen oder Schwellenkriterien selbst → v2.0.

---

*Ende der KWAIX Domain Specification v1.0 — eingefroren.*
