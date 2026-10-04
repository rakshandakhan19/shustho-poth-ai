# Shustho Poth AI

From local words to the next safe step.

Patient-facing, offline-first Bangladesh health-navigation prototype. Uses local Naive Bayes, bounded negation handling, separate warning-sign rules, and synthetic local-language examples. No diagnosis, prescription, or live service integration.

Optional browser speech recognition can produce a patient-reviewed transcript for the same local text pipeline. Support varies and may require connectivity; typed input remains the offline path. Speech accuracy is not independently benchmarked.

**100-case prototype evaluation: 70.0% Naive Bayes intent accuracy; 62.2% keyword baseline; 100% synthetic warning-rule recall; 0% false escalation; 100% explicit negation suppression; 67% uncertain/abstention signal. Prototype evaluation only — not clinical validation.**

Run `node tests/run-tests.cjs` and `node tests/evaluate.cjs`. See [`README.md`](./README.md), [`results.json`](./results.json), [`evaluation_cases.json`](./evaluation_cases.json), and [`responsible_ai.md`](./responsible_ai.md) for details and limitations.
