# Architecture

```text
PATIENT / HOUSEHOLD
  ↓
Bangla · Banglish · English · simulated SMS text
  ↓
LOCAL SMALL AI (ai.js)
  ├─ Naive Bayes: one of 18 presentation/access labels + uncalibrated score
  ├─ transparent phrase cues and limited field extraction
  └─ synthetic local-language training examples
  ↓
SEPARATE SAFETY GATE
  ├─ explicit warning phrases: breathing, seizure, consciousness, bleeding,
  │  fluids/urination, chest, neuro, head injury, pregnancy warning words
  └─ urgent human care / call 999 if severe or life-threatening
  ↓
PATIENT NEXT STEP (AI never decides)
  ↓
CARE NAVIGATION: static DGHS sample + prepare local note
  ↓
ACCESS TO CARE: cost · transport · distance · connectivity · continuity
  ↓
PATIENT-CONSENTED COMMUNITY SUPPORT DRAFT (demo network only)
  ↓
ILLUSTRATIVE HEALTH-PROTECTION / MOBILE-MONEY / PAYMENT-PLAN DEMOS
  ↓
PATIENT-CONTROLLED HEALTH RECORD (localStorage)
  ↓
SELECTED-FIELD SHARING + 24-HOUR DEMO ACCESS CODE (local only)
  ↓
OFFLINE QUEUE / SMS DRAFT / SIMULATED SYNC
  ↓
FOLLOW-UP NOTE / STATUS (local only)

EVIDENCE UNDERNEATH, NOT IN THE CLASSIFIER:
WHO Bangladesh context + DGHS facility sample
```

## Components and trust boundaries

- **`index.html`:** patient-facing responsive interface, local forms, labels, consent controls and safety messages.
- **`ai.js`:** the existing lightweight Naive Bayes classifier plus phrase detection, field extraction, missing-information hints and a separate red-flag rule layer. All input text is processed locally. No LLM/API is called.
- **`app.js`:** display/workflow handlers, localStorage case queue, patient record and follow-up CRUD, explicit consented demo requests/sharing, facility reference, SMS/payment/sync simulations, static data loading.
- **JSON/CSV:** synthetic labels/examples, referral safety boundaries, sample facilities, WHO context. WHO is never patient input or model data.
- **`service-worker.js`:** caches same-origin static assets on HTTPS. First successful page load needs connectivity; service workers are not available on `file://`.
- **Browser storage:** `localStorage` is local but unencrypted and accessible to users of the same browser profile. The share code is not authentication. No network transmission occurs.
- **Static hosting:** relative paths support a repository project site such as `/shustho-poth-ai/` and Vercel static root, without a backend or build step.

## Operational limits

No live hospital, emergency dispatch, NGO, CHW, telecom, SMS, payment, insurance, database, authentication, or synchronization integration. Facility records and WHO context are static. The UI makes no clinical decision and no route, distance, live status, or guaranteed outcome calculation.
