# Data dictionary and provenance

All source/value claims are bounded to the files actually shipped. `REAL_SOURCE` means values or records are preserved from the named source, not that the set is comprehensive, current, or clinically validated. `SYNTHETIC`, `DEMO`, `SIMULATED`, `CONTEXT`, and `BENCHMARK` describe separate roles.

| Dataset / file | Role and status | Source / geography / year / language / size | License | Train? | Eval? | UI? | Context only? | Limitations |
|---|---|---|---|---:|---:|---:|---:|---|
| `ai.js` `TRAINING_CASES` | Model phrase examples — `SYNTHETIC` | Project-maintained; Bangladesh-oriented Bangla, Banglish/romanized Bangla, English; 243 examples across 18 labels; no source year | Project code license; examples authored in project | Yes | No | No | No | Synthetic and narrow, not patient records or representative dialect coverage |
| `data/ai/local_language_dataset.csv` | Phrase inventory — `SYNTHETIC` | Project-maintained CSV; local-language examples and legacy split/prediction fields; see file | Project-authored | No direct runtime load; classifier phrases are in `ai.js` | No | No | No | Not the runtime model source; may contain historical evaluation fields |
| `evaluation_cases.json` | Current independent test set — `SYNTHETIC` | Project-authored; 100 cases, Bangladesh-oriented mixed language; 2026 | Project-authored | No | Yes | Evaluation panel links it | Prototype evaluation only | Small and synthetic; text independence does not establish representativeness |
| `data/ai/independent_test_set.csv` | CSV mirror — `SYNTHETIC` | Same 100 cases as `evaluation_cases.json`; Bangla/Banglish/English/mixed; 2026 | Project-authored | No | Yes | No | Prototype evaluation only | Derived copy; JSON remains evaluator input |
| `evaluation_cases.csv` | Legacy test set — `SYNTHETIC` | Earlier 50-case project set; mixed local-language text | Project-authored | No | Legacy only | No | No | Not the current 100-case evaluation |
| `results.json` | Evaluation output — `SIMULATED/EVALUATION` | Existing recorded 100-case results; 2026 | Project-authored | No | Yes | Linked/displayed summary | No | Preserved in this localization task; classifier evaluation was not rerun |
| `tests/run-tests.cjs`, `tests/evaluate.cjs` | Test/evaluation code | Node built-ins and project files | MIT code | No | Yes | No | No | Assertions do not establish safety or clinical validity |
| `data/geography/bangladesh_locations.json` | Location selector — `REAL_SOURCE` | Bangladesh National Portal upazila list downloaded 2026-10-04; 8 divisions, 64 district rows, 499 upazila entries; source language Bangla | Portal page terms not separately specified in the source snapshot | No | No | Yes | No | Portal reports 499; verify names and hierarchy against current BBS geocodes before production |
| `data/geography/bangladesh_locations.js` | Local loading snapshot — generated from `bangladesh_locations.json` | Same source/size/content | Same source terms | No | No | Yes | No | Runtime convenience; not an independent dataset |
| `data/health_access/bangladesh_health_facilities.json` | Facility directory sample — `REAL_SOURCE` | DGHS Public Facility Registry; Bangladesh; six records; retrieved 2026-10-04; English and Bangla names | Source terms require review before redistribution/deployment | No | No | Yes | No | Partial sample, no live state; some fields are null; location spelling/membership needs validation |
| `facilities_dghs_sample.json`, `facilities_demo.json` | Legacy compatibility copies — source sample / `DEMO` | Six prior prototype records | Source terms as above | No | No | No runtime dependency in hosted mode | No | Retained for compatibility; normalized file is the application path |
| `data/health_access/service_delivery_indicators.json` | Access evidence — `NOT_LOADED` | World Bank SDI country report/data source; no Bangladesh values bundled | Not applicable until sourced | No | No | Status disclosure only | Planned | Bangladesh-specific values were not located in the selected source; no substitute country is used |
| `data/context/who_bangladesh_health_priorities.json` | Health-priority evidence — `REAL_SOURCE`, `CONTEXT` | WHO Bangladesh package supplied as `050_Bangladesh.zip`; 15 indicators, 351 observations; years vary (1952–2024); English metadata | Supplied dataset terms state CC BY 4.0; verify individual source terms | No | No | Yes | Yes | Population-level context only; supplied package lacks separate leading-causes dataset and notes source anomalies |
| `data/context/who_bangladesh_health_priorities_summary.js` | Generated UI snapshot — `CONTEXT` | 15 locally derived latest-year indicator summaries from WHO JSON | Inherits underlying data terms | No | No | Yes | Yes | Not a separate source or live feed |
| `data/context/who_health_priority_mapping.json` | Authored narrative mapping — `DEMO`, `CONTEXT` | Project mapping of broad labels to WHO indicator IDs; 18 labels | Project-authored | No | No | Download/reference | Yes | Not a statistical or clinical mapping; not WHO-endorsed |
| `data/context/global_findex_bangladesh.json` | Financial-access evidence — `NOT_LOADED` | World Bank Global Findex reference; no values/year bundled | Not applicable until sourced | No | No | Status/documentation only | Planned | Do not infer affordability or insurance coverage |
| `data/context/gsma_mobile_gender_gap_bangladesh.json` | Connectivity/gender evidence — `NOT_LOADED` | GSMA Mobile Gender Gap reference; no values/year bundled | Not applicable until sourced | No | No | Status/documentation only | Planned | Verify country coverage, metric year, and reuse rights before adding values |
| `data/benchmarks/massive_reference.json` | External NLP benchmark reference — `BENCHMARK`, reference only | Amazon Science MASSIVE; multilingual intent benchmark; no records bundled | See upstream terms | No | No | Documentation | No | Not Bangladesh clinical data; no label mapping or model use |
| `intents.json`, `referral_rules.json` | Label descriptions and safety boundary — `DEMO` | Project-authored | MIT code | No | No | App/docs | No | Not a clinical taxonomy or guideline |
| Browser `localStorage` | User-entered case/record data — `SIMULATED` | Current browser profile/device; size varies | User data | No | No | Local UI | No | Not encrypted/authenticated/synced; shared/lost-device risk |
| SMS, community request, payment, sync, access-code actions | Workflow simulation — `SIMULATED` | Static browser only | Not applicable | No | No | Yes | No | Nothing is sent; no actual service, payment, or partnership |

## WHO source caveats

The supplied WHO package contains 15 indicators and 351 source observations. It did not contain the separate leading-causes dataset. Values, dimensions, bounds, metadata, and row references are preserved; years and bounds differ, and package notes identify repeated TB values and duplicate year/sex wasting rows. WHO is context only and does not endorse the application. No WHO logo is used.

## Geography caveats

The Bangladesh National Portal page identifies 8 divisions, 64 districts, and 499 upazilas. This snapshot preserves the portal's Bangla names and row hierarchy. The official page and its crawl have shown changing counts/content; the hierarchy must be checked against current BBS geocodes before operational use. The location list does not show where a facility exists.

## Facility source caveats

Six public DGHS registry records are bundled. A person must independently verify the facility's location, services, hours, capacity, and suitability. No distance, waiting time, staffing, stock, real-time availability, referral acceptance, or emergency capability is calculated.

## Privacy

Avoid entering real names, phone numbers, NID, or sensitive patient details. Case and health-record data are stored in browser `localStorage`, which is not encrypted. Anyone with access to a shared/lost device profile may read them. Production needs encryption, authentication, access controls, consent/audit records, revocation, retention policies, and secure deletion.

## Voice and speech

The optional voice-input interface uses the browser's `SpeechRecognition` or `webkitSpeechRecognition` capability when available. The current prototype does not train or bundle a speech-recognition model. It uses browser speech recognition only to produce a transcript; after the patient reviews and can edit it, the text is passed into the existing local-language intent classifier, negation handling, and warning rules. Bangla is the intended local language and the recognition locale is configured as `bn-BD`; English can be selected as `en-US`. Banglish/mixed speech is limited and browser recognition may interpret Romanized Bangla inconsistently.

Speech quality may vary by browser, device, accent, dialect, noise, age, code-switching, language setting, and connectivity. An incorrect transcript can produce an incorrect interpretation. The page does not store audio, but the browser/device speech service may process it and may require connectivity. Text-based classification and safety remain usable offline. The user must review the transcript before use; microphone/browser recognition itself has not been automated or quantitatively benchmarked.

These datasets are identified as potential future sources for evaluating or improving local-language speech recognition; they are not currently part of the trained prototype. The references are Mozilla Common Voice, FLEURS, and MMS. They are external references only: no recordings, transcripts, or benchmark results from these datasets are included or used.
