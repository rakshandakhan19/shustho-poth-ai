# Data dictionary and provenance

Data types use the project labels **REAL SOURCE DATA**, **SYNTHETIC DATA**, **DEMO DATA**, **SIMULATED FUNCTION**, and **CONTEXT DATA**. No dataset is a clinical validation set unless a row is explicitly described as prototype synthetic evaluation.

| File / data | Type | Source, geography, language, size, year, license | Purpose | What it does not represent |
|---|---|---|---|---|
| `ai.js` `TRAINING_CASES` | SYNTHETIC DATA | Maintained in this repository; Bangladesh-oriented Bangla, Banglish/romanized Bangla and English; 243 examples after this update; no external dataset/license | Train the browser Naive Bayes prototype across 18 narrow labels | Not actual Bangladeshi patient data, representative dialect data, or clinical evidence |
| `evaluation_cases.csv` | SYNTHETIC DATA | Independently authored in this repository; 50 held-out short phrases in Bangla/Banglish/English; no external license | Prototype language/classification evaluation only | Not clinical validation, representative prevalence, safety validation, or deployment evidence |
| `local_language_dataset.csv` | SYNTHETIC DATA | Existing curated prototype data; train/test splits and current model predictions | Legacy evaluation/data inventory; see results for the new independent set | Not actual patient data; legacy test phrases may overlap in style with training |
| `demo_cases.csv` | SYNTHETIC DEMO DATA | Seven example reports plus any original demo rows; Bangla/Banglish/English | Demonstrate user journey | Not patient reports or clinical cases |
| `data/who_bangladesh_health_priorities.json` | REAL SOURCE DATA / CONTEXT DATA | WHO Bangladesh country package supplied as `050_Bangladesh.zip`; 15 indicators, 351 source observations, years vary by indicator (1952–2024 across package); dataset-specific terms in archive state CC BY 4.0 | Display population-level health-priority context; preserve source rows, dimensions, bounds, metadata and row references | Not model training, patient-level inference, diagnosis, individual risk, triage or referral guidance; archive lacks its leading-causes dataset and has source anomalies disclosed in JSON |
| `data/who_bangladesh_health_priorities_summary.js` | DEMO DISPLAY SNAPSHOT / CONTEXT DATA | Generated from the WHO JSON; 15 latest-year indicator snapshots; generated locally | Render context cards from `file://` and provide offline fallback | Not a separate source, live WHO feed, classifier input or patient-level information |
| `data/who_health_priority_mapping.json` | DEMO NARRATIVE / CONTEXT DATA | Authored mapping against the WHO indicator IDs; 18 presentation/access labels | Explain broad, cautious theme links for scenario planning | Not statistical inference, clinical mapping, training input or WHO-endorsed recommendations |
| `facilities_dghs_sample.json` | REAL SOURCE DATA / DEMO SAMPLE | Public DGHS Facility Registry sample; six records; English and Bangla names/locations; retrieval/source notes in file; see source terms | Small facility-type/location reference for patient discussion | Not complete national coverage, live services, staff, hours, stock, beds, suitability, routes, price or availability |
| `facilities_demo.json` | DEMO DATA | Retained six-record copy of the sample facility JSON | Compatibility with prior prototype | Not a separate or larger facility dataset |
| `intents.json` | DEMO DATA / LABEL SCHEMA | Project-maintained descriptions for 18 labels | Define presentation/access label meanings | Not a taxonomy of diseases or diagnostic output |
| `referral_rules.json` | DEMO SAFETY DOCUMENTATION | Project-authored warning boundaries and safe-use rules | Document that app does not diagnose or automate referral | Not a clinical guideline, triage protocol, or operational referral rule engine |
| Browser localStorage keys | SIMULATED FUNCTION / USER-ENTERED LOCAL DATA | Current browser profile on this device; no external storage | Store case notes, record items, follow-ups, support request drafts, temporary sharing demo | Not encrypted, authenticated, backed up, synchronized to a server, or safe for real sensitive patient data |
| SMS, call link, community request, share code, mobile money, payment plan, connection and sync | SIMULATED FUNCTION | Static browser interactions only; no provider integration | Demonstrate consent and access workflows | No SMS/telecom transmission, emergency dispatch, NGO network, access security, real payment, insurer, lending, or remote sync |
| Bangladesh DHS, Global Findex/GSMA, OpenStreetMap, HDX, WorldPop, connectivity products, MASSIVE/FLORES/NLLB/Common Voice/FLEURS/MMS | NOT INCLUDED | No such project dataset is shipped or used in the model | Potential future research only after data, licensing, representativeness and governance review | They are not used to substantiate current prototype behavior or clinical performance |

## WHO source caveats

The supplied package did not contain a separate leading-causes-of-death dataset. No causes or rankings are reconstructed. The source TB file repeats values across years and the wasting file contains duplicate year/sex rows; source values and missing bounds remain intact and are described in the JSON notes. WHO data are context only. WHO does not endorse this application.

## Facility source caveats

Six sample DGHS records are included. A patient must independently verify facility location, services, opening, capacity, and suitability. No distance, waiting time, staffing, or real-time availability is calculated.

## Privacy

The browser stores original reported text and other patient-entered fields if saved. Avoid real names, phone numbers, NID, or real sensitive case information. Shared/lost device users may access `localStorage`. It is not encrypted. Production needs encryption, identity verification/authentication, role-based access, consent/audit logs, revocation, retention policies, and secure deletion.
