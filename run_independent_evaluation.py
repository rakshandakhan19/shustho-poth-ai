"""Run the separate synthetic language set against the production browser JS model."""
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CASES = ROOT / "evaluation_cases_independent.json"
REPORT = ROOT / "evaluation_results_independent.json"
BRIDGE = ROOT / "tests" / "independent-eval-bridge.cjs"


def score_binary(expected, predicted):
    tp = sum(e and p for e, p in zip(expected, predicted))
    fp = sum((not e) and p for e, p in zip(expected, predicted))
    fn = sum(e and (not p) for e, p in zip(expected, predicted))
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return {"precision": precision, "recall": recall, "f1": f1, "support": sum(expected)}


def main():
    cases = json.loads(CASES.read_text(encoding="utf-8"))
    if len(cases) != 150:
        raise ValueError(f"Expected 150 independent cases, found {len(cases)}")
    required = {"id", "text", "expected_category", "expected_escalate", "language_type", "test_type"}
    if any(not required.issubset(row) for row in cases):
        raise ValueError("An evaluation case is missing required fields")
    node = os.environ.get("NODE", "node")
    completed = subprocess.run([node, str(BRIDGE)], input=json.dumps(cases, ensure_ascii=False), text=True,
                               capture_output=True, check=True, encoding="utf-8")
    predictions = json.loads(completed.stdout)
    y = [row["expected_category"] for row in cases]
    pred = [row["intent"] for row in predictions]
    classes = sorted(set(y) | set(pred))
    per_class = {}
    for label in classes:
        per_class[label] = score_binary([v == label for v in y], [v == label for v in pred])
    emergencies = [bool(row["expected_escalate"]) for row in cases]
    escalated = [bool(result["red_flags"]) for result in predictions]
    non_emergency = [not value for value in emergencies]
    correct_unknown = sum(row["expected_category"] == "unknown" and result["intent"] == "unknown"
                          for row, result in zip(cases, predictions))
    unknown_support = sum(row["expected_category"] == "unknown" for row in cases)
    negated = [i for i, row in enumerate(cases) if row["test_type"] == "negation"]
    negation_correct = sum(not escalated[i] and cases[i]["expected_category"] == "unknown"
                           for i in negated)
    by_language = {}
    for language in ("bangla", "banglish", "mixed"):
        indices = [i for i, row in enumerate(cases) if row["language_type"] == language]
        by_language[language] = {"accuracy": sum(y[i] == pred[i] for i in indices) / len(indices) if indices else None,
                                 "correct": sum(y[i] == pred[i] for i in indices), "total": len(indices)}
    report = {
        "label": "Prototype evaluation — not clinical validation.",
        "source": "evaluation_cases_independent.json; separate synthetic cases, not used for training",
        "classifier": "Existing production ai.js analyzeCase() and its explicit red-flag safety rules",
        "case_count": len(cases),
        "overall_accuracy": {"value": sum(a == b for a, b in zip(y, pred)) / len(y),
                             "correct": sum(a == b for a, b in zip(y, pred)), "total": len(y)},
        "per_class": per_class,
        "emergency_recall": score_binary(emergencies, escalated),
        "false_escalation_rate": {"value": sum((not emergencies[i]) and escalated[i] for i in range(len(cases))) / sum(non_emergency) if sum(non_emergency) else None,
                                  "false_escalations": sum((not emergencies[i]) and escalated[i] for i in range(len(cases))),
                                  "non_emergency_cases": sum(non_emergency)},
        "negation_accuracy": {"value": negation_correct / len(negated) if negated else None,
                              "correct": negation_correct, "total": len(negated),
                              "definition": "Negated test cases with no warning escalation and unknown concern category"},
        "language_accuracy": by_language,
        "unknown_handling": {"correct_unknown": correct_unknown, "unknown_cases": unknown_support,
                             "unknown_recall": correct_unknown / unknown_support if unknown_support else None,
                             "predicted_unknown": sum(v == "unknown" for v in pred),
                             "uncertain_signal_count": sum(r["model_signal"] == "uncertain" for r in predictions)},
        "limitations": ["Synthetic language evaluation only; not clinical validation.",
                        "Expected labels are prototype evaluation labels, not diagnoses.",
                        "Browser, microphone and mobile end-to-end testing were not run by this script."],
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Independent evaluation failed: {exc}", file=sys.stderr)
        raise
