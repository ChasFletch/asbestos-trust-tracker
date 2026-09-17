import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const uploadLog = readFileSync("/home/ubuntu/all-source-pdf-upload-urls.txt", "utf8");
const entries = {};
let fileName = null;

for (const line of uploadLog.split("\n")) {
  const fileMatch = line.match(/Uploading file .*?: (.+?) \(size:/);
  if (fileMatch) {
    fileName = basename(fileMatch[1]);
    continue;
  }
  const urlMatch = line.match(/^Storage Path: (\/manus-storage\/[^\s]+\.pdf)$/);
  if (fileName && urlMatch) {
    entries[fileName] = urlMatch[1];
    fileName = null;
  }
}

const content = `/** Generated from verified artifact uploads on 2026-08-12. */\nexport const primarySourcePdfUrls = ${JSON.stringify(entries, null, 2)} as const;\n`;
writeFileSync("client/src/data/primarySourcePdfUrls.ts", content);
console.log(`Wrote ${Object.keys(entries).length} source-PDF URLs.`);
