"use strict";
const yaml = require("js-yaml");
const { pflichtFaqArt4 } = require("./faq-pflicht");
const { buildRegionGewerkFaq, buildBrancheUseCaseFaq } = require("./faq-builder");
const { buildRegionGewerkDescription, buildBrancheUseCaseDescription } = require("./description-builder");

// Region x Gewerk: reproduziert exakt das Frontmatter-Muster des Goldstandard-
// Clusters (ki-training-holzbau-freiburg). Nur Felder, die NICHT vollstaendig
// aus Masterdaten ableitbar sind (Lede-Feinschliff, individuelle FAQ-Antworten),
// bleiben hier als redaktioneller Platzhalter markiert -- die Factory erzeugt sie
// nicht automatisch (Regel 3: redaktionell gepflegte Inhalte).
// Region-IDs (Masterdata) und Content-Ordnernamen weichen historisch ab
// (z.B. id="freiburg", Content-Pfad "/regionen/ki-training-freiburg/").
// dimension.region muss auf den realen Content-Pfad zeigen, nicht auf die ID.
function regionContentPath(region) {
  const m = /^\/regionen\/([^/]+)\/?$/.exec(region.seiten_pfad || "");
  if (!m) throw new Error(`region.seiten_pfad nicht auswertbar fuer ${region.id}: "${region.seiten_pfad}"`);
  return `/regionen/${m[1]}`;
}

function regionGewerkFrontmatter(combo) {
  const { region, branche, gewerk, tools, usecases, training } = combo;
  const slug = `ki-training-${gewerk.id}-${region.id}`;
  const url = `/${slug}/`;

  const fm = {
    title: `[REDAKTIONELL] KI-Training ${gewerk.name} ${region.name}`,
    description: buildRegionGewerkDescription(gewerk, region),
    eyebrow: `Gewerk · ${gewerk.name} ${region.name}`,
    lede: "[REDAKTIONELL] Ein Satz, der region.wirtschaftsprofil und das Gewerk verbindet.",
    draft: true,
    canonical: `https://kwaix.de${url}`,
    type: "leistungen",
    schemaType: "service",
    dimension: {
      region: regionContentPath(region),
      branche: `/branchen/${branche.id}`,
      gewerk: `/gewerke/${gewerk.id}`,
      tools: tools.map((t) => `/ki-tools/${t.id}`),
      usecases: usecases.map((u) => `/ki-anwendungsfaelle/${u.id}`),
    },
    herocta: `KI-Training für ${gewerk.name} in ${region.name} anfragen →`,
    herocta2: "ROI berechnen",
    herocta2href: "/preise/ki-roi-rechner/",
    heroCards: [
      { type: "training", title: `${gewerk.name} ${region.name}`, subtitle: "[REDAKTIONELL] Profil-Schlagworte" },
      { type: "backlog", title: "Use Cases", subtitle: `Aus dem ${gewerk.name}-Alltag` },
      { type: "proof", title: "KI-VO konform", subtitle: "Kompetenznachweis Art. 4" },
    ],
    faqItems: buildRegionGewerkFaq({ gewerk, region, usecases, training }),
  };
  return { slug, url, frontmatter: fm };
}

// Branche x Use Case: zweiter Kombinationstyp (Domain Spec Abschnitt 6).
// Oeffentlich unter /branchen/<branche>/<usecase>/, technisch -- aus demselben
// Grund wie beim Gewerk-Hub (Leaf-Bundle-Problem, Domain Spec 4.3) -- unter
// einem eigenen Content-Pfad content/branchen-anwendungsfaelle/<branche>-<usecase>/
// mit url-Override.
function bracheUseCaseFrontmatter(combo) {
  const { branche, usecase, tools, unternehmensbereich, training } = combo;
  const slug = `${branche.id}-${usecase.id}`;
  const url = `/branchen/${branche.id}/${usecase.id}/`;

  const fm = {
    title: `[REDAKTIONELL] ${usecase.name} in der ${branche.name}`,
    description: buildBrancheUseCaseDescription(branche, usecase),
    eyebrow: `Branche · ${branche.name} · ${usecase.name}`,
    lede: `[REDAKTIONELL] Ein Satz, der erklaert, warum ${usecase.name} in der ${branche.name} eine eigene Auspraegung hat.`,
    draft: true,
    canonical: `https://kwaix.de${url}`,
    type: "leistungen",
    schemaType: "howto",
    dimension: {
      branche: `/branchen/${branche.id}`,
      unternehmensbereich: `/use-cases/${unternehmensbereich.id}`,
      tools: tools.map((t) => `/ki-tools/${t.id}`),
      usecases: [`/ki-anwendungsfaelle/${usecase.id}`],
    },
    herocta: `KI-Training für ${usecase.name} in der ${branche.name} anfragen →`,
    herocta2: "ROI berechnen",
    herocta2href: "/preise/ki-roi-rechner/",
    heroCards: [
      { type: "backlog", title: `${usecase.name}`, subtitle: `Branche ${branche.name}` },
      { type: "training", title: branche.name, subtitle: "[REDAKTIONELL] Profil-Schlagworte" },
      { type: "proof", title: "KI-VO konform", subtitle: "Kompetenznachweis Art. 4" },
    ],
    faqItems: buildBrancheUseCaseFaq({ branche, usecase, training }),
  };
  return { slug, url, frontmatter: fm };
}

function ueseCaseHubFrontmatter(usecase, unternehmensbereich, tools) {
  const url = `/ki-anwendungsfaelle/${usecase.id}/`;
  return {
    slug: usecase.id,
    url,
    frontmatter: {
      title: `[REDAKTIONELL] ${usecase.name} mit KI`,
      description: `[REDAKTIONELL] ${usecase.name} mit KI: <Kernaussage>.`,
      eyebrow: `KI-Anwendungsfall · ${usecase.name}`,
      lede: "[REDAKTIONELL]",
      draft: true,
      canonical: `https://kwaix.de${url}`,
      type: "leistungen",
      schemaType: "howto",
      dimension: {
        unternehmensbereich: `/use-cases/${unternehmensbereich.id}`,
        tools: tools.map((t) => `/ki-tools/${t.id}`),
      },
      faqItems: [
        { q: `Welche Vorlagen oder Eingaben braucht KI für ${usecase.name}?`, a: "[REDAKTIONELL]" },
        { q: "Ersetzt das die fachliche Prüfung?", a: "[REDAKTIONELL]" },
        pflichtFaqArt4(),
      ],
    },
  };
}

function kiToolHubFrontmatter(tool) {
  const url = `/ki-tools/${tool.id}/`;
  return {
    slug: tool.id,
    url,
    frontmatter: {
      title: `[REDAKTIONELL] ${tool.name}: Einordnung für Unternehmen`,
      description: `[REDAKTIONELL] ${tool.name} im Überblick: ${tool.klasse === "vertikal" ? `branchenspezifisches Werkzeug (${tool.domaene})` : "allgemeines KI-Werkzeug"}.`,
      eyebrow: `KI-Tool · ${tool.name}`,
      lede: "[REDAKTIONELL]",
      draft: true,
      canonical: `https://kwaix.de${url}`,
      type: "leistungen",
      schemaType: "softwareapplication",
      faqItems: [
        { q: `Wofür ist ${tool.name} geeignet?`, a: "[REDAKTIONELL]" },
        { q: `Ist ${tool.name} ein eigenständiges Trainingsangebot von KWAIX?`, a: "Nein. KWAIX trainiert tool-agnostisch und ordnet Tools neutral ein, ohne Vertriebsinteresse am Tool selbst." },
      ],
    },
  };
}

function toFrontmatterYaml(fm) {
  return `---\n${yaml.dump(fm, { lineWidth: 120, noRefs: true })}---\n\n[REDAKTIONELL: Body-Sections (section/cards/cta-Shortcodes) nach Goldstandard-Muster ergaenzen.]\n`;
}

module.exports = { regionGewerkFrontmatter, bracheUseCaseFrontmatter, ueseCaseHubFrontmatter, kiToolHubFrontmatter, toFrontmatterYaml, pflichtFaqArt4 };
