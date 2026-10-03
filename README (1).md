# Current prototype evaluation

The current synthetic dataset has **171 training phrases** and **71 held-out phrases** across 18 labels. The test set covers the seven original categories with seven examples each and the eleven added labels with two examples each.

The Naive Bayes model’s top class matches **57/71 (80.3%)**, with **62.0% macro-F1**. Fourteen model top-class errors are retained in `results.json`. One original connectivity phrase is still classified as a financial barrier.

The phrase-overlay, safety-prioritized output matched all 71 curated labels on this small test split. The new categories have only two held-out examples each, and examples deliberately contain cue words. This result is not representative language evaluation, clinical validation, or evidence of safe deployment.

Every training and held-out phrase is synthetic. The dataset does not cover all Bangla dialects, code-switching, ages, conditions, literacy levels, or real clinical environments. See `local_language_dataset.csv`, `results.json`, and the main README for limitations.
