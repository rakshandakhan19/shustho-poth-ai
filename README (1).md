# Prototype language/classification evaluation

The current Naive Bayes training set contains **243 synthetic phrases** across 18 labels. `evaluation_cases.csv` is a separately authored 50-case synthetic held-out set with Bangla, Banglish, English, barriers, ambiguous inputs, and potential-warning examples.

Results are generated from the current `ai.js` execution and recorded in `results.json`:

- Naive Bayes top-class accuracy: 40/50 (80.0%); macro-F1 is included in the JSON.
- Simple phrase-keyword baseline: 35/50 (70.0%); first configured direct phrase cue, or unmatched.
- Separate warning phrase rules escalated 17/17 cases labeled as potential warning examples in this small set. This is test-set coverage only, not a measured real-world sensitivity or safety guarantee.
- 20/50 model scores were below the prototype low-score threshold of 0.35. Scores are uncalibrated.

The older 71-case `local_language_dataset.csv` evaluation is also retained in `results.json` for continuity. Every row is synthetic. Neither evaluation is representative language evaluation, clinical validation, triage validation, or evidence of safe deployment. See the main README and responsible AI notes for limitations.
