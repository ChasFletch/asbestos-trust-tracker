# Historical Source Recovery Dashboard — Verification Record

**Route:** `/source-recovery`  
**Verification date:** 2026-09-07  
**Scope:** Public recovery-status dashboard

## Visual Review

Desktop and 390-pixel mobile renders were reviewed after the dashboard implementation. The page displayed the public research-progress explanation, three disclosure principles, status summary, filters, eight ranked recovery cards, source-access badges, monitored-source links, trust-record links, and closing methodology/provenance/corrections paths. The layout preserved the existing public provenance visual language and stacked the card content for the narrow viewport.

The visible language distinguishes source reachability, access attention, and pending post-registration checks from recovery of an underlying filing or a change in any trust fact. No source status is presented as a current payment, asset, claim, status, or legal conclusion.

## Remaining Technical Verification

The dashboard’s focused regression, TypeScript check, and production build passed before visual review. The final pre-publication pass will additionally confirm the new route’s raw server-rendered body, canonical metadata, JSON-LD, sitemap entry, and production response after deployment.

## Source-Age and Scheduled-Check Metadata

The desktop and 390-pixel mobile renders were rechecked after adding the new monitoring fields. Each recovery card now receives server-derived **Source access age** and **Next scheduled check** values. The scheduled time is rendered in America/Chicago and follows the actual daily or Sunday weekly monitoring slot rather than an arbitrary 24-hour or seven-day offset. The mobile layout retains the established single-column card flow without clipping the page header, status summary, evidence notes, or metadata labels.
