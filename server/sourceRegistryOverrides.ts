export type SourceClass = "official_trust" | "administrator" | "case_agent" | "court" | "government" | "primary_document";

export type SourceRegistryOverride = {
  trustName: string;
  sourceUrl: string;
  sourceClass: SourceClass;
  retrievalNotes: string;
  /**
   * Optional no-charge retrieval transport for a public controlling source
   * whose host cannot complete a monitored runtime request. The sourceUrl
   * remains the controlling public source; a transport result is detection
   * evidence only and never establishes a tracker fact by itself.
   */
  monitoringUrl?: string;
};

// Reviewed no-charge public monitoring routes. Registration is not a claim
// that a source is current or that its content establishes a public fact.
export const SOURCE_REGISTRY_OVERRIDES: Record<string, SourceRegistryOverride> = {
  "a-best-products-asbestos-trust": { trustName: "A-Best Products Asbestos Trust", sourceUrl: "https://www.abestasbestostrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; use public documents and notices only." },
  "a-i-corporation-asbestos-bodily-injury-trust": { trustName: "A & I Corporation Asbestos Bodily Injury Trust", sourceUrl: "https://www.aisettlement.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; use public documents and notices only." },
  "a-p-green-apg-asbestos-trust": { trustName: "A.P. Green (APG) Asbestos Trust", sourceUrl: "https://apg.mfrclaims.com/", sourceClass: "administrator", retrievalNotes: "Official administrator-hosted trust portal reviewed 2026-09-07." },
  "abb-lummus-global-inc-524-g-asbestos-pi-trust": { trustName: "ABB Lummus Global Inc. 524(g) Asbestos PI Trust", sourceUrl: "https://www.abblummustrust.org/", sourceClass: "official_trust", retrievalNotes: "Official trust portal reviewed 2026-09-07; supplements the filed-report URL in the tracker." },
  "acands-asbestos-settlement-trust": { trustName: "ACandS Asbestos Settlement Trust", sourceUrl: "https://www.acandsasbestostrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal reviewed 2026-09-07; use public documents and notices only." },
  "api-inc-asbestos-settlement-trust": { trustName: "API, Inc. Asbestos Settlement Trust", sourceUrl: "https://apiincasbestossettlementtrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal reviewed 2026-09-07; supplements filed-report coverage." },
  "brauer-524-g-asbestos-trust-brauer-supply-company": { trustName: "Brauer 524(g) Asbestos Trust", sourceUrl: "https://www.brauertrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; preserve Wayback evidence separately." },
  "burns-and-roe-personal-injury-settlement-trust": { trustName: "Burns and Roe Personal Injury Settlement Trust", sourceUrl: "https://www.burnsandroetrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; use public documents and notices only." },
  "c-e-thurston-sons-asbestos-trust": { trustName: "C.E. Thurston & Sons Asbestos Trust", sourceUrl: "https://www.thurstonasbestostrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal reviewed 2026-09-07; CRMC remains a documented fallback." },
  "christy-refractories-asbestos-pi-trust": { trustName: "Christy Refractories Asbestos PI Trust", sourceUrl: "https://www.christy-trust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal reviewed 2026-09-07; Verus remains a documented fallback." },
  "duro-dyne-asbestos-personal-injury-trust": { trustName: "Duro Dyne Asbestos Personal Injury Trust", sourceUrl: "https://durodyne.mfrclaims.com/", sourceClass: "administrator", retrievalNotes: "Official administrator-hosted trust portal reviewed 2026-09-07." },
  "fuller-austin-asbestos-settlement-trust": { trustName: "Fuller-Austin Asbestos Settlement Trust", sourceUrl: "https://www.fulleraustintrust.org/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; record future access limitations explicitly." },
  "hercules-chemical-co-asbestos-settlement-trust": { trustName: "Hercules Chemical Co. Asbestos Settlement Trust", sourceUrl: "https://hercules.mfrclaims.com/", sourceClass: "administrator", retrievalNotes: "Official administrator-hosted trust portal reviewed 2026-09-07." },
  "j-t-thorpe-company-successor-trust-tx": { trustName: "J.T. Thorpe Company Successor Trust (TX)", sourceUrl: "https://thorpe.mfrclaims.com/", sourceClass: "administrator", retrievalNotes: "Official administrator-hosted trust portal reviewed 2026-09-07." },
  "keene-creditors-trust": {
    trustName: "Keene Creditors Trust",
    sourceUrl: "https://www.cpf-inc.com/keene-trust-payment-percentage2024",
    sourceClass: "administrator",
    monitoringUrl: "https://r.jina.ai/https://www.cpf-inc.com/keene-trust-payment-percentage2024",
    retrievalNotes: "Official Claims Processing Facility payment-notice page and linked October 28, 2024 notice verified 2026-09-09. The project runtime cannot complete TLS validation for cpf-inc.com; monitoring uses a no-charge reader transport only to observe that official page. Any detected content change requires direct official CPF verification before a tracker or publication decision.",
  },
  "leslie-controls-inc-asbestos-personal-injury-trust": { trustName: "Leslie Controls Inc. Asbestos PI Trust", sourceUrl: "https://leslie.mfrclaims.com/", sourceClass: "administrator", retrievalNotes: "Official administrator-hosted trust portal reviewed 2026-09-07." },
  "motors-liquidation-co-gm-asbestos-pi-trust": { trustName: "Motors Liquidation Co. (GM) Asbestos PI Trust", sourceUrl: "https://www.claimsres.com/documents/mlc/", sourceClass: "administrator", retrievalNotes: "Official CRMC document repository reviewed 2026-09-07." },
  "porter-hayden-bodily-injury-trust": { trustName: "Porter Hayden Bodily Injury Trust", sourceUrl: "https://www.porterhaydentrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; Verus is the documented fallback." },
  "rapid-american-asbestos-pi-trust": { trustName: "Rapid-American Asbestos PI Trust", sourceUrl: "https://www.rapidamericanasbestostrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal reviewed 2026-09-07; DCPF is the documented fallback." },
  "raytech-raymark-trust": {
    trustName: "Raytech/Raymark Trust",
    sourceUrl: "https://www.cpf-inc.com/trusts/raytech-trust/",
    sourceClass: "administrator",
    monitoringUrl: "https://r.jina.ai/https://www.cpf-inc.com/trusts/raytech-trust/",
    retrievalNotes: "Official Claims Processing Facility trust page verified through a no-charge reader transport 2026-09-15 after the project runtime could not complete the direct route. The official CPF URL remains controlling; a transport signal requires direct official-source verification before any tracker or publication decision.",
  },
  "shook-fletcher-asbestos-settlement-trust": { trustName: "Shook & Fletcher Asbestos Settlement Trust", sourceUrl: "https://www.claimsres.com/shook-fletcher/", sourceClass: "administrator", retrievalNotes: "Official CRMC trust page reviewed 2026-09-07." },
  "t-h-agriculture-nutrition-l-l-c-asbestos-personal-injury-trust-than": { trustName: "T-H Agriculture & Nutrition (THAN) Asbestos PI Trust", sourceUrl: "https://www.thanasbestostrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; preserve filed-document evidence separately." },
  "united-gilsonite-ugl-asbestos-pi-trust": {
    trustName: "United Gilsonite (UGL) Asbestos PI Trust",
    sourceUrl: "https://www.ugltrust.com/",
    sourceClass: "official_trust",
    monitoringUrl: "https://r.jina.ai/https://www.ugltrust.com/",
    retrievalNotes: "Official trust portal and current resource library verified 2026-09-15. The project runtime received a transport failure, so monitoring uses a no-charge reader transport only to observe the controlling official site; CPF remains a documented fallback. Any signal requires direct official-source verification before a tracker or publication decision.",
  },
  "united-states-mineral-products-company-asbestos-pi-settlement-trust": { trustName: "U.S. Mineral Products Company Asbestos PI Settlement Trust", sourceUrl: "https://www.usmineraltrust.com/", sourceClass: "official_trust", retrievalNotes: "Official trust portal lead reviewed 2026-09-07; Verus is the documented fallback." },
  "bondex-specialty-products-holding-corp-trust": {
    trustName: "Bondex (Specialty Products Holding Corp.) Trust",
    sourceUrl: "https://www.cpf-inc.com/trusts/bondex-trust",
    sourceClass: "administrator",
    monitoringUrl: "https://r.jina.ai/https://www.cpf-inc.com/trusts/bondex-trust",
    retrievalNotes: "Official Claims Processing Facility Bondex page verified 2026-09-11. The project runtime cannot complete direct CPF TLS validation; monitoring uses a no-charge reader transport only to observe that controlling official page. Any detected content change requires direct official CPF verification before a tracker or publication decision.",
  },
  "congoleum-plan-trust": { trustName: "Congoleum Plan Trust", sourceUrl: "https://www.congoleumtrust.com/", sourceClass: "official_trust", retrievalNotes: "Replaces non-resolving congoleumplantrust.com host; evaluate the live site’s TLS behavior separately." },
  "eagle-picher-industries-pi-settlement-trust": {
    trustName: "Eagle-Picher Industries PI Settlement Trust",
    sourceUrl: "https://www.cpf-inc.com/trusts/epi-trust/",
    sourceClass: "administrator",
    monitoringUrl: "https://r.jina.ai/https://www.cpf-inc.com/trusts/epi-trust/",
    retrievalNotes: "Official CPF EPI page verified through a no-charge reader transport 2026-09-15 after direct project-runtime access failed. The CPF page remains controlling; the transport is detection-only and any material signal requires direct official-source verification.",
  },
  "g-i-holdings-gaf-asbestos-pi-settlement-trust": { trustName: "G-I Holdings (GAF) Asbestos PI Settlement Trust", sourceUrl: "https://www.g-itrust.com/", sourceClass: "official_trust", retrievalNotes: "Replaces non-resolving giasbestostrust.com host with reviewed active trust site." },
  "kaiser-gypsum-asbestos-pi-trust": { trustName: "Kaiser Gypsum Asbestos PI Trust", sourceUrl: "https://www.kaisergypsumtrust.org/", sourceClass: "official_trust", retrievalNotes: "Replaces non-resolving .com host with reviewed official .org trust site." },
  "maremont-asbestos-pi-trust": {
    trustName: "Maremont Asbestos PI Trust",
    sourceUrl: "https://maremont.mfrclaims.com/",
    sourceClass: "administrator",
    monitoringUrl: "https://r.jina.ai/https://maremont.mfrclaims.com/",
    retrievalNotes: "Official administrator portal and FY2022–FY2025 annual reports reviewed 2026-09-11. The direct HTTPS host presents a self-signed certificate to the project runtime; monitoring uses a no-charge reader transport only to observe the controlling official source. Any detected content change requires direct official-source verification before a tracker or publication decision.",
  },
  "narco-asbestos-trust": { trustName: "NARCO Asbestos Trust", sourceUrl: "https://www.narcoasbestostrust.org/", sourceClass: "official_trust", retrievalNotes: "Replaces non-resolving narcotrust.com host; use browser-compatible retrieval only if direct checks meet a WAF." },
  "ngc-bodily-injury-trust-national-gypsum": { trustName: "NGC Bodily Injury Trust", sourceUrl: "https://www.ngcbitrust.org/", sourceClass: "official_trust", retrievalNotes: "Replaces non-resolving ngcasbestostrust.com host; evaluate TLS behavior on the active site." },
  "owens-corning-fibreboard-asbestos-pi-trust": { trustName: "Owens Corning/Fibreboard Asbestos PI Trust", sourceUrl: "https://www.ocfbasbestostrust.com/", sourceClass: "official_trust", retrievalNotes: "Replaces misspelled ocfasbestostrust.com host; use browser-compatible retrieval only if the active site meets a WAF." },
  "quigley-company-asbestos-pi-trust": { trustName: "Quigley Company Asbestos PI Trust", sourceUrl: "https://www.quigleytrust.com/", sourceClass: "official_trust", retrievalNotes: "Replaces the non-resolving quigleyasbestostrust.com host with the verified official trust site and public resources library, reviewed 2026-09-15." },
  "w-r-grace-asbestos-pi-trust": { trustName: "W.R. Grace Asbestos PI Trust", sourceUrl: "https://www.wrgraceasbestostrust.com/", sourceClass: "official_trust", retrievalNotes: "Replaces the SSL-failing wrgasbestospitrust.com host with the verified official DCPF-hosted trust site, reviewed 2026-09-15." },
  "yarway-asbestos-pi-trust": { trustName: "Yarway Asbestos PI Trust", sourceUrl: "https://www.yarwaytrust.com/", sourceClass: "official_trust", retrievalNotes: "Replaces the defunct yarwayasbestostrust.com host with the verified official trust site and public resources library, reviewed 2026-09-15." },
};
