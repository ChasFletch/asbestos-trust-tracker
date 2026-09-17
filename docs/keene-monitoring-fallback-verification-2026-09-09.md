# Keene Monitoring Fallback Verification — 2026-09-09

## Purpose

This record documents the no-charge monitoring fallback selected after the existing Keene Creditors Trust registry target failed in the runtime monitor. It is an access and detection record, not a new public trust-data finding.

## Controlling official source

The selected controlling source is the **Claims Processing Facility, Inc. (CPF)** Keene payment-percentage announcement:

<https://www.cpf-inc.com/keene-trust-payment-percentage2024>

CPF identifies the page as “Keene Trust Payment Percentage.” The accompanying linked official notice is dated October 28, 2024 and states that the Trustee increased the payment percentage from **0.90% to 1.05%**, effective October 24, 2024:

<https://www.cpf-inc.com/api/files/media/Keene_Trust_Notice_of_Payment_Percentage_Increase_2024%20%284%29.pdf>

The official CPF news index separately lists the Keene payment-percentage item and its July 31, 2024 public-posting date:

<https://www.cpf-inc.com/all-news>

## Access finding

The former registry target, <https://www.cpf-inc.com/trusts/keene-trust>, could not complete the project runtime’s standard HTTPS request because the host’s certificate chain was not accepted. Browser access also encountered a 403/CAPTCHA path. This is an **access constraint**, not evidence that the trust or its data did not change.

The direct controlling notice above is publicly available and independently readable. The project’s standard runtime request successfully retrieved its no-charge reader transport, which returned the matching official title and 1.05% text within the monitor’s eight-second bound.

## Monitoring decision

The registry retains the official CPF notice URL as its `sourceUrl`. For monitoring retrieval only, it uses a reviewed no-charge reader transport to observe the official source when the CPF TLS chain cannot be completed in the runtime. Any observed content change remains a candidate signal only and requires direct official CPF verification before a tracker change or publication. Empty, authentication-blocked, or otherwise unusable transport responses are recorded as access failures rather than successful checks.

## Limit

This targeted source confirms the current documented Keene payment notice. It does not establish that future CPF notices will automatically appear at this historical URL. The weekly source-coverage workflow retains the general official-source review obligation; no unsupported “no change” conclusion may be inferred from a stable notice page.
