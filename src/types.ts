export interface DecisionAnalysis {
  strategicAnalysis: string;
  coreTradeoffs: string;
  riskAnalysis: string;
  opportunityCost: string;
  emotionalBiasDetection: string;
  recommendedPath: string;
  nextBestActions: string;
  longTermOutlook: string;
  clarityScore: number;
  confidenceLevel: number;
}

export interface Decision {
  id: string;
  user_id: string;
  title: string;
  description: string;
  options: string;
  goal: string;
  fear: string;
  constraints: string;
  emotion: string;
  importance: number;
  analysis: DecisionAnalysis | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}
