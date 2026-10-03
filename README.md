# Shustho Poth AI
## From local words to the next safe step.

An offline-first, Bangla/Banglish-first Small AI prototype for frontline health workers.

### Core workflow
**Everyday patient language → small local classifier → structured information → uncertainty/missing fields → human decision → referral/follow-up record → offline save → later sync.**

### What is actually AI?
A tiny Naive Bayes classifier runs locally in the browser. It classifies a narrow set of intents from unstructured Bangla/Banglish text. Transparent rule-based extraction identifies fields such as duration, age, reduced intake, breathing report, financial barrier, travel barrier and connectivity.

It does **not** diagnose, prescribe treatment, or make the final referral decision.

### Dataset
`data/local_language_dataset.csv` contains **105 synthetic training examples and 49 held-out synthetic test examples** across seven narrow intents. It includes Bangla and Banglish examples.

Held-out result: **98.0% accuracy; 97.9% macro-F1 (48/49 correct)**. One connectivity example was misclassified as a financial barrier and is retained as an explicit error. These metrics are prototype evaluation only and are **not clinical validation**.

### Bangladesh facility layer
`data/facilities_dghs_sample.json` contains six sample records from the public DGHS Facility Registry, using fields visible in that registry. The current public registry reports facility ID, English/Bangla name, type, agency, administrative areas and active/private fields. The sample is not a complete database and the prototype does not infer distance, opening hours, bed availability or clinical capacity. Verify live information before deployment.

### Mobile money / affordability
The prototype captures a reported financial access barrier and shows mobile money, cash and verified assistance as possible workflow routes. It does not initiate payments or claim insurance eligibility.

### Why AI instead of a form?
A static form can store fields and an SMS workflow can transmit fixed fields. The narrow AI task here is converting messy local-language descriptions into structured information and flagging uncertainty without requiring the worker to manually map every phrase to a field.

### Responsible AI
- Human health worker makes the final decision.
- Missing information is surfaced.
- Low confidence can trigger review.
- No autonomous diagnosis or treatment.
- Synthetic cases are clearly labeled.
- Facility data is a non-live sample.
- Payment/assistance options must be verified before deployment.

### Run
Open `index.html` in a browser. The core classifier and workflow run client-side.

### Source
DGHS Facility Registry: https://hrm.dghs.gov.bd/public/facility-registry

This is a hackathon prototype, not a clinical device or validated medical decision-support system.
