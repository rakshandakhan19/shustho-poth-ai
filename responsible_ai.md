# Responsible AI

## Clinical safety

- The tool is a prototype for screening/documentation support, not diagnosis or prescription.
- Naive Bayes labels and phrase-rule flags describe reported wording; neither establishes a disease or severity.
- Explicit warning phrases prompt human confirmation under local protocol. Phrase rules are incomplete; no match is not reassurance.
- Model scores are uncalibrated, not probabilities of illness, and may disagree with cue-matched concerns.
- A health worker is the final decision-maker for assessment, referral, follow-up, and protocol use.
- Financial, transport, or follow-up planning must not delay a worker’s response to a reported potential warning sign.

## Data and intended use

- The classifier phrases and demo cases are synthetic; there are no patient records in the training CSV.
- The 15 WHO Bangladesh indicators are real source data used only for population-level health-priority context. They are never training labels, patient-level risk inputs, diagnosis, or referral logic.
- The supplied WHO archive omitted the separate leading-causes dataset; repeated TB values and duplicate wasting observations are disclosed, not silently repaired.
- DGHS facility files contain a small sample, not live or complete coverage. Verify facility location, services, opening, and capacity locally.
- BDT contribution, micro-protection, support routes, and payment arithmetic are illustrative. No insurer/NGO/provider partnership, eligibility, advice, loan, or real payment is offered.
- SMS, connection, and synchronization controls are local simulations; no external API/gateway is connected.

## Bias, localization, and evaluation

- Bangla/Banglish examples include a limited range of spellings and colloquial forms. They do not represent all dialects, literacy levels, ages, or regions of Bangladesh.
- Synthetic tests are small and uneven (two held-out examples for each new class) and are not clinical validation or deployment evidence.
- Real-world use would require representative local language evaluation, clinical governance, prospective safety review, and monitored implementation.

## Privacy and shared devices

- Case data stay in this browser’s localStorage; localStorage is not encrypted by this prototype.
- Anyone with access to the device/browser profile may potentially read stored cases. Shared/lost phones are a risk.
- Avoid names, phone numbers, NID, and unnecessary financial details. The default SMS omits financial data.
- The app requests no PIN, OTP, payment credentials, or bank password. A local clear-data control is provided.
- Production requires encryption, authentication, session controls, access management, data-retention rules, secure deletion, and security review.

## Financial safety

- No real payment, insurance sale, loan approval, or financial advice.
- The micro-health protection example is not an insurance contract. Pricing, coverage, eligibility, exclusions, claims, and regulation are undetermined.
- Any real assistance or subsidized care must be independently verified for current availability and eligibility.

## Connectivity

- Core classifier and case workflow are local; the static site can be cached by the service worker after a successful HTTPS load.
- Same-origin WHO/facility JSON adds local context on static hosting, but failure does not block classification or worker workflow.
- SMS-ready copy and sync are prepared/simulated only. No SMS is sent and no case is synchronized to a server.
