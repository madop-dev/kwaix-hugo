# KWAIX Masterdaten-Validierungsbericht v1.0

Erzeugt mit `scripts/content-factory/validate-masterdata.js` (automatisierte Prüfung gegen Masterdata Schema v1.0, Abschnitt 13). Geprüft: **65 Entitäten** über alle 10 Typen — alle 28 im Masterkatalog v1.0 als "Bestehend" markierten Regionen sind jetzt vollständig integriert.

> **Update (nach diesem Bericht):** Die unten dokumentierte Regel-4-Verletzung (`usecase_refs ≥ 3`) bei allen 6 Unternehmensbereichen wurde inzwischen vollständig behoben — 10 neue Use-Cases ergänzt (2 je Bereich), zusätzlich Steuerberatung als 7. Branche mit eigenem Use-Case angelegt. Aktueller Stand: **81 Entitäten, 0 FAIL, 0 WARN.** Dieser Bericht bleibt als historischer Schnappschuss zum damaligen Stand (65 Entitäten) erhalten.

## Ergebnis im Überblick

| Prüfung | Ergebnis |
|---|---|
| Referenzielle Integrität (Regel 3) | **bestanden** — alle `*_ref`/`*_refs`-Felder lösen auf existierende Dateien auf, inkl. aller 28 `branchenschwerpunkte`-Referenzen der Regionen |
| Bidirektionale Beziehungen (Regel 7, Unternehmensbereich ↔ Use Case) | **bestanden** für alle 5 verknüpften Paare |
| Schichtzuordnung (Regel 9) | **bestanden** — alle 65 Entitäten tragen die für ihren Typ vorgesehene Schicht |
| Duplikate (Namensgleichheit je Entitätstyp) | **bestanden** — keine Duplikate, auch unter den 28 Regionen keine Namensüberschneidung |
| Namenskonventionen (Regel 1, ID-Format) | **bestanden** — alle 65 IDs entsprechen `^[a-z0-9]+(-[a-z0-9]+)*$`, alle Dateinamen stimmen mit dem `id`-Feld überein |
| Zyklusfreiheit symmetrischer Referenzen (Regel 6) | **bestanden** — keine Selbstreferenzen bei `vergleichbare_tools` |
| Pflichtfeld-Mindestanzahl (Regel 4, `unternehmensbereich.usecase_refs ≥ 3`) | **6 von 6 Unternehmensbereichen verstoßen weiterhin** (unverändert gegenüber Vorbericht, nicht regionsbedingt) |

## Regionen-Vervollständigung (dieser Durchlauf)

21 zusätzliche Regionen angelegt, alle Feldwerte aus realem Content extrahiert (Title/Eyebrow/Lede/Description der jeweiligen `content/regionen/<slug>/index.md`), keine erfundenen Profile:

| Land | Regionen |
|---|---|
| Länderebene | Deutschland, Österreich, Schweiz |
| DE | Köln, Frankfurt, Düsseldorf, Leipzig, Dortmund, Nürnberg, Bonn, Münster, Aachen, Tübingen, Heidelberg, Jena |
| AT | Salzburg, Graz, Linz, Innsbruck |
| CH | Basel, Bern |

Zusammen mit den 7 bereits zuvor angelegten (Freiburg, Berlin, München, Wien, Zürich, Stuttgart, Hamburg) ergibt das **28 von 28** im Masterkatalog v1.0 als "Bestehend" freigegebenen Regionen — vollständig.

**Bewusst nicht angelegt:** Niedersachsen und Bremen (Bundesland-Zwischenebene). Diese sind im Masterkatalog v1.0 als Status "Phase 1" geführt, nicht "Bestehend" — obwohl als Content bereits existierend, folgt diese Validierung strikt der Katalog-Freigabe, nicht der physischen Content-Realität (siehe bereits in Domain Specification dokumentierte Diskrepanz). Sie werden mit der Phase-1-Umsetzung nachgezogen, nicht vorab.

## Unverändert bestehender Befund (nicht regionsbedingt, nicht neu)

Alle 6 Unternehmensbereiche unterschreiten weiterhin die Mindestanzahl von 3 `usecase_refs`:

| Unternehmensbereich | Vorhandene Use-Case-Referenzen | Soll |
|---|---|---|
| HR | 1 (Recruiting) | ≥3 |
| Vertrieb | 1 (Angebotserstellung) | ≥3 |
| Kundenservice | 1 (Kundenkommunikation) | ≥3 |
| Marketing | 0 | ≥3 |
| Office/Projekt | 1 (Baustellendokumentation) | ≥3 |
| Management | 1 (Wissensmanagement) | ≥3 |

Ursache und Entscheidung unverändert gegenüber dem Vorbericht: Es existieren produktiv erst 5 atomare Use-Cases; eine Heilung durch erfundene Platzhalter widerspräche der Grundregel "keine Platzhalter". Behebung erfolgt erst mit den Phase-1-Use-Cases aus dem Masterkatalog (Rechnungswesen/Controlling, Content-/Marketingtexte).

## Geprüfte Entitäten nach Typ

| Typ | Anzahl |
|---|---|
| Regionen | **28** (vollständig) |
| Branchen | 6 |
| Gewerke | 5 |
| Unternehmensbereiche | 6 |
| Use Cases | 5 |
| KI-Tools | 3 |
| Trainings | 3 |
| Zertifizierungen | 1 |
| Wissensbereiche | 5 |
| Ressourcen | 3 |
| **Gesamt** | **65** |

## Produktionsbereitschaft: Gesamteinschätzung

**Strukturell produktionsbereit:** Referenzielle Integrität, Schichtzuordnung, Namenskonventionen, Duplikatfreiheit und Zyklusfreiheit sind über den gesamten Bestand zu 100 % erfüllt. Der Content-Factory-Generator kann auf dieser Datenbasis arbeiten, ohne auf gebrochene Referenzen zu treffen.

**Nicht uneingeschränkt produktionsbereit:** Der Unternehmensbereich-Befund (6 von 6 verstoßen gegen Regel 4) ist kein Blocker für den bereits implementierten Kombinationstyp Region×Gewerk (dieser nutzt `unternehmensbereich.usecase_refs` nicht direkt), **wäre aber ein Blocker**, sobald ein Kombinationstyp implementiert wird, der von einem Unternehmensbereich ausgehend dessen Use-Cases aufzählen soll (z. B. eine vollständige Unternehmensbereich-Hub-Seite mit allen zugehörigen Use-Cases). Empfehlung: vor Erweiterung der Content Factory um einen unternehmensbereich-zentrierten Kombinationstyp zunächst die Phase-1-Use-Cases ergänzen.

**Für den nächsten angefragten Schritt (Branche×Use-Case) ist der Bestand vollständig ausreichend** — beide Entitätstypen sind vollständig, korrekt referenziert und enthalten keine offenen Punkte, die diesen spezifischen Kombinationstyp beträfen.

---

*Erzeugt durch `node scripts/content-factory/validate-masterdata.js`. Bei jeder Änderung an `data/` erneut ausführen.*
