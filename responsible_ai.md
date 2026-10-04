# Responsible AI and patient safety

## 1. Human in the loop

The patient chooses whether to use the prototype and whether to save or share information. A qualified health professional remains the final clinical authority. The AI organizes words; it does not make care decisions or autonomous referrals.

## 2–5. Clinical boundaries, warning rules, and uncertainty

The app does not diagnose disease or prescribe medication. Explicit phrase-based warning rules operate separately from the Naive Bayes classifier and can direct attention to urgent human care. They are not a clinical guideline or validated triage system. No warning detected is not reassurance. Emergency guidance appears before community or financial options. `tel:999` is a device dial link; there is no dispatch integration.

The raw Naive Bayes score is uncalibrated and not shown. The interface uses “Model signal: Strong phrase match” or “Model signal: Uncertain.” Short-scope Bangla/Banglish/English negation cues suppress some nearby phrases, but clause scope, spelling, mixed wording, and multiple symptoms can produce errors.

## 6–7. Language and synthetic data

Training phrases, demo cases, and evaluation cases are synthetic. They are not real patient records and do not establish clinical evidence. Bangla, romanized Bangla/Banglish, spelling variants, literacy levels, Sylheti, Chittagonian, other dialects, ages, disabilities, and household contexts are incompletely represented. Errors may affect language communities unevenly. The 33 language/safety assertions are narrow software checks, not robustness proof.

### Speech recognition limitations

Voice is an optional browser speech-to-text input interface. Browser/device support and connectivity vary. Accent and dialect variation, background noise, child or older speakers, code-switching, Banglish, medical words, and incorrect transcription—including incorrect negation transcription—can change the text supplied to the existing classifier. Bangla (`bn-BD`) is configured, but universal Bangla accuracy is not claimed; Banglish recognition is especially uncertain. The current prototype does not independently benchmark speech recognition.

The app always shows the transcript before analysis and lets the patient edit it. It does not silently alter the transcript or diagnose from voice. The transcript uses the existing text normalization, classifier, negation handling, and safety layer; the text input fallback remains available. An incorrect transcript can produce an incorrect interpretation. For safety-critical cases, the system should defer to human assessment rather than treating the transcript as ground truth.

The page does not save audio recordings. The browser/device speech service may process audio and may require connectivity. Do not enter real sensitive health information. No encryption or production-grade voice privacy is claimed.

## 8–10. Privacy, consent, and records

Case notes and patient-controlled records are stored in browser `localStorage`; storage is not encrypted. Shared or lost devices may expose data. Community requests are prepared only after consent, with a separate optional consent for health details. Sharing controls are local demonstrations. AI suggestions do not silently modify health records; patient confirmation is required. Avoid real sensitive information in this prototype.

## 11–12. Facility and emergency limits

The DGHS directory contains six static source records, not a full national directory. It does not report live opening, staffing, capacity, stock, services, route, distance, referral acceptance, or emergency suitability. No live emergency, ambulance, CHW, NGO, or SMS service is connected. Verify local options independently.

## 13. Financial safety

The contribution and payment-plan interactions are illustrative only. They are not insurance, a loan, credit approval, financial advice, an offer, or an actual transaction. No PIN, OTP, password, or account credential is requested. Cost discussions must never delay urgent care.

## 14–15. Source representation and evaluation

No facilities, NGOs, prices, availability, clinicians, or partnerships are fabricated or presented as live. WHO data provide population context only; WHO does not endorse this project. SDI, Global Findex, and GSMA country-specific data remain `NOT_LOADED`; MASSIVE is an external NLP reference only. Mozilla Common Voice, FLEURS, and MMS are future speech-evaluation references only and are not integrated. Existing evaluation results are prototype-only, synthetic, and not clinical validation. Browser-based end-to-end testing could not be completed in the available environment. Voice browser compatibility could not be fully automated in the available environment.

## 16–17. Production requirements

Before real-world use, the system needs independent clinical and community review, validated Bangladesh facility and language data, secure encryption and authentication, role-based access controls, consent/audit logs, revocation and deletion controls, threat modeling, and deployment-specific legal/regulatory review. This static prototype does not provide production-grade privacy or security.
