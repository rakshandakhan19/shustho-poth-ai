# Shustho Poth AI

## From local words to the next safe step.

> Identifying a health concern is only the first step. A patient still needs to reach, afford, and complete care.

Shustho Poth AI is an offline-first, static Bangla/Banglish case-structuring and access-to-care prototype for frontline health workers in Bangladesh. It demonstrates one narrow part of Noor’s care journey: structure what a patient reports, surface selected warning phrases and missing fields, and help the worker record a decision and practical barriers.

**It is not a doctor, diagnosis system, prescribing tool, insurance product, lender, payment provider, or replacement for a health worker. The health worker makes the final decision.**

## Problem

Frontline workers may have limited time, incomplete records, unreliable connectivity, long travel routes, and few on-site diagnostics. A referral alone does not ensure a patient can reach and complete care. This prototype joins documentation support to a worker-led review of affordability, transport, connectivity, navigation, and continuity barriers.

## Noor scenario

Noor can describe a concern in her own Bangla or Banglish words. The worker records her report, confirms suggested details, reviews possible warning signs, decides the next step, and asks whether she can reach and return from care. Offline notes and a compact SMS-ready draft can support a later worker-led follow-up. No diagnosis, automated referral, real message, payment, or sync takes place.

## Solution and care pathway

**UNDERSTAND → ASSESS → DECIDE → REACH → AFFORD → FOLLOW UP**

1. Enter a conversation in Bangla, Banglish, or simple English, or load a clearly synthetic demo.
2. A small local Naive Bayes model and explicit phrase checks suggest one primary presentation plus any directly matched concerns.
3. Review a potential-warning section, model score, uncertainty, and fields still to ask. A missing warning phrase does not mean a person is safe.
4. Edit the structured record and record a health-worker decision. The model does not choose it.
5. Record access barriers, select a sample facility for discussion, and verify the service locally.
6. Explore illustrative cost, transport, support, or micro-protection pathways without assuming eligibility.
7. Save a case and follow-up in the browser, prepare a privacy-aware message, and simulate queue sync without transmitting data.

## Why Small AI

The Naive Bayes classifier and phrase rules run locally in the browser. They are lightweight, respond without an AI server, and do not send case text to a cloud AI service. The training phrases, labels, and safety rules can be inspected. A small classifier can still be wrong: its score is uncalibrated, language coverage is narrow, and rules can miss or misread a report. The model supports documentation; the worker supplies clinical judgment and local guidance.

## Clinical screening support

The current prototype has 18 presentation/access labels: fever, breathing difficulty, cough/respiratory concern, diarrhoea/vomiting, possible dehydration concern, seizure, pain, injury/trauma, possible neurological warning words, pregnancy/maternal concern, skin concern, chest discomfort, diabetes/glucose concern, blood-pressure concern, financial barrier, connectivity, travel barrier, and routine follow-up.

These are reports or presentation categories, not disease diagnoses. Direct phrase rules surface a short set of possible warning signs (for example, reported breathing difficulty or sudden one-sided weakness/speech change) for prompt worker review under local protocol. They do not diagnose, grade severity, or make a referral. Financial support must not delay clinical assessment. See [`referral_rules.json`](./referral_rules.json) and [`responsible_ai.md`](./responsible_ai.md).

## Documentation support

The worker can review/edit reported category text, age, sex where relevant, symptom duration, measured temperature, measured respiratory rate, drinking, urination, and pregnancy-related context. Missing fields are prompts to ask or confirm, not an order to delay care. No patient name, phone, or national identifier is required. Saved records include the original wording entered, the worker’s decision, access selections, optional facility, illustrative finance events, follow-up, and status; keep identifiers out of demo input.

## Red flags and uncertainty

The browser checks explicit reported wording for selected possible warning signs. Every warning says to confirm the report and follow local protocol. Detection is not exhaustive; a message with no warning may still be urgent. The Naive Bayes softmax score is **uncalibrated** and is not a disease probability. If the model top class differs from a directly matched presentation, both are visible for review.

## Human in the loop

Only the worker selects “Refer”, “Follow up”, “Need more information”, or “Manage per local protocol”. These controls record the worker’s choice; they do not trigger clinical management, contact a facility, or send a referral. `referral_rules.json` is a documented safety guardrail, not a clinical protocol engine.

## Referral and facility navigation

`facilities_dghs_sample.json` is a six-record public-registry sample. The app can filter the sample by district and attach a selected record to the case. It does not recommend a facility, calculate distance, or confirm opening hours, service availability, beds, capacity, or emergency readiness. Verify a facility locally before referral. `facilities_demo.json` is a retained illustrative copy of the same small sample for compatibility.

## Access to care

Workers can record whether a patient reports financial cost, transport cost, distance, unavailable transport, connectivity, shared-phone, return/follow-up, or navigation barriers. Four questions—can they reach, afford, connect to, and return for care?—are shown together. Answers are worker-entered; the app does not infer socioeconomic status or insurance coverage.

## Financial barriers and support

The prototype can record a reported cost barrier and discuss locally verified community/NGO, subsidized-care, or transport options. It claims no partnership or funding. Availability, cost, and eligibility must be checked locally. These options are not financial advice.

## Micro-health protection

“Illustrative micro-health protection” is a concept only. The BDT 100/month and BDT 1,200/year example is not an insurance policy, a provider, a quote, or a coverage promise. Terms, eligibility, claims, exclusions, pricing, licensing, and regulation are undetermined and would require a licensed provider and relevant authorities.

## Mobile money and payment plans

The BDT 100 bKash/mobile-money button records a **simulated** event locally; it does not contact bKash, transfer funds, or request PIN/OTP/credentials. The payment-plan calculator performs simple division for an illustrative discussion. It is not credit, a loan, or advice.

## Transport barriers

Travel distance, unavailable transport, and fare cost are recorded separately so a worker can discuss local routes and verify support. No ambulance, vehicle, subsidy, or transport partner is provided.

## Offline operation, queue, and SMS/2G

After static files have loaded, analysis, form editing, facility demo data, finance illustrations, follow-up, and local queue work do not require an external AI/API service. GitHub Pages uses HTTPS and can install [`service-worker.js`](./service-worker.js) to cache the static app for later offline visits after its first successful load. `file://` does not support service workers and some browsers block JSON reads; the core classifier has no dependency on these data fetches.

Saved records use browser `localStorage`. The connection/sync controls only update local simulation status; **no data is transmitted**. The SMS-ready note contains a case ID, worker-review label, concern, optional facility, and follow-up. Financial details are excluded by default. Copying prepares text only; no SMS/2G/RapidSMS/mTrac gateway is connected, and sending is left to the worker.

## Follow-up

The worker can record a 24-hour, 3-day, 7-day, or custom local follow-up. This is a saved date, not a reminder; the prototype sends no notifications.

## Bangladesh health evidence and WHO sources

The UI bundles a compact latest-year snapshot at `data/who_bangladesh_health_priorities_summary.js`, so the WHO population-context cards also appear when opened directly from disk (`file://`). On GitHub Pages it attempts to load the full local JSON; the compact snapshot remains the offline fallback. These first-party static files are display-only and are not classifier input.

[`data/who_bangladesh_health_priorities.json`](./data/who_bangladesh_health_priorities.json) preserves **351 Bangladesh observations across 15 WHO indicators** from the user-supplied `050_Bangladesh.zip`. Topics include TB, malaria, road-traffic mortality, maternal, under-five and neonatal outcomes, NCD mortality risk, hypertension, stunting, wasting, air pollution, unsafe WASH, and physician, nursing/midwifery, and pharmaceutical-personnel density. Metadata, source filenames, indicator codes, source row numbers, years, values, units, and supplied uncertainty bounds are retained. `null` lower/upper bounds are preserved when absent; there are 69 observations without either bound.

The source package did not include a separate leading-causes-of-death dataset, so leading-cause names or values are not reproduced. WHO’s [Bangladesh country overview](https://data.who.int/countries/050) cautions that death-registration data are unavailable or unusable for cause-of-death analysis in Bangladesh and that modeled cause estimates should be interpreted cautiously; it describes them as useful for priority-setting, not policy evaluation or cross-country comparison. The ZIP’s TB file repeats 221 with bounds 161–291 for every included year from 2000–2023, despite conflicting metadata temporal coverage. The wasting file has repeated year/sex rows without sufficient dimensions to select a single estimate. These source anomalies remain visible; no estimates are “corrected” or silently deduplicated.

[`data/who_health_priority_mapping.json`](./data/who_health_priority_mapping.json) explains possible links to presentation topics. This is narrative service-planning context only. WHO observations are **not** classifier training, patient-level inference, or referral rules. Dataset-specific license PDFs in the supplied archive state CC BY 4.0; paths are included in the JSON. Attribution: World Health Organization (WHO), Bangladesh indicator datasets, package supplied 4 October 2026. WHO does not endorse this application; no WHO logo is used.

## Privacy

Cases are stored in browser `localStorage` on the device. Anyone with access to the device/browser profile may be able to read them; this prototype does not encrypt localStorage. A shared or lost phone creates risk. A clear-data control is provided. Avoid personal identifiers and detailed financial information. Production deployment would need encryption, authentication, session controls, access management, secure deletion, and a reviewed data-retention policy.

## Responsible AI and limitations

- Synthetic text examples are not real patient records and do not represent Bangladesh’s languages, dialects, ages, literacy, or clinical settings.
- The classifier, cue rules, and demonstration have not undergone prospective clinical validation.
- The held-out set is small and uneven. New labels have only two held-out examples each; metrics are not evidence of generalization or safety.
- Red-flag phrase checks can miss, over-match, or misunderstand. No match must not reassure.
- Facilities are a small sample without live service/capacity checks.
- Support, micro-protection, payment, SMS, connection, and sync functions are illustrative or simulated.
- Deployment needs clinical oversight and Bangladesh regulatory, privacy, security, language, and implementation review.

## Data architecture

| Data | Type | Role |
|---|---|---|
| WHO Bangladesh indicators | Real source data | Population-level priority context only |
| DGHS registry sample | Real source data, limited sample | Reference records; verify locally |
| `local_language_dataset.csv` and `TRAINING_CASES` in `ai.js` | Synthetic | Prototype language training and held-out examples |
| `demo_cases.csv` | Synthetic | Clickable scenario reference; not patient data |
| BDT contributions/plans and support pathways | Illustrative demo data | No real product, advice, partner, or transaction |
| Local save, SMS, and sync | Simulated/static | Device-only demonstration; no transmission |

## Running locally

Open `index.html` directly for the core workflow, or serve the repository root over HTTP for the local JSON display and service-worker behavior:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000/`. Core classification does not rely on a server.

## GitHub Pages

The repository is a plain static site. In GitHub, select **Settings → Pages → Deploy from a branch**, choose `main` and `/ (root)`. All local asset and data paths are relative (for example `./ai.js` and `./data/...`), so they resolve under `/shustho-poth-ai/`. The service worker is registered only over HTTPS. No build step or runtime API key is needed.

## Demo scenarios

Seven synthetic scenarios in the screen are also recorded in [`demo_cases.csv`](./demo_cases.csv): breathing plus cost, financial barrier, no internet, travel/fare, sudden weakness plus cost, diarrhoea plus hydration concern, and routine follow-up. Expected labels describe the reviewed prototype output, not a diagnosis.

## Evaluation snapshot

The current Naive Bayes top class scored **57/71 (80.3%) accuracy and 62.0% macro-F1** on the retained synthetic held-out split. It made 14 top-class errors; one original connectivity example remains misclassified as financial barrier. A separate phrase-overlay category matched all 71 curated test labels, but the set is very small and cue-rich, so that result is not a generalization estimate. See [`results.json`](./results.json) for per-label counts and errors. These numbers are synthetic software checks, never clinical performance claims.
