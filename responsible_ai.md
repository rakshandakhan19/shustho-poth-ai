# Responsible AI and patient safety

## Intended use and human oversight

Shustho Poth AI is a static health-navigation and continuity-of-care prototype. It organizes patient-reported Bangla/Banglish/English wording into narrow presentation/access labels and displays possible warning cues. It does not diagnose, prescribe, determine severity, or make a referral decision. A qualified human health professional is responsible for clinical assessment and care decisions; the patient remains in control of personal records and sharing.

## Safety layer and uncertainty

Explicit phrase-based warning rules run separately from the Naive Bayes classifier. Possible emergency-related phrases (difficult breathing, seizure, not responding, confusion, severe bleeding, inability to drink/reduced urine, chest discomfort, sudden weakness/face/speech change, head injury, and pregnancy-related bleeding/labour warning words) direct attention to urgent human care. Rules are incomplete, may miss or misread wording, and are not a validated triage protocol. No detected warning is not reassurance. For severe/life-threatening situations, the UI advises calling Bangladesh emergency service 999 or seeking emergency medical care. No dispatch integration exists.

Classifier scores are relative and uncalibrated, not disease probabilities. When the score is low, the UI explicitly says not to rely on the AI classification and to continue with human medical assessment. AI never automatically alters medical records: health-record suggestions require patient confirmation; suspected diagnosis also asks whether a health professional made it.

## Data limitations, bias, localization

All classifier training phrases and demo cases are synthetic. The held-out evaluation is also synthetic and narrow; none is clinical validation. Coverage of Bangla, romanized Bangla/Banglish, colloquial spelling and mixed language is incomplete. Sylheti, Chittagonian, other regional language varieties, literacy levels, ages, disabilities and household contexts are not adequately represented. Errors can be systematic and may exclude people who phrase concerns differently.

The 15 WHO Bangladesh indicators (351 packaged observations) are population-level context only, not training labels, patient-level inference, diagnosis, triage, or referral. Source-package omissions and anomalies are documented. No Bangladesh DHS, Global Findex, GSMA, OSM, HDX, WorldPop, connectivity, or speech corpus is included in this prototype. DGHS data are a six-record static sample and may be incomplete or outdated.

## Patient safety and access

Urgent cases are directed toward human emergency care/999. Financial planning, insurance concepts, community support, app use, and connectivity must never delay urgent care. `tel:999` depends on the device and carrier; no live emergency dispatch is integrated. Community support request controls only prepare local drafts; no NGO/CHW network is connected.

Facilities do not show live availability or suitability. Users must verify locally. No guaranteed treatment, transport, referral acceptance, or assistance is promised.

## Financial safety

BDT contributions, micro-health protection, mobile-money, and payment-plan arithmetic are illustrative. They are not insurance, an offer, a quote, financial advice, a loan, a credit decision, or a real payment. No PIN, OTP, password, or payment credentials are requested. No insurer, mobile-money, NGO, or care provider partnership is claimed.

## Privacy, consent and shared devices

Case and record data are stored in browser `localStorage`, which is not encrypted. A person using a shared or lost phone/browser profile may read them. The demo recipient view and 24-hour code operate locally; they are not secure authentication and nothing is transmitted. Community help drafts are stored locally only after explicit consent; health details have a separate optional consent control. Sharing can be revoked locally.

Do not enter real sensitive patient information. Production would require identity verification, secure authentication, encryption, role-based permissions, consent records, audit logs, revocation, retention limits, secure deletion, threat modeling, and independent security review.

## Offline and simulated features

The classifier and core browser workflow are local. HTTPS service-worker caching may allow repeat visits offline after a successful initial load. Browser storage may be unavailable or cleared, especially in private browsing. SMS, telecom, sync, connection restoration, community request, recipient access, and mobile-money controls are demos only. They have no external service connection.
