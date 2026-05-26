import { Decision, DecisionAnalysis } from "../types";

export async function analyzeDecision(decisionData: Partial<Decision>): Promise<DecisionAnalysis> {
  const response = await fetch("/api/analyze-decision", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(decisionData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to analyze decision");
  }

  return response.json();
}
