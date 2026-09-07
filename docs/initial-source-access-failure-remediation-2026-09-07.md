# Initial Source-Access Failure Remediation

**Observed during:** First actual scheduled daily source-detection run, 2026-09-07  
**Scope:** Nine registered source checks that failed to complete.  
**Interpretation rule:** A source-access failure is an operational finding only. It does not establish that the trust, rate, assets, claims process, or court status has not changed.

## Diagnosed Failures and Public Fallbacks

| Trust | Failed registered URL | Failure classification | Verified public fallback | Fallback type | Controlled next step |
|---|---|---|---|---|---|
| Bondex (Specialty Products Holding Corp.) Trust | `https://www.bondexasbestostrust.com` | TLS hostname mismatch: the host presented a certificate for `efile.cpf-inc.com` | https://www.cpf-inc.com/trusts/bondex-trust | Administrator | Register the CPF trust page; preserve the failed host as a technical-history note. |
| Congoleum Plan Trust | `https://www.congoleumplantrust.com` | DNS failure / non-resolving host | https://www.congoleumtrust.com/ | Official trust | Replace the obsolete host; evaluate the live site’s TLS behavior separately. |
| Eagle-Picher Industries PI Settlement Trust | `https://www.eaglepicherasbestostrust.com` | DNS failure / non-resolving host | https://www.cpf-inc.com/trusts/epi-trust/ | Administrator | Register the CPF EPI page; retain public court sources as a secondary no-charge route. |
| G-I Holdings (GAF) Asbestos PI Settlement Trust | `https://www.giasbestostrust.com` | DNS failure / non-resolving host | https://www.g-itrust.com/ | Official trust | Replace the failed domain with the verified active trust host. |
| Kaiser Gypsum Asbestos PI Trust | `https://www.kaisergypsumasbestostrust.com` | DNS failure / non-resolving host | https://www.kaisergypsumtrust.org/ | Official trust | Replace the incorrect `.com` host with the active `.org` official trust site. |
| Maremont Asbestos PI Trust | `https://www.maremontasbestostrust.com` | HTTPS/TLS connection termination | https://maremont.mfrclaims.com/ | Administrator | Use the Verus/MFR administrator portal; preserve the legacy host as an access-history note. |
| NARCO Asbestos Trust | `https://www.narcotrust.com` | DNS failure / non-resolving host | https://www.narcoasbestostrust.org/ | Official trust | Replace the obsolete host; use browser-compatible retrieval only if the verified site’s WAF requires it. |
| NGC Bodily Injury Trust (National Gypsum) | `https://www.ngcasbestostrust.com` | DNS failure / non-resolving host | https://www.ngcbitrust.org/ | Official trust | Replace the incorrect host and evaluate the verified site’s TLS behavior separately. |
| Owens Corning/Fibreboard Asbestos PI Trust | `https://www.ocfasbestostrust.com` | DNS failure; correct official domain has an additional `b` | https://www.ocfbasbestostrust.com/ | Official trust | Replace the misspelled host; use browser-compatible retrieval if the active site requires its WAF. |

## Controlled Fallback Policy

The monitor should attempt a documented public fallback only after a registered source returns an access failure. Fallback success proves only that the source was reachable; a content change continues to create an internal candidate for source review. A fallback must not automatically replace a tracker figure, publish an article, or silently erase the original failure history.

No fallback in this record requires a PACER purchase, paid record, paid data service, or external marketing/secondary source. When a fallback is unavailable or fails, the weekly coverage digest should retain the source as blocked and identify the relevant official court or administrator route for manual, no-charge follow-up.

## Registration Result

On September 7, 2026, the reviewed source registrations were synchronized through a controlled administrative path that writes registry and audit records only. It made no external source request, changed no public tracker fact, and did not authorize publication. The active registry now contains **56 public monitoring sources** and no unresolved source-gap candidates. Twenty-four prior source-gap records were marked verified after reviewed source registration, and **20 duplicate legacy gap rows** created during the identifier-repair transition were retired with a preserved audit disposition.

The registry contains 33 registrations added or replaced in this pass: 24 source-gap resolutions plus the nine source-specific failure replacements above. Each source remains subject to normal scheduled reachability and content-change checks. A newly reachable source is not treated as evidence that a payment percentage, assets figure, trust status, claim process, or litigation fact has changed.
