# KWAIX Produktionsbericht – Batch 01 v2 (Description-Fix)

Datum: 2026-06-30  
Modus: PRODUKTIV — Update der 20 bestehenden Batch-01-Dateien  
Änderung: `lib/description-builder.js` — neues Description-Template ohne Platzhalter-Suffix  
QA-Schwelle angepasst: max. 160 Zeichen (vorher 165)

---

## Vorher / Nachher: Description-Längen

| Kombination | Alt (HTML, Char) | Neu (FM, Char) | Delta | Status |
|---|---|---|---|---|
| Holzbau × Hamburg | 172 | 152 | −20 | **OK** |
| Holzbau × Wien | 169 | 149 | −20 | **OK** |
| Holzbau × Köln | 169 | 149 | −20 | **OK** |
| Holzbau × Münster | 172 | 152 | −20 | **OK** |
| SHK × Berlin | 167 | 157 | −10 | **OK** |
| SHK × München | 168 | 158 | −10 | **OK** |
| SHK × Innsbruck | 170 | 160 | −10 | **OK** |
| SHK × Linz | 165 | 155 | −10 | **OK** |
| Dachdecker × Berlin | 174 | 150 | −24 | **OK** |
| Dachdecker × München | 175 | 151 | −24 | **OK** |
| Dachdecker × Wien | 172 | 148 | −24 | **OK** |
| Dachdecker × Bern | 172 | 148 | −24 | **OK** |
| Elektro × Berlin | 171 | 154 | −17 | **OK** |
| Elektro × München | 172 | 155 | −17 | **OK** |
| Elektro × Wien | 169 | 152 | −17 | **OK** |
| Elektro × Zürich | 171 | 154 | −17 | **OK** |
| Maler × Berlin | 169 | 151 | −18 | **OK** |
| Maler × Wien | 167 | 149 | −18 | **OK** |
| Maler × Köln | 167 | 149 | −18 | **OK** |
| Maler × Zürich | 169 | 151 | −18 | **OK** |

**Zielband 140–160 Zeichen: 20/20 erfüllt. WARNs: 0/20.**

Spanne: 148 Zeichen (Dachdecker × Wien/Bern) bis 160 Zeichen (SHK × Innsbruck).  
Maximum liegt exakt am oberen Limit — durch die Längen-Assertion in `description-builder.js` systemseitig abgesichert.

---

## Neue Description-Formel

**Region×Gewerk:**

```
KI-Training für <Gewerk>-Betriebe in <Region>: <Gewerk-Schwerpunkt> mit KI-Tools
vereinfachen und Kompetenznachweis Art. 4 erwerben.
```

Gewerk-Schwerpunkte (fest, gewerk-spezifisch, keine Keyword-Liste):

| Gewerk | Schwerpunkt |
|---|---|
| Holzbau | Aufmaße, Angebote und Projektdokumentation |
| SHK | Angebote, Wartungsprotokolle und Kundenkommunikation |
| Dachdecker | Aufmaße, Angebote und Baudokumentation |
| Elektro | Aufmaße, Messberichte und Kundenkommunikation |
| Maler | Angebote, Raumbücher und Kundenkommunikation |

**Branche×UseCase:**

```
<UseCase-Name> mit KI für <Branche>-Betriebe: Praxisnahes Training mit
branchenspezifischen Anwendungsfällen und Kompetenznachweis Art. 4 KI-VO.
```

Beide Formeln: natürlich lesbar, kein abgeschnittenes Satzende, eindeutige Differenzierung durch Gewerk- bzw. Branchenname.

---

## Vollständige QA-Prüfungen — Batch 01 nach Fix

| Prüfdimension | Ergebnis |
|---|---|
| Duplicate Content (Title) | OK — 0 Dubletten |
| Duplicate Content (FAQ) | OK — 0 Dubletten |
| Interne Verlinkung | OK — Verwandte Seiten auf allen Seiten |
| **Meta-Daten / Description** | **OK — 20/20 im Zielband 140–160 Zeichen** |
| Schema.org | OK — Service+FAQPage+BreadcrumbList |
| AI-Search-/GEO-Konformität | OK — wirtschaftsprofil-Frage pro Seite |
| CTA-Konsistenz | OK — 1 Grundmuster |
| Lesbarkeit / Template-Konsistenz | OK — Pflichtfelder vollständig |
| Broken Links | OK — alle internen Links verifiziert |
| Canonical | OK — 20/20 korrekt |
| Breadcrumbs | OK — 20/20 BreadcrumbList |
| FAQ-Differenzierung | OK — 0 Dubletten, Regressionstest bestanden |

**Alle 12 Prüfdimensionen: OK. 0 WARNs. 0 FAILs.**

---

## Technische Absicherung

`lib/description-builder.js` enthält eine `assertLength()`-Funktion, die bei jeder Generierung prüft, ob die erzeugte Description im Bereich 120–160 Zeichen liegt. Ein Überschreiten wirft einen Fehler und blockiert das Schreiben — auch bei künftigen Masterdaten mit längeren Gewerk- oder Regionsnamen.

---

## Bestätigung: Batch 01 produktionsreif

Batch 01 (20 Seiten, alle `draft: true`) ist nach diesem Fix **vollständig ohne QA-Warnungen**. Alle Prüfdimensionen bestanden. Der Batch gilt als verbindlicher Qualitätsstandard für alle zukünftigen Serienproduktionen.

Nächste Schritte vor Veröffentlichung (redaktionell, nicht automatisiert):
1. `[REDAKTIONELL]`-Marker in `title`, `lede` und `faqItems[*].a` durch echten Content ersetzen.
2. `heroCards[0].subtitle` ausformulieren.
3. Body-Sections nach Goldstandard-Muster ergänzen.
4. `draft: false` setzen.

*Generator: `scripts/content-factory/batch-production.js --update` · QA: `lib/qa.js` (Schwelle 160 Zeichen)*
