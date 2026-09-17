const origin = "https://asbestostrusts.org";

function jsonLdScripts(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .flatMap((text) => {
      try {
        return [JSON.parse(text)];
      } catch {
        return [];
      }
    });
}

const [homeHtml, methodologyHtml] = await Promise.all([
  fetch(`${origin}/`).then((response) => response.text()),
  fetch(`${origin}/methodology`).then((response) => response.text()),
]);

const faqPage = jsonLdScripts(methodologyHtml).find((schema) => schema["@type"] === "FAQPage");
const questions = faqPage?.mainEntity ?? [];
const perClaimantFaq = questions.find((question) => /claimant|trusts.*file/i.test(question.name ?? ""));
const assertions = [
  ["Homepage asset floor", homeHtml.includes("15,987,271,944")],
  ["Homepage payout total", homeHtml.includes("30,020,097,653")],
  ["Homepage active-trust stat", homeHtml.includes("54 active trusts tracked")],
  ["Homepage Court-Filed Sources tile", homeHtml.includes("Court-Filed Sources")],
  ["Homepage Current-Year Data tile", homeHtml.includes("Current-Year Data")],
  ["Homepage documented-assets tile", homeHtml.includes("Trusts With Documented Assets")],
  ["Methodology per-claimant heading", methodologyHtml.includes("Per-Claimant Statistics: A Measured Void")],
  ["Methodology August 16 revision", methodologyHtml.includes("2026-08-16")],
  ["FAQPage JSON-LD present", Boolean(faqPage)],
  ["FAQ JSON-LD asset floor", JSON.stringify(faqPage).includes("15,987,271,944")],
  ["FAQ JSON-LD payout total", JSON.stringify(faqPage).includes("30,020,097,653")],
  ["FAQ JSON-LD per-claimant question", Boolean(perClaimantFaq)],
];

for (const [label, passed] of assertions) {
  console.log(`${passed ? "PASS" : "FAIL"} — ${label}`);
}
console.log("FAQ per-claimant question:", perClaimantFaq?.name ?? "not found");
if (assertions.some(([, passed]) => !passed)) process.exitCode = 1;
