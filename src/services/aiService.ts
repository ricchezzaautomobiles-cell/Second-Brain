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
    let errorMessage = "Failed to analyze decision";
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      try {
        const text = await response.text();
        errorMessage = text.substring(0, 150) || `HTTP error ${response.status}`;
      } catch {
        errorMessage = `HTTP error ${response.status}`;
      }
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Could not parse analyze-decision backend response as JSON.");
  }
}
