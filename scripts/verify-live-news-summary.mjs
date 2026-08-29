const response = await fetch("https://asbestostrusts.org/api/news-drafts?cache_bust=202608290327");

if (!response.ok) {
  throw new Error(`News endpoint returned HTTP ${response.status}`);
}

const data = await response.json();
const draft = data.drafts?.find(
  (item) => item.filename === "2026-08-29-owens-illinois-payment-percentage-increase.md"
);

if (!draft) {
  throw new Error("Owens-Illinois news draft is missing from the live endpoint");
}

if (/(?:^|\s)(?:date|category|url):/.test(draft.summary)) {
  throw new Error(`News metadata leaked into the live summary: ${draft.summary}`);
}

if (!draft.summary.includes("increased its payment percentage from 50% to 65%")) {
  throw new Error(`Expected body summary is missing: ${draft.summary}`);
}

console.log(JSON.stringify(draft, null, 2));
