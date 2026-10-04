# Shustho Poth AI

## One-sentence problem statement

Shustho Poth AI helps a patient or caregiver move from describing a health concern in local words to considering a safe, human-guided next step toward care.

## Who it is for

Patients and caregivers in low-connectivity settings in Bangladesh. The prototype accepts Bangla, Banglish, English, and mixed short text. It is not a clinical tool for autonomous health-worker decisions.

## The problem

There can be a gap between “Something is wrong” and “I can reach appropriate care.” Language, uncertainty, cost, transport, connectivity, and continuity can make that gap harder to cross.

## What the Small AI does

A lightweight Naive Bayes classifier in `ai.js` organizes short text into a limited set of presentation and access categories. Separate explicit phrase rules surface possible warning signs; bounded negation handling suppresses some nearby negated symptom phrases. The app shows a qualitative model signal, not raw probabilities. It does not diagnose, prescribe, or decide whether or where someone should be referred.

## Voice interaction

Patients can optionally describe a concern by voice. In supported browsers, speech is converted to text and then passed through the same local-language Small AI pipeline used for typed messages. The patient sees and can correct the transcript before choosing **Use this message**. Speech recognition is an input interface; the existing local Naive Bayes classifier and safety rules remain the interpretation and safety layers.

Voice is an additional accessibility/input channel. The core intent classification and safety workflow remains text-based and locally executable. Browser speech recognition support varies by device/browser and may require connectivity. The prototype therefore does not depend on voice recognition for its core offline functionality. Bangla is configured with `bn-BD`; English uses `en-US`. Banglish/mixed input uses the Bangla setting and may be transcribed inconsistently. Voice input is currently an interface prototype; speech-recognition accuracy has not yet been independently benchmarked. Voice browser compatibility could not be fully automated in the available environment.

The page does not save audio recordings. The browser/device speech service may process audio and may require connectivity. Avoid real sensitive health information. The main screen explicitly offers **Type** and **Speak**; a transcript must be reviewed and can be edited before it reaches the existing analysis flow. Bangla/Banglish support is being evaluated across different spellings and ways of describing symptoms; coverage is not comprehensive.

Future speech evaluation should separately measure Bangla and Banglish/code-switching accuracy, dialect and noise robustness, child/older-speaker speech, health vocabulary, and negation preservation. Mozilla Common Voice, FLEURS, and MMS are possible future references, not current model data.

## Why AI instead of SMS/spreadsheet/search

SMS can transmit a message. A spreadsheet can store a case. Search can retrieve information. The small local model interprets short Bangla/Banglish descriptions into limited concern and access labels. It runs on-device, while explicit safety rules and human judgment remain separate. In this prototype, SMS is only prepared locally and never sent.

## Offline-first architecture

Static HTML, CSS, JavaScript, and bundled JSON run in the browser with no backend, database, login, or external AI API. Case text is processed locally. Browser `localStorage` holds optional case/record data. On GitHub Pages HTTPS, the service worker caches first-party resources after the initial successful load. Direct `file://` use does not provide service-worker caching; bundled JS snapshots keep core demo content available.

## Safety and human oversight

Potential warning signs lead to urgent human-care guidance before access or affordability options. “Call 999” is a device dial link only; no dispatch service is connected. Not detecting a warning phrase does not mean a person is safe. A patient and qualified health professional remain the decision-makers. This is not diagnosis, prescribing, clinical triage, or autonomous referral.

## Bangladesh localization

Bangla/Banglish examples are locally oriented but synthetic. A bundled National Portal location list supports optional division → district → upazila selection without GPS. A static DGHS snapshot contains 20,509 selected active public care-facility records across 8 divisions and all 64 named districts; it is not live and does not report facility availability. WHO Bangladesh indicators provide separate population context only.

## Data sources

- Bangladesh National Portal administrative geography: 8 divisions, 64 districts, 499 upazila entries as listed on the downloaded portal page. Names are kept in Bangla; confirm district membership against current BBS geocodes before production use.
- DGHS Facility Registry public table: 20,509 active public records in selected facility types, retrieved 2026-10-04; no live lookup. Redistribution terms were not identified in the registry interface and require review before production use.
- WHO Bangladesh country indicator package provided with the project: 15 indicators / 351 source observations; contextual display only. Package omissions and anomalies are documented in the data dictionary and source JSON.

## Data used to train/evaluate the model

Training phrases are synthetic and embedded in `ai.js`. `data/ai/local_language_dataset.csv` is a project phrase inventory; it is not evidence of actual patient records. `data/ai/independent_test_set.csv` mirrors the 100 synthetic cases in `evaluation_cases.json`. A separate 150-case synthetic language set in `evaluation_cases_independent.json` is not training data and is evaluated by `run_independent_evaluation.py` against production `ai.js`; its output is `evaluation_results_independent.json`. Neither WHO nor geography/facility data enter the classifier.

## Contextual evidence datasets

WHO Bangladesh is the only contextual evidence dataset bundled. The Bangladesh Service Delivery Indicators, Global Findex, and GSMA files are marked `NOT_LOADED` because verified country-specific values and/or reuse terms were not included. MASSIVE is documented as an external NLP reference only; no benchmark records are bundled or used.

## Care facility data

`data/health_access/bangladesh_health_facilities.json` contains 20,509 active public DGHS Facility Registry records in selected care-facility types, marked `REAL_SOURCE`, across all 8 divisions and 64 named districts. Unavailable address/coordinates/union/source year remain null. “Care options in your selected area” tries upazila, then district, then division; the selector uses Bangla geography while registry locality labels are English, so exact district/upazila matching is limited and this limitation is displayed. Fallback never silently selects Dhaka. The interface limits visible cards for performance. It never estimates distance or calls a record “nearest.” This snapshot does not report hours, capacity, staffing, stock, current services, or emergency suitability. The registry interface did not expose a reuse license; confirm redistribution terms before production use.

## Evaluation

Current stored evaluation (`results.json`; not overwritten in this work):

- Intent accuracy: **70.0% (63/90 categorized cases)**
- Keyword baseline: **62.2% (56/90)**
- Warning phrase escalation: **31/31 labeled warning cases**
- False warning escalation: **0/69 other cases**
- Negation suppression: **6/6**
- Uncertainty signal: **67/100 cases**
- **33 automated language/safety assertions** passed in the previously recorded run

Prototype evaluation only — not clinical validation. The metrics describe a small synthetic set and phrase-rule coverage, not real-world sensitivity or clinical performance.

The newly run separate evaluation is in `evaluation_results_independent.json` (150 synthetic sentence-level cases). It executes the current production JavaScript analysis and safety rules; it does not alter the existing `results.json`. Read every metric with the case labels and limitations in that report. The result is prototype evaluation only, not clinical validation.

Recorded new-set results: intent accuracy 78.0% (117/150); emergency recall 71.9% (41/57); false escalation 0/93; negation accuracy 10/10; Bangla 76.9% (50/65), Banglish 80.0% (28/35), mixed 75.0% (24/32); unknown-case recall 95.0% (19/20). These are synthetic prototype metrics; in particular, the measured emergency recall is not a safety guarantee.

The normalization layer canonicalizes a short list of Romanized spelling variants (`sas/shas`, `kosto/kosht`, `bacha`, `hoise/hoyeche`, `nei`, `hospitaal`) only in matching text. The patient's original message remains as entered. This does not establish broad dialect or language coverage.

## Limitations

Synthetic/local-language training data; limited Bangla/Banglish spelling and dialect coverage; possible dialect bias and negation edge cases; selected static facility snapshot with incomplete exact Bangla locality matching and no live availability; DGHS redistribution terms need confirmation; no live emergency dispatch; no real NGO/CHW network, financial transaction, or insurance product; browser localStorage without production encryption/authentication; no clinical validation. Browser-based end-to-end testing could not be completed in the available environment. Mobile/browser testing limitations remain.

## Future work

- Larger independently authored Bangladesh test set and clinician review of safety cases.
- Validate the complete administrative hierarchy against current BBS geocodes.
- Validate and expand Bangladesh facility data with source dates and reuse terms.
- Improve community-reviewed Bangla/Banglish and regional-language coverage.
- Independently evaluate Bangla/Banglish speech recognition and consider SMS deployment; build secure production health-record infrastructure.
- Establish verified community-health and regulated financial/insurance partnerships before claiming them.

See [DATA_DICTIONARY.md](./DATA_DICTIONARY.md), [architecture.md](./architecture.md), and [responsible_ai.md](./responsible_ai.md). No WHO endorsement is claimed.

