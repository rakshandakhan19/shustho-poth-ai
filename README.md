# Shustho Poth AI

## From local words to the next safe step.

**Patient-controlled. Local-language. Offline-first. Safety-aware. Connected to care.**

> Because of Shustho Poth AI, people in low-connectivity communities can describe health concerns in their own Bangla or Banglish and identify a safer next step toward human care, while addressing practical barriers such as cost, transport and connectivity that can otherwise delay care.

Shustho Poth AI is a static patient-facing health-navigation and continuity-of-care prototype for Bangladesh. A person describes what is happening in Bangla, Banglish, or English. A small local model structures the words; separate safety rules surface possible warning signs; the patient can explore access options and save/share a local record with explicit consent.

**It does not diagnose, prescribe, replace a doctor, make autonomous referral decisions, or connect to live emergency, NGO, hospital, payment, or SMS services.** If a situation is severe or life-threatening, call **999** or seek emergency medical care immediately. The app is not an emergency dispatcher.

## Why it matters

The World Bank Small AI for Development Health challenge frames a setting with high patient load, crowded clinics, recordkeeping burden, limited primary care and clinician scarcity. In Bangladesh, distance, cost, connectivity, and digital-literacy constraints can make it harder to reach and continue care. This prototype explores a bounded, inspectable offline tool around that access gap; it does not claim measured impact or clinical effectiveness.

## Patient journey

**TELL → CHECK → ACT → REACH → AFFORD → SHARE → FOLLOW UP**

1. Describe a concern naturally, for example: `amar bacchar shash nite koshto hocche, hospital e jawar taka nai`.
2. Review possible presentation categories, structured fields, what is still unknown, and an uncalibrated model score.
3. Read any separate potential-warning cue. For possible emergency warning signs, seek urgent human care; call 999 if severe or life-threatening. Financial or app steps must not delay care.
4. Decide what next step you want, ask a health professional, and explore sample facility/access information.
5. Optionally prepare a community support request, save/update a patient-controlled record, choose exactly what to share, and set a local follow-up.
6. Continue offline, prepare a privacy-aware SMS draft, or simulate local queue sync. Nothing is transmitted.

## What the AI does

`ai.js` keeps the existing lightweight multinomial Naive Bayes classifier and uses synthetic Bangla/Banglish/English examples for 18 narrow presentation/access labels. Transparent pattern rules separately identify phrase matches, extract a few reported fields, and surface potential warning cues. The class output and score are not diagnoses, calibrated probabilities, or triage. The classifier can be wrong, and absence of a warning cue is not reassurance. Low scores tell the user not to rely on the classification. A human professional makes all clinical decisions.

### Why Small AI, and why SMS?

A fixed SMS form expects a person to know which category or field to choose. Shustho Poth accepts a natural local-language description and locally structures it with an auditable small model plus explicit phrase rules. It avoids open-ended diagnosis and prescription. It is lightweight, local, and can continue without a cloud model.

**SMS is the delivery channel; Small AI is the interpretation layer.** SMS and telecom controls shown here are simulated. No message is sent.

## Safety and urgent help

A separate phrase-based safety layer checks for reports including difficult breathing, seizure, not responding, confusion, heavy bleeding, inability to drink/reduced urination, chest discomfort, sudden weakness/face/speech changes, head injury, and pregnancy-related bleeding/labour warnings. Rules are incomplete and do not assess severity or diagnose. Any possible urgent sign should be assessed by a human; if severe or life-threatening, call 999 or seek emergency care immediately. The official Bangladesh government National Emergency Service is 999 ([Bangladesh Police Telecom](https://telecom-police.portal.gov.bd/pages/static-pages/695e3b0cc4774958d7b72321)). The `tel:999` link depends on the device and is not a live app integration.

## Continuity, sharing, and access

- **My Health Record:** patient-entered diagnoses, medicines, allergies, visits, tests, referrals, and follow-ups can be created/edited/deleted in local browser storage. AI suggestions are not saved unless the patient explicitly confirms; diagnoses require an additional health-professional confirmation.
- **Share:** the patient selects a recipient and fields, explicitly consents, and creates a local demo code expiring after 24 hours. The “recipient view” shows only selected categories. It is a simulation, not authentication or a hospital EMR.
- **Community help:** consent produces a structured support request with optional general location and separately optional relevant health information. It stays on this device; no CHW or NGO network is connected.
- **Facilities:** a small sample of DGHS public registry records supports discussion only. It does not show live staff, services, stock, capacity, opening, distance, route, or availability. Verify locally.
- **Affordability:** BDT 100/month and BDT 1,200/year are illustrative micro-health-protection examples; mobile-money contribution and payment-plan arithmetic are simulated. There is no insurance, payment, credit, provider, eligibility, or assistance guarantee.
- **Follow-up:** local date/status/note can be added, completed, rescheduled, or edited. No reminder is sent.

## Offline and privacy

The app has no required runtime API, backend, database, login, or external AI service. HTML, CSS, JavaScript, classifier phrases, WHO context, and facility data are static/local. Case, health-record, support-request, and share-demo data use browser `localStorage`. The service worker caches static first-party assets on HTTPS after an initial successful load, so a later visit may work offline. `file://` supports the bundled snapshot but does not provide service-worker caching.

**Local browser storage is not encrypted. Do not enter real sensitive patient information.** A person using a shared or lost device/browser profile may see stored data. Hide the record or clear local demo data. Production would need identity verification, secure authentication, encryption, role-based permissions, audit and consent records, revocation, retention controls, secure deletion, and security review.

## Bangladesh localization

Localization is not simply translating an English chatbot into Bangla. Shustho Poth AI is designed around Bangladesh-specific constraints: Bangla and Banglish communication, low-connectivity environments, mobile-money use, affordability and transport barriers, community-based care pathways, Bangladesh facility information and locally relevant health priorities. The prototype uses Bangladesh evidence for context and synthetic local-language data for the Small AI, while keeping clinical decisions with human professionals.

### Data and provenance

- **Context data — WHO Bangladesh:** 15 indicators / 351 source observations from the user-supplied `050_Bangladesh.zip`, preserved in `data/who_bangladesh_health_priorities.json`. Display-only population context; never classifier input, patient risk, diagnosis, or referral logic. The supplied archive lacked the separate leading-causes file; anomalies and absent bounds are disclosed. WHO does not endorse the app.
- **Real source data — DGHS:** `facilities_dghs_sample.json` is a six-record sample from the public Facility Registry; incomplete and not live.
- **Synthetic data — local language:** training and demo phrases are invented examples, not patient records. Held-out evaluation is a prototype language/classification evaluation only.
- **Demo/simulated:** payment, community request, access code, SMS, connection, follow-up reminders, and sync do not reach external systems.
- Bangladesh DHS, Global Findex/GSMA, OpenStreetMap, HDX, WorldPop, and multilingual speech/translation corpora are **not included as model data or app data in this prototype**. They may be considered later for clearly scoped access context or language robustness, subject to source, license, representativeness, and governance review. They are not Bangladesh clinical datasets by virtue of being multilingual/global.

See [`DATA_DICTIONARY.md`](./DATA_DICTIONARY.md) for source, license, purpose, and limitations by file.

## Prototype language/classification evaluation

[`results.json`](./results.json) is generated from the current JavaScript implementation and the independent held-out cases in `evaluation_cases.csv`. It reports classifier and simple keyword-baseline results, phrase-rule red-flag escalation, low-score cases, and sample errors. The cases are synthetic, narrow, and not representative. This is **not clinical validation, a safety evaluation, or evidence of deployment readiness**. Do not infer clinical performance from it.

## Architecture and technology

Static HTML/CSS/JavaScript; local JSON/CSV; browser `localStorage`; local Naive Bayes; explicit rule-based extraction/safety layer; service worker for first-party static asset caching; GitHub Pages/Vercel static hosting. See [`architecture.md`](./architecture.md) and [`responsible_ai.md`](./responsible_ai.md).

### Evidence/context → local-language synthetic phrases → Small AI → separate safety rules → Bangladesh facility/access layer

WHO context data sit underneath this flow as prioritization evidence only, not as a patient-level clinical database.

## Run and deploy

- **Local:** open `index.html` in a modern browser. Core analysis and bundled context work offline. Browser security may limit localStorage or `file://` features in some configurations; use static hosting for the service worker.
- **GitHub Pages:** serve the repository root. The site uses relative paths and needs no build step or backend. Enable Pages for the `main` branch/root in repository Settings → Pages.
- **Vercel:** import the repository as a static site; no framework preset/build command/output directory is required (serve the root files). No backend environment variables are used.

## Limitations

Synthetic classifier data; narrow Bangla/Banglish and incomplete Sylheti, Chittagonian, and other dialect coverage; small synthetic evaluation; no clinical validation; incomplete facility sample; no production security; localStorage not encrypted; no hospital EMR; no live NGO/community network, emergency dispatch, real payment/mobile-money, insurer, or telecom integration; no real-time routing, price, availability, or guaranteed assistance.

## License

Code is published under the MIT License. WHO and DGHS source data retain their source-specific attribution and terms; see the data dictionary and source files. MIT code licensing does not relicense third-party data.
