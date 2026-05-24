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
    let errorMsg = "Failed to analyze decision";
    try {
      const text = await response.text();
      try {
        const errorJSON = JSON.parse(text);
        errorMsg = errorJSON.error || errorMsg;
      } catch {
        if (text.includes("A server error occurred") || text.includes("An error occurred")) {
          errorMsg = "Beyond AI service encountered an error on your Vercel deployment. Please verify that you have added your GEMINI_API_KEY as an environment variable in your Vercel Project settings dashboard.";
        } else if (text.length < 300) {
          errorMsg = text.trim() || errorMsg;
        } else {
          errorMsg = `Server error (${response.status}): ${response.statusText}`;
        }
      }
    } catch {
      errorMsg = `Server error status: ${response.status} (${response.statusText})`;
    }
    throw new Error(errorMsg);
  }

  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse success JSON:", responseText);
    throw new Error("AI response was not valid JSON. Please try again.");
  }
}
