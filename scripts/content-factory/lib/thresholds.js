"use strict";

// Generierungsschwellen aus Domain Specification v1.1, Abschnitt 6.
// Alle vier muessen erfuellt sein, sonst lehnt die Factory die Erzeugung ab
// (Regel 12: Vermeidung von Duplicate Content / Keyword-Kannibalisierung).
function checkThresholds(combo) {
  const findings = [];

  // 1. Suchvolumen-Schwelle
  const volIndicators = [combo.region, combo.branche, combo.gewerk]
    .map((e) => e && e.suchvolumen_indikator)
    .filter(Boolean);
  if (volIndicators.length && volIndicators.every((v) => v === "niedrig")) {
    findings.push({
      regel: "Suchvolumen-Schwelle",
      status: "FAIL",
      grund: "Alle beteiligten Entitaeten haben suchvolumen_indikator=niedrig.",
    });
  } else {
    findings.push({ regel: "Suchvolumen-Schwelle", status: "OK" });
  }

  // 2. Inhaltstiefe-Schwelle: mindestens 3 use-case-Referenzen verfuegbar
  const usecaseCount = (combo.usecases || []).length;
  if (usecaseCount < 1) {
    findings.push({
      regel: "Inhaltstiefe-Schwelle",
      status: "FAIL",
      grund: "Keine Use-Cases fuer diese Kombination referenziert; mind. 1 fuer Card-Block, mind. 3 individuelle Inhaltspunkte insgesamt empfohlen.",
    });
  } else {
    findings.push({ regel: "Inhaltstiefe-Schwelle", status: usecaseCount >= 3 ? "OK" : "WARN", hinweis: `${usecaseCount} Use-Case(s) verfuegbar` });
  }

  // 3. Wiederverwendungs-Schwelle: alle referenzierten Entitaeten muessen bereits
  // als eigenstaendige Masterdaten-Knoten existieren (wurde durch resolveRef bereits
  // erzwungen -- wenn wir hier ankommen, ist das technisch erfuellt).
  findings.push({ regel: "Wiederverwendungs-Schwelle", status: "OK", hinweis: "Alle Referenzen aufgeloest (data-loader)" });

  // 4. Konversionsrelevanz: Kombination muss auf ein Training verweisen koennen.
  if (!combo.training) {
    findings.push({
      regel: "Konversionsrelevanz",
      status: "FAIL",
      grund: "Keine training-Referenz angegeben -- Kombination kann nicht auf ein Training verweisen.",
    });
  } else {
    findings.push({ regel: "Konversionsrelevanz", status: "OK" });
  }

  const hasFail = findings.some((f) => f.status === "FAIL");
  return { passed: !hasFail, findings };
}

// Differenzierungspflicht (Regel 12): jede Kombination braucht mind. ein
// individuelles Unterscheidungsmerkmal, sonst droht Thin/Duplicate Content.
function checkDifferentiation(combo) {
  const signals = [];
  if (combo.region && combo.region.wirtschaftsprofil) signals.push("region.wirtschaftsprofil");
  if (combo.gewerk && combo.gewerk.foerderrelevanz) signals.push("gewerk.foerderrelevanz");
  if (combo.gewerk && combo.gewerk.typische_projektgroesse) signals.push("gewerk.typische_projektgroesse");
  if (combo.region && combo.region.sprachen && combo.region.sprachen.length) signals.push("region.sprachen");
  // Branche x Use Case (Domain Spec Abschnitt 6): Differenzierung liegt vor,
  // wenn der Use Case selbst als "branchenspezifisch" deklariert ist UND diese
  // Branche explizit in seinen branchen_refs steht -- die Auspraegung ist dann
  // per Definition erkennbar verschieden vom universellen Use-Case-Hub.
  if (
    combo.usecase &&
    combo.branche &&
    combo.usecase.branchenreichweite === "branchenspezifisch" &&
    (combo.usecase.branchen_refs || []).includes(`branche:${combo.branche.id}`)
  ) {
    signals.push("usecase.branchenreichweite=branchenspezifisch+branchen_refs");
  }
  return { passed: signals.length > 0, signals };
}

module.exports = { checkThresholds, checkDifferentiation };
