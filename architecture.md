# Architecture

```text
PATIENT / CAREGIVER
  ↓ Bangla · Banglish · English
TEXT OR VOICE (optional browser input)
  ↓ voice is converted to text; patient reviews/edits transcript
LOCAL SMALL AI (Naive Bayes + limited information extraction)
  ↓ interpretation layer only
NEGATION HANDLING (existing text-level cues)
  ↓
SEPARATE SAFETY GATE (explicit phrase-based warning rules)
  ↓ potential warning only; urgent human-care guidance first
PATIENT NEXT STEP (human decision; no diagnosis or autonomous referral)
  ↓
CARE NAVIGATION (optional division → district → upazila + partial static DGHS records)
  ↓ fallback level is labeled; no “nearest” or live-availability claim
ACCESS SUPPORT (cost / transport / connectivity discussion)
  ↓
COMMUNITY SUPPORT (patient-controlled, separate consent, demo only)
  ↓
PATIENT-CONTROLLED RECORD (local browser storage)
  ↓ separate consent for sharing
FOLLOW-UP / OFFLINE QUEUE / SMS DRAFT (local only; no transmission)
  ↓ sync when connectivity exists: simulated only in this prototype
```

Small AI is the interpretation layer. Explicit rules are the safety layer. Human healthcare professionals and the patient retain final authority. WHO Bangladesh indicators are contextual evidence only; they are not classifier inputs, diagnostic evidence, or referral rules.

Voice recognition is an optional input interface, not a new AI model. It does not replace the existing text pipeline. The transcript passes through the same classifier, negation handling, and safety rules as typed input. Browser/device speech capability can be unavailable or connectivity-dependent; typing remains the offline fallback.

## Offline-first behavior

Static HTML, CSS, JavaScript, embedded model phrases, bundled JSON, and bundled JS snapshots run without external APIs. The location selector can use the bundled local snapshot. HTTPS service-worker caching supports repeat visits offline after successful initial load. Opening `index.html` directly works for core functions but does not enable service-worker caching. Local case/record data are browser `localStorage`, not encrypted storage.

## Data layers

- `data/ai/`: phrase inventory, independent evaluation CSV mirror, and label schema. Runtime training examples remain in `ai.js`.
- `data/geography/`: Bangla location hierarchy from the National Portal.
- `data/health_access/`: partial DGHS facility sample and explicit NOT_LOADED SDI status.
- `data/context/`: WHO Bangladesh context plus NOT_LOADED Findex/GSMA status.
- `data/benchmarks/`: MASSIVE external reference metadata only.

## Trust boundaries and components

- `index.html`: patient flow, human oversight and warnings, geography selection, context and evaluation disclosures.
- `ai.js`: existing Naive Bayes classifier, normalization, bounded negation, extraction, and separate warning phrase rules. Raw scores are uncalibrated and not shown.
- `app.js`: local interactions, optional browser SpeechRecognition transcript interface, location-to-record fallback matching, local record/SMS/support simulations, WHO context rendering. Speech recognition is not trained or stored by this app.
- `service-worker.js`: static same-origin caching on HTTPS; no server integration.
- `tests/`: language/safety assertions and geography/data structure validation.

No backend, API, database, login, cloud AI, live SMS, community partner, insurer, payment, emergency dispatch, or synchronization service is connected. GitHub Pages serves the static project without a build step; assets use project-relative URLs for repository subpaths.
