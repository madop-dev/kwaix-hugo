---
title: "Datenschutz & DSGVO beim KI-Einsatz im Unternehmen"
description: "Was Unternehmen beim KI-Einsatz datenschutzrechtlich beachten müssen: DSGVO, Auftragsverarbeitung, Personaldaten und KI-Verordnung im Überblick."
eyebrow: "KI-VO · Datenschutz & DSGVO"
lede: "KI-Tools verarbeiten Daten. Was dabei DSGVO-konform ist, hängt vom Tool, der Konfiguration und der Nutzung ab — nicht von einer pauschalen Regel."
draft: false
canonical: "https://kwaix.de/ki-vo/datenschutz-dsgvo/"
schemaType: "service"
heroCards:
  - type: policy
    title: "DSGVO"
    subtitle: "Was beim KI-Einsatz gilt"
  - type: proof
    title: "Orientierung"
    subtitle: "Keine Rechtsberatung"
  - type: training
    title: "Im Training"
    subtitle: "Datenschutz praktisch"
faqItems:
  - q: "Darf ich ChatGPT oder Microsoft Copilot im Unternehmen nutzen?"
    a: "Das kommt auf die Konfiguration und die verarbeiteten Daten an. Microsoft Copilot (Enterprise) bietet einen Auftragsverarbeitungsvertrag (AVV) und speichert Daten innerhalb der EU — das ist DSGVO-konformer als die öffentliche ChatGPT-Version. ChatGPT für Unternehmen (ChatGPT Team/Enterprise) bietet ebenfalls AVV und kein Training mit Kundendaten. Für verbindliche Einschätzungen empfehlen wir den eigenen Datenschutzbeauftragten oder eine spezialisierte Kanzlei."
  - q: "Welche Daten dürfen nicht in KI-Tools eingegeben werden?"
    a: "Ohne Auftragsverarbeitungsvertrag (AVV) sollten keine personenbezogenen Daten in KI-Tools eingegeben werden — also keine Kundennamen, E-Mail-Adressen, Vertragsdaten, Gesundheitsdaten, Personaldaten oder andere Informationen, aus denen Personen identifizierbar sind. Mit AVV gelten die Regelungen des Vertrags und des Anbieters."
  - q: "Was ist ein Auftragsverarbeitungsvertrag (AVV) bei KI-Tools?"
    a: "Ein AVV ist ein Vertrag zwischen Ihrem Unternehmen und dem KI-Anbieter, der regelt, wie der Anbieter personenbezogene Daten in Ihrem Auftrag verarbeitet. Ohne AVV sind Sie als Verantwortlicher haftbar für jeden Datenschutzverstoß. Microsoft 365 Copilot, Google Workspace und ChatGPT Enterprise bieten AVVs an."
  - q: "Wie verhält sich die DSGVO zur EU KI-Verordnung?"
    a: "DSGVO und EU KI-Verordnung ergänzen sich. Die DSGVO regelt den Schutz personenbezogener Daten — auch bei deren Verarbeitung durch KI-Systeme. Die EU KI-Verordnung regelt zusätzlich Anforderungen an KI-Systeme selbst (Transparenz, Risikomanagement, Kompetenzpflichten). Beide gelten parallel."
  - q: "Brauche ich für KI-Tools eine Datenschutz-Folgenabschätzung (DSFA)?"
    a: "Eine DSFA ist erforderlich, wenn der KI-Einsatz ein hohes Risiko für die Rechte und Freiheiten natürlicher Personen birgt — z.B. beim systematischen KI-basierten Profiling von Kunden oder Mitarbeitenden. Für den üblichen Einsatz von KI-Tools zur Texterstellung oder Recherche ist in der Regel keine DSFA erforderlich. Ihr Datenschutzbeauftragter sollte das im Einzelfall prüfen."
  - q: "Muss ich die Nutzung von KI-Tools im Unternehmen in der Datenschutzerklärung erwähnen?"
    a: "Wenn Sie KI-Tools einsetzen, die personenbezogene Daten Ihrer Kunden verarbeiten (z.B. KI-gestützte Kommunikation), sollten Sie das in Ihrer Datenschutzerklärung transparent machen. Für interne Tools, die nur Mitarbeiterdaten verarbeiten, gilt das Mitarbeiterdatenschutzrecht."
---

{{< section tone="plain" >}}

## KI-Einsatz und DSGVO — was Sie wissen müssen

Der Einsatz von KI-Tools im Unternehmen ist nicht automatisch DSGVO-widrig. Entscheidend ist, **welche Daten in welches Tool** eingegeben werden — und ob die vertraglichen Voraussetzungen stimmen.

**Wichtig:** Diese Seite gibt eine Orientierung, ersetzt aber keine Rechtsberatung. Für verbindliche Datenschutzfragen wenden Sie sich an Ihren Datenschutzbeauftragten oder eine spezialisierte Kanzlei.

## Auf einen Blick

- **Grundregel:** Keine personenbezogenen Daten ohne Auftragsverarbeitungsvertrag (AVV) in KI-Tools
- **Tools mit AVV:** Microsoft 365 Copilot, Google Workspace, ChatGPT Enterprise/Team
- **DSGVO + KI-VO gelten parallel** — sie ergänzen sich, ersetzen sich nicht
- **Schulungspflicht:** Artikel 4 KI-VO fordert, dass Mitarbeitende Datenschutzrisiken beim KI-Einsatz kennen
- **Im KWAIX-Training:** Datenschutzgrundlagen und Policy-Regeln sind fester Bestandteil

{{< kpiStrip k1_label="Grundregel" k1_value="Kein AVV = keine Personaldaten" k2_label="DSGVO" k2_value="gilt parallel" k3_label="KI-VO Art. 4" k3_value="Schulung Pflicht" k4_label="Hinweis" k4_value="Keine Rechtsberatung" >}}

{{< /section >}}

{{< section tone="tint" >}}

## Die wichtigsten Datenschutzregeln beim KI-Einsatz

{{< cards cols="3" >}}
{{< card icon="policy" title="Kein AVV = keine Personaldaten" text="Ohne Auftragsverarbeitungsvertrag dürfen keine personenbezogenen Daten (Kunden, Mitarbeitende) in KI-Tools eingegeben werden." >}}
{{< card icon="policy" title="AVV prüfen vor Einsatz" text="Vor dem Unternehmens-Rollout jedes KI-Tools prüfen, ob ein AVV vorliegt und welche Datenspeicherorte er abdeckt." >}}
{{< card icon="training" title="Mitarbeitende schulen" text="Alle Mitarbeitenden, die KI-Tools nutzen, müssen wissen, welche Daten sie eingeben dürfen und welche nicht." >}}
{{< card icon="backlog" title="Tool-Inventur" text="Welche KI-Tools sind im Unternehmen im Einsatz? Oft werden mehr Tools genutzt als der IT bekannt ist." >}}
{{< card icon="proof" title="Dokumentation" text="Tool-Freigaben, AVVs und Schulungsnachweise (Artikel 4 KI-VO) sollten zentral archiviert werden." >}}
{{< card icon="policy" title="DSFA prüfen" text="Bei KI-Einsatz mit hohem Risiko (Profiling, HR-Entscheidungen) Datenschutz-Folgenabschätzung prüfen." >}}
{{< /cards >}}

## DSGVO und KI-Verordnung — das Verhältnis

| | DSGVO | EU KI-Verordnung |
|---|---|---|
| **Regelt** | Verarbeitung personenbezogener Daten | KI-Systeme und deren Risikostufen |
| **Gilt seit** | 25. Mai 2018 | Stufenweise ab 2024–2027 |
| **Für KMU relevant** | Immer, wenn Kundendaten verarbeitet werden | Seit 2. August 2025 (Artikel 4 KI-Kompetenz) |
| **Sanktionen** | Bis 20 Mio. € / 4 % Jahresumsatz | Bis 15 Mio. € / 3 % Jahresumsatz |

{{< cta primaryHref="mailto:info@kwaix.de?subject=Datenschutz%20KI-Einsatz%20besprechen" primaryText="Datenschutz im KI-Kickoff klären" secondaryHref="/ki-vo/ki-policy/" secondaryText="KI-Policy erstellen" >}}

{{< /section >}}

{{< section tone="plain" >}}

## FAQ: Datenschutz & DSGVO beim KI-Einsatz

**Darf ich ChatGPT oder Microsoft Copilot im Unternehmen nutzen?**
Das hängt von der Konfiguration und den verarbeiteten Daten ab. Microsoft Copilot Enterprise bietet einen AVV und EU-Datenspeicherung. ChatGPT Enterprise bietet ebenfalls AVV und kein Training mit Kundendaten. Für die öffentliche ChatGPT-Version gilt: keine personenbezogenen Daten eingeben. Für verbindliche Einschätzungen: Datenschutzbeauftragten oder Kanzlei hinzuziehen.

**Welche Daten dürfen nicht in KI-Tools eingegeben werden?**
Ohne AVV: keine personenbezogenen Daten — also keine Kundennamen, E-Mail-Adressen, Vertragsdaten, Gesundheitsdaten, Personaldaten oder Informationen, aus denen Personen identifizierbar sind.

**Was ist ein Auftragsverarbeitungsvertrag (AVV)?**
Ein Vertrag zwischen Ihrem Unternehmen und dem KI-Anbieter, der regelt, wie der Anbieter personenbezogene Daten in Ihrem Auftrag verarbeitet. Ohne AVV sind Sie als Verantwortlicher haftbar für Datenschutzverstöße.

**Wie verhält sich die DSGVO zur EU KI-Verordnung?**
Beide gelten parallel und ergänzen sich. Die DSGVO regelt den Schutz personenbezogener Daten. Die EU KI-Verordnung regelt Anforderungen an KI-Systeme selbst — Transparenz, Risikomanagement, Kompetenzpflichten.

**Brauche ich für KI-Tools eine Datenschutz-Folgenabschätzung?**
Nur bei hohem Risiko — z.B. systematisches KI-basiertes Profiling von Kunden oder Mitarbeitenden. Für üblichen Einsatz zur Texterstellung oder Recherche in der Regel nicht. Prüfung durch den Datenschutzbeauftragten empfohlen.

{{< cta primaryHref="mailto:info@kwaix.de?subject=DSGVO%20KI-Einsatz%20anfragen" primaryText="Im Kickoff besprechen" secondaryHref="/ki-vo/" secondaryText="KI-VO Übersicht" >}}

{{< /section >}}
