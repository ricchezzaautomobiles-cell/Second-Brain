import { AiAnalysisResult } from '../types';

export async function analyzeUnsentMessage(content: string, recipientCategory?: string | null): Promise<AiAnalysisResult> {
  if (!content || content.trim().length < 5) {
    throw new Error('Message is too short for AI emotional analysis.');
  }

  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      recipientCategory: recipientCategory || 'unspecified',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Server error during AI analysis' }));
    throw new Error(errorData.message || `AI analysis failed (${response.status})`);
  }

  const data = await response.json();
  return data.analysis as AiAnalysisResult;
}
