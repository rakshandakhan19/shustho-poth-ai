# Architecture

```text
NOOR / PATIENT
  ↓ Bangla / Banglish conversation (entered by worker; minimal identifiers)
LOCAL SMALL AI — Naive Bayes text model (static ai.js; 18 narrow labels)
  ├─ top class + uncalibrated relative score
  ├─ explicit phrase cues → possible presentation/access topics
  └─ transparent field extraction → missing-information prompts
  ↓
POTENTIAL WARNING PHRASES + UNCERTAINTY (not a triage protocol)
  ↓
HUMAN HEALTH WORKER REVIEW → final human decision
  ↓
REFERRAL OR FOLLOW-UP RECORD (choice recorded; no autonomous action)
  ↓
ACCESS TO CARE: can reach? afford? connect? return?
  ├─ facility: small DGHS sample, worker selects and verifies
  ├─ finance: illustrative support/protection/payment arithmetic only
  └─ travel: worker records transport/distance barriers
  ↓
LOCAL CASE STORAGE / OFFLINE QUEUE (browser localStorage)
  ├─ SMS-ready text (prepared/copied only, no gateway)
  ├─ follow-up date (no reminder service)
  └─ sync simulation (status only; no transmission)

SEPARATE CONTEXT DATA:
WHO Bangladesh indicators → population-level health-priority evidence only
Synthetic language examples → classifier training/evaluation only
DGHS sample records → reference lookup only, never model training
```

## Layers and trust boundaries

- **Runtime input:** worker-entered Bangla, Banglish, or English text; avoid direct identifiers.
- **Small AI:** `ai.js` runs in the page with local synthetic training examples. `classify()` returns the Naive Bayes top class and uncalibrated score. Explicit phrase rules can expose multiple concerns and a safety-prioritized display label. No model output is a diagnosis or an autonomous referral.
- **Documentation:** worker-editable fields are rendered in `app.js`; missing fields prompt confirmation. The worker decides and edits the record.
- **Safety rules:** `referral_rules.json` and direct phrase checks document/surface guardrails, not a validated triage protocol. Absence of a rule match cannot rule out danger.
- **Access:** worker-selected barrier checkboxes and a sample-facility reference connect a case to practical access planning. The app does not calculate routes or verify service.
- **Finance:** illustrative micro-protection, mobile-money, and payment-plan controls can only record local demo discussion/events; none contacts a provider or transfers money.
- **Offline/continuity:** records are stored in device browser `localStorage`; message and sync actions do not transmit. Follow-up records a date but sends no notification. `service-worker.js` caches static first-party assets on HTTPS after a successful load.
- **Context data:** WHO static JSON supports population-level Bangladesh prioritization. It is not included in training, runtime classification, patient risk estimates, or referral logic. No WHO API is called.
- **Facility data:** `facilities_dghs_sample.json` is a six-record sample reference. It is not complete, live, or a claim of availability.

## Static hosting

`index.html` loads `./ai.js` and `./app.js`, and fetches same-origin static JSON with relative paths. GitHub Pages can serve it beneath `/shustho-poth-ai/` without a build step. Core text processing does not depend on those fetches. On `file://`, JSON `fetch()` and service workers may be blocked; the classifier works and uses its embedded facility fallback. On Pages HTTPS, service-worker caching supports a later offline visit after the initial successful load.
