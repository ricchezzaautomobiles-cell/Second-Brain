// UNSENT TypeScript Type Definitions

export type MessageVisibility = 'private' | 'anonymous' | 'deleted';

export type RecipientCategory = 
  | 'Myself'
  | 'Someone I love'
  | 'An ex'
  | 'Friend'
  | 'Family'
  | 'Stranger'
  | 'Someone who hurt me'
  | 'Someone I never met'
  | 'Other';

export type EmotionName = 
  | 'Love'
  | 'Regret'
  | 'Anger'
  | 'Hope'
  | 'Fear'
  | 'Goodbye'
  | 'Gratitude'
  | 'Missing'
  | 'Forgiveness';

export type ReactionType = 
  | 'felt_this'
  | 'not_alone'
  | 'understand'
  | 'stayed_with_me';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnsentMessage {
  id: string;
  user_id: string;
  content: string;
  visibility: MessageVisibility;
  recipient_category: RecipientCategory | null;
  created_at: string;
  updated_at: string;
  released_at: string | null;
  deleted_at: string | null;
  // Computed / joined fields
  emotions?: EmotionName[];
  reactions_count?: Record<ReactionType, number>;
  user_reactions?: ReactionType[];
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface TimeCapsule {
  id: string;
  user_id: string;
  content: string;
  unlock_at: string;
  created_at: string;
  opened_at: string | null;
  sealed: boolean;
  reflection: string | null;
  would_send: 'Yes' | 'No' | 'Not sure' | null;
  updated_at: string;
}

export interface AiEmotionBreakdown {
  emotion: EmotionName | string;
  intensityPercentage: number;
}

export interface AiAnalysisResult {
  emotions: AiEmotionBreakdown[];
  underlyingIntention: string;
  reflection: string;
  writingPrompt: string;
}

export interface AiAnalysis {
  id: string;
  user_id: string;
  message_id: string | null;
  analysis_type: string;
  result: AiAnalysisResult;
  created_at: string;
}

export interface UserStats {
  totalMessages: number;
  privateMessages: number;
  anonymousReleases: number;
  timeCapsules: number;
  openedCapsules: number;
  reactionsGiven: number;
}

export interface Report {
  id: string;
  message_id: string;
  reporter_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'actioned';
  created_at: string;
}

export interface BannedUser {
  id: string;
  user_id: string;
  email?: string | null;
  reason: string;
  banned_by: string;
  created_at: string;
}

export interface OwnerStats {
  totalMessages: number;
  totalPrivate: number;
  totalAnonymous: number;
  totalCapsules: number;
  totalReports: number;
  totalBanned: number;
  totalReviews: number;
}

export type FeedbackCategory = 
  | 'experience'
  | 'feature_request'
  | 'bug_report'
  | 'testimonial'
  | 'general';

export interface FeedbackReview {
  id: string;
  user_id: string | null;
  user_display_name: string;
  user_email: string | null;
  rating: number;
  category: FeedbackCategory;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at?: string;
  admin_reply?: string | null;
  admin_replied_at?: string | null;
  status?: 'published' | 'under_review' | 'resolved';
}

export type ActiveTab = 
  | 'home' 
  | 'write' 
  | 'discover' 
  | 'capsules' 
  | 'profile' 
  | 'feedback'
  | 'reviews'
  | 'privacy' 
  | 'about' 
  | 'terms' 
  | 'community-guidelines'
  | 'anonymous-writing'
  | 'private-journal'
  | 'unsent-messages'
  | 'anonymous-community'
  | 'time-capsules';
