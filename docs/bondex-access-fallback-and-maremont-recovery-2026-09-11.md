# Bondex Access Fallback and Maremont Historical-Report Recovery

**Research date:** September 11, 2026  
**Scope:** No-charge source recovery and monitoring reliability only. This record does not alter any public trust figure by itself.

## Bondex (Specialty Products Holding Corp.) Trust

The legacy Bondex host produced a TLS hostname-validation failure in the scheduled monitor. The reviewed replacement is Claims Processing Facility’s public Bondex page, which identifies CPF as the administrator and describes the Bondex Trust’s claims-processing purpose.[1]

| Field | Verified result |
| --- | --- |
| Controlling public source | `https://www.cpf-inc.com/trusts/bondex-trust` |
| Direct monitor result | The runtime’s direct TLS request could not validate the CPF certificate chain. |
| No-charge monitoring transport | `https://r.jina.ai/https://www.cpf-inc.com/trusts/bondex-trust` |
| Transport result | Retrieved the CPF-hosted Bondex page and its public trust-document links. |
| Evidence limit | The transport is a reachability aid only. A future content change must be checked directly against CPF before a tracker or publication decision. |

## Maremont Corporation Asbestos Disease Compensation Trust

Maremont’s official Resources page currently exposes the FY2025 annual report and public notices. A public archive index also exposed official FY2022–FY2024 annual-report file paths that remain retrievable from the administrator host.[2] [3]

| Fiscal year | Official filed report | Cash payments to claimants | Evidence boundary |
| --- | --- | ---: | --- |
| 2022 | DN 371 | $3,819,783 | Annual payment only; not inception-to-date. |
| 2023 | DN 372 | $4,268,969 | Annual payment only; not inception-to-date. |
| 2024 | DN 373 | $1,824,262 | Annual payment only; not inception-to-date. |
| 2025 | DN 374 | $1,599,971 | Annual payment only; not inception-to-date. |
| FY2022–FY2025 subtotal | — | $11,512,985 | A partial four-year cash-basis subtotal; **not** a cumulative-paid figure. |

The official reports identify inception-to-date claim counts, but none supplies an inception-to-date dollar amount. The public Delaware docket index identifies annual-report filings for 2019, 2021, and 2022, while the FY2019–FY2021 public official file paths tested in this pass did not resolve. The series therefore remains incomplete and must not be placed in `cumulativePaid` or combined with a hypothetical early-year amount.[4]

## Result

Bondex now has a tested, documented no-charge retrieval fallback awaiting registry synchronization. Maremont has advanced from a single FY2025 report to four recovered official annual reports and a clearly bounded FY2022–FY2025 subtotal, but still lacks a complete, reproducible inception-to-date payment series. Its direct HTTPS host presents a self-signed certificate to the project runtime, so the same bounded reader-transport pattern is used solely for reachability monitoring of the official administrator source.

## References

[1]: https://www.cpf-inc.com/trusts/bondex-trust "Claims Processing Facility — Bondex Trust"
[2]: http://maremont.mfrclaims.com/Resources.html "Maremont Asbestos Personal Injury Trust — Resources"
[3]: https://web.archive.org/cdx/search/cdx?url=maremont.mfrclaims.com/assets/documents/resources/*&output=json&filter=statuscode:200&filter=mimetype:application/pdf&fl=timestamp,original&collapse=urlkey "Internet Archive CDX index — Maremont public document paths"
[4]: https://www.inforuptcy.com/browse-filings/delaware-bankruptcy-court/1:19-bk-10118/bankruptcy-case-maremont-corporation "Maremont Corporation — public bankruptcy docket index"
