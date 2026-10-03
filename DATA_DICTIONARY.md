# Data dictionary

All classifier/demo text is synthetic. No supplied dataset is a patient record. The browser can store user-entered case text locally; avoid personal identifiers.

## `local_language_dataset.csv` — synthetic language set

| Field | Description | Source / type | Limits / intended use |
|---|---|---|---|
| `id` | Stable synthetic row ID (`T###`) | Curated demo data | Not a patient identifier |
| `split` | `train` or held-out `test` | Synthetic split | 171 training rows; 71 held-out rows |
| `text` | Bangla/Banglish/English sample phrase | Synthetic | Narrow phrase coverage; not representative |
| `intent` | Expected one of 18 presentation/access labels | Synthetic annotation | Not a disease diagnosis |
| `predicted_intent` | Naive Bayes top class for held-out rows | Computed by current `ai.js` | May be wrong; not clinical performance |
| `correct` | Whether model top class matches expected intent | Computed | Test labels uneven: 7 old classes × 7 cases, 11 added classes × 2 cases |
| `confidence` | Naive Bayes softmax top-class score | Computed, uncalibrated | Not disease probability or calibrated confidence |

## `demo_cases.csv` — synthetic demos

`id` is a synthetic case key; `text` is an example phrase; `expected_intent` is the safety-prioritized/display label; `expected_concerns` lists additional cue labels. Demos exercise the workflow but are not evaluation patients or clinical protocols.

## `data/who_bangladesh_health_priorities.json` — real source data

Extracted from the user-supplied WHO Bangladesh country package on 4 October 2026. The selected 15 indicators contain 351 Bangladesh observations. Every observation includes `year`, original dimension values such as `sex`/`age` where supplied, the source value and any source lower/upper bounds, plus `source_row` to trace back to its packaged CSV. Indicator records include source `indicator_id`, `indicator_codes`, original name, unit, metadata coverage/update date, dataset/metadata/license filenames, and source attribution.

All point estimates and bounds are preserved as supplied without recalculation. Missing bounds stay `null` (69 observations contain no lower or upper bound). The archive lacked its separate leading-causes-of-death data. Some CSVs extend past metadata temporal coverage; TB values repeat; wasting has duplicate year/sex rows. See dataset `notes` and README. Dataset-specific license PDFs in the archive state **CC BY 4.0**. Source: World Health Organization, Bangladesh indicator datasets, `050_Bangladesh.zip` supplied 4 October 2026. Use: population context only, never classifier training, individual risk, diagnosis, or referral.

## `data/who_bangladesh_health_priorities_summary.js` — offline display snapshot

Generated from the full WHO JSON. It contains the latest-year rows and observation count for each selected indicator so context cards can render when the page is opened directly from disk (`file://`). On GitHub Pages the app attempts to load the full local JSON. This summary is display-only and not classifier input.

## `data/who_health_priority_mapping.json` — narrative mapping

`indicator_id` joins the local WHO JSON; `priority` names the population topic; `prototype_intent` lists a broad presentation label only where an illustrative thematic link is useful; `relationship` is context-only/service-context-only; `reason` explains the boundary. The mapping is not loaded by the classifier. WHO mortality/TB/malaria data are not patient-level labels.

## `facilities_dghs_sample.json` — real registry sample

The top-level `source`, `source_url`, `retrieved`, `records`, and limitation note describe the sample. Each `records[]` item includes facility ID, English/Bangla names, type, agency, division, district, upazila, and private/status fields where supplied. Six sample records only. They do not confirm service availability, capacity, distance, or referral suitability. Source: public DGHS Facility Registry. Intended use: worker reference after local verification.

## `facilities_demo.json` — retained sample copy

This is currently an exact six-record copy of `facilities_dghs_sample.json` (facility IDs and attributes match). It is retained for compatibility; the UI loads `facilities_dghs_sample.json`. Both remain a small non-live DGHS public-registry sample, not model training data.

## Browser case record — localStorage

Key `shustho_poth_cases` stores up to 100 local records; `shustho_poth_last_case` stores the latest draft. Each record may contain `id`, original `text`, analysis labels/model score/fields/red flags, worker-editable `patient` fields, `worker_decision`, `facility_id`, selected `barriers`, illustrative `support_pathways`, optional `payment_demo`/`payment_plan`, `follow_up`, creation/update timestamps, and local/simulated status. It contains no required name/phone/NID. Browser localStorage is not encrypted and may be visible to anyone using that browser profile. “Clear local case data” removes both keys.

## Finance / access / communication examples — demo or simulated

BDT 100 monthly and BDT 1,200 yearly protection examples, bKash contribution simulation, plan calculator inputs/results, and support routes are illustrative; no provider, product, eligibility, payment, loan, or financial advice is supplied. Copyable SMS text, offline queue, restored-connection state, and sync completion are simulated; no message or record is transmitted. Follow-up dates are local notes without notifications.

## `results.json` — synthetic evaluation

Training/test counts, current model top-class predictions, per-class precision/recall/F1, errors, and test-coverage note. Current Naive Bayes top class: 57/71 (80.3%) accuracy; macro-F1 62.0%. Cue-prioritized display output is reported separately and must not be mistaken for generalization. Not clinical validation.
