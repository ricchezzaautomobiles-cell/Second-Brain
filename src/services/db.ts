import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from '../lib/firebase';
import { 
  UnsentMessage, 
  TimeCapsule, 
  AiAnalysisResult, 
  AiAnalysis, 
  UserStats, 
  ReactionType, 
  EmotionName,
  RecipientCategory,
  FeedbackReview,
  FeedbackCategory,
  Report,
  BannedUser,
  OwnerStats
} from '../types';

// Local Storage Fallback Keys
const LOCAL_MESSAGES_KEY = 'unsent_local_messages';
const LOCAL_CAPSULES_KEY = 'unsent_local_capsules';
const LOCAL_BLOCKED_USERS_KEY = 'unsent_blocked_users';
const LOCAL_FEEDBACK_KEY = 'unsent_local_feedback';

export function getBlockedUsers(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_BLOCKED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function blockUser(blockedUserId: string, currentUserId?: string): Promise<void> {
  if (!blockedUserId) return;
  const blocked = getBlockedUsers();
  if (!blocked.includes(blockedUserId)) {
    blocked.push(blockedUserId);
    localStorage.setItem(LOCAL_BLOCKED_USERS_KEY, JSON.stringify(blocked));
  }

  if (currentUserId) {
    try {
      const blockId = `block-${currentUserId}-${blockedUserId}`;
      await setDoc(doc(db, 'blocked_users', blockId), {
        blocker_id: currentUserId,
        blocked_id: blockedUserId,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error saving block in Firestore:', err);
    }
  }
}

export function unblockUser(blockedUserId: string): void {
  const blocked = getBlockedUsers().filter(id => id !== blockedUserId);
  localStorage.setItem(LOCAL_BLOCKED_USERS_KEY, JSON.stringify(blocked));
}

export function clearBlockedUsers(): void {
  localStorage.removeItem(LOCAL_BLOCKED_USERS_KEY);
}

function getLocalMessages(): UnsentMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(msgs: UnsentMessage[]) {
  localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(msgs));
}

function getLocalCapsules(): TimeCapsule[] {
  try {
    const raw = localStorage.getItem(LOCAL_CAPSULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCapsules(caps: TimeCapsule[]) {
  localStorage.setItem(LOCAL_CAPSULES_KEY, JSON.stringify(caps));
}

/**
 * Fetch stats for the active user directly from Firestore
 */
export async function fetchUserStats(userId: string): Promise<UserStats> {
  if (!userId) {
    return {
      totalMessages: 0,
      privateMessages: 0,
      anonymousReleases: 0,
      timeCapsules: 0,
      openedCapsules: 0,
      reactionsGiven: 0,
    };
  }

  try {
    const msgsQuery = query(collection(db, 'unsent_messages'), where('user_id', '==', userId));
    const capsulesQuery = query(collection(db, 'time_capsules'), where('user_id', '==', userId));
    const reactionsQuery = query(collection(db, 'reactions'), where('user_id', '==', userId));

    const [msgsSnap, capsulesSnap, reactionsSnap] = await Promise.all([
      getDocs(msgsQuery),
      getDocs(capsulesQuery),
      getDocs(reactionsQuery),
    ]);

    const messages = msgsSnap.docs.map(d => d.data() as UnsentMessage);
    const capsules = capsulesSnap.docs.map(d => d.data() as TimeCapsule);

    const activeMsgs = messages.filter(m => m.visibility !== 'deleted');

    return {
      totalMessages: activeMsgs.length,
      privateMessages: activeMsgs.filter(m => m.visibility === 'private').length,
      anonymousReleases: activeMsgs.filter(m => m.visibility === 'anonymous').length,
      timeCapsules: capsules.length,
      openedCapsules: capsules.filter(c => Boolean(c.opened_at)).length,
      reactionsGiven: reactionsSnap.size,
    };
  } catch (err) {
    console.error('Error fetching Firestore stats, using local storage:', err);
    const msgs = getLocalMessages().filter(m => m.user_id === userId && m.visibility !== 'deleted');
    const caps = getLocalCapsules().filter(c => c.user_id === userId);
    return {
      totalMessages: msgs.length,
      privateMessages: msgs.filter(m => m.visibility === 'private').length,
      anonymousReleases: msgs.filter(m => m.visibility === 'anonymous').length,
      timeCapsules: caps.length,
      openedCapsules: caps.filter(c => Boolean(c.opened_at)).length,
      reactionsGiven: 0,
    };
  }
}

/**
 * Fetch private messages for archive
 */
export async function fetchUserArchive(userId: string, filterVisibility?: 'private' | 'anonymous' | 'all'): Promise<UnsentMessage[]> {
  if (!userId) return [];

  try {
    const msgsQuery = query(collection(db, 'unsent_messages'), where('user_id', '==', userId));
    const snap = await getDocs(msgsQuery);
    let msgs = snap.docs.map(d => ({ ...d.data(), id: d.id } as UnsentMessage));
    
    msgs = msgs.filter(m => m.visibility !== 'deleted');

    if (filterVisibility && filterVisibility !== 'all') {
      msgs = msgs.filter(m => m.visibility === filterVisibility);
    }

    return msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error('Error fetching archive from Firestore:', err);
    let msgs = getLocalMessages().filter(m => m.user_id === userId && m.visibility !== 'deleted');
    if (filterVisibility && filterVisibility !== 'all') {
      msgs = msgs.filter(m => m.visibility === filterVisibility);
    }
    return msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

/**
 * Fetch real anonymous community messages
 */
export async function fetchAnonymousFeed(options: {
  category?: string;
  emotion?: EmotionName | string | 'All';
  recipientCategory?: string;
  limit?: number;
  offset?: number;
  currentUserId?: string;
}): Promise<UnsentMessage[]> {
  try {
    const q = query(
      collection(db, 'unsent_messages'),
      where('visibility', '==', 'anonymous')
    );
    const snap = await getDocs(q);
    let messages = snap.docs.map(d => ({ ...d.data(), id: d.id } as UnsentMessage));

    // Filter out blocked authors
    const blockedList = getBlockedUsers();
    if (blockedList.length > 0) {
      messages = messages.filter(m => !blockedList.includes(m.user_id));
    }

    // Sort by released_at or created_at descending
    messages.sort((a, b) => {
      const dateA = new Date(a.released_at || a.created_at).getTime();
      const dateB = new Date(b.released_at || b.created_at).getTime();
      return dateB - dateA;
    });

    const selectedFilter = options.category || options.recipientCategory || options.emotion;
    if (selectedFilter && selectedFilter !== 'All') {
      const filterLower = selectedFilter.toLowerCase();
      messages = messages.filter(m => {
        const recCat = (m.recipient_category || '').toLowerCase();
        const content = (m.content || '').toLowerCase();

        if (recCat && (recCat === filterLower || recCat.includes(filterLower) || filterLower.includes(recCat))) {
          return true;
        }

        if (filterLower.includes('ex') && (recCat.includes('ex') || content.includes('ex'))) {
          return true;
        }
        if (filterLower.includes('love') && (recCat.includes('love') || content.includes('love') || content.includes('adore') || content.includes('heart'))) {
          return true;
        }
        if (filterLower.includes('friend') && (recCat.includes('friend') || content.includes('friend'))) {
          return true;
        }
        if (filterLower.includes('family') && (recCat.includes('family') || content.includes('mom') || content.includes('dad') || content.includes('sister') || content.includes('brother') || content.includes('family'))) {
          return true;
        }
        if (filterLower.includes('hurt') && (recCat.includes('hurt') || content.includes('hurt') || content.includes('angry') || content.includes('pain') || content.includes('betray'))) {
          return true;
        }
        if (filterLower.includes('stranger') && (recCat.includes('stranger') || content.includes('stranger'))) {
          return true;
        }
        if (filterLower.includes('never met') && (recCat.includes('never met') || content.includes('never met'))) {
          return true;
        }
        if (filterLower.includes('myself') && (recCat.includes('myself') || content.includes('myself') || content.includes('dear self'))) {
          return true;
        }
        if (filterLower.includes('regret') && (content.includes('regret') || content.includes('sorry') || content.includes('wish i'))) {
          return true;
        }
        if (filterLower.includes('goodbye') && (content.includes('goodbye') || content.includes('bye') || content.includes('farewell'))) {
          return true;
        }
        if (filterLower.includes('hope') && (content.includes('hope') || content.includes('wish') || content.includes('pray'))) {
          return true;
        }
        if (filterLower.includes('anger') && (content.includes('angry') || content.includes('hate') || content.includes('mad') || content.includes('furious'))) {
          return true;
        }
        if (filterLower.includes('missing') && (content.includes('miss') || content.includes('missing'))) {
          return true;
        }
        if (filterLower.includes('forgiveness') && (content.includes('forgive') || content.includes('pardon'))) {
          return true;
        }

        return false;
      });
    }

    const messageIds = messages.map(m => m.id);
    const reactionMap: Record<string, Record<ReactionType, number>> = {};
    const userReactionMap: Record<string, ReactionType[]> = {};

    if (messageIds.length > 0) {
      try {
        const reactionsSnap = await getDocs(collection(db, 'reactions'));
        reactionsSnap.docs.forEach(d => {
          const r = d.data();
          if (messageIds.includes(r.message_id)) {
            if (!reactionMap[r.message_id]) {
              reactionMap[r.message_id] = { felt_this: 0, not_alone: 0, understand: 0, stayed_with_me: 0 };
            }
            const type = r.reaction_type as ReactionType;
            if (reactionMap[r.message_id][type] !== undefined) {
              reactionMap[r.message_id][type]++;
            }
            if (options.currentUserId && r.user_id === options.currentUserId) {
              if (!userReactionMap[r.message_id]) userReactionMap[r.message_id] = [];
              userReactionMap[r.message_id].push(type);
            }
          }
        });
      } catch (rErr) {
        console.error('Error fetching reactions:', rErr);
      }
    }

    return messages.map(m => ({
      ...m,
      user_id: m.user_id || `author-${m.id}`,
      reactions_count: reactionMap[m.id] || { felt_this: 0, not_alone: 0, understand: 0, stayed_with_me: 0 },
      user_reactions: userReactionMap[m.id] || [],
    }));
  } catch (err) {
    console.error('Error fetching anonymous feed from Firestore:', err);
    const msgs = getLocalMessages().filter(m => m.visibility === 'anonymous');
    return msgs.map(m => ({
      ...m,
      user_id: m.user_id || `author-${m.id}`,
      reactions_count: m.reactions_count || { felt_this: 0, not_alone: 0, understand: 0, stayed_with_me: 0 },
      user_reactions: m.user_reactions || [],
    }));
  }
}

/**
 * Create a new message (Private or Anonymous)
 */
export async function createUnsentMessage(params: {
  userId: string;
  content: string;
  visibility: 'private' | 'anonymous';
  recipientCategory?: RecipientCategory | null;
}): Promise<UnsentMessage> {
  const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowStr = new Date().toISOString();

  const newMsg: UnsentMessage = {
    id: msgId,
    user_id: params.userId,
    content: params.content,
    visibility: params.visibility,
    recipient_category: params.recipientCategory || null,
    created_at: nowStr,
    updated_at: nowStr,
    released_at: params.visibility === 'anonymous' ? nowStr : null,
    deleted_at: null,
  };

  try {
    await setDoc(doc(db, 'unsent_messages', msgId), newMsg);
    // Also save locally as backup
    const list = getLocalMessages();
    list.unshift(newMsg);
    saveLocalMessages(list);
    return newMsg;
  } catch (err) {
    console.error('Error creating message in Firestore:', err);
    const list = getLocalMessages();
    list.unshift(newMsg);
    saveLocalMessages(list);
    return newMsg;
  }
}

/**
 * Release an existing private message anonymously
 */
export async function releaseMessageAnonymously(messageId: string, userId: string): Promise<void> {
  const nowStr = new Date().toISOString();
  try {
    const ref = doc(db, 'unsent_messages', messageId);
    await updateDoc(ref, {
      visibility: 'anonymous',
      released_at: nowStr,
      updated_at: nowStr,
    });
  } catch (err) {
    console.error('Error releasing message in Firestore:', err);
  }

  const list = getLocalMessages();
  const item = list.find(m => m.id === messageId && m.user_id === userId);
  if (item) {
    item.visibility = 'anonymous';
    item.released_at = nowStr;
    item.updated_at = nowStr;
    saveLocalMessages(list);
  }
}

/**
 * Permanently delete a message
 */
export async function deleteMessage(messageId: string, userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'unsent_messages', messageId));
  } catch (err) {
    console.error('Error deleting message in Firestore:', err);
  }

  const list = getLocalMessages().filter(m => !(m.id === messageId && m.user_id === userId));
  saveLocalMessages(list);
}

/**
 * Toggle or add reaction to an anonymous message
 */
export async function toggleReaction(
  messageId: string,
  userId: string,
  reactionType: ReactionType,
  hasReacted: boolean
): Promise<void> {
  const reactionId = `${messageId}_${userId}_${reactionType}`;
  try {
    if (hasReacted) {
      await deleteDoc(doc(db, 'reactions', reactionId));
    } else {
      await setDoc(doc(db, 'reactions', reactionId), {
        id: reactionId,
        message_id: messageId,
        user_id: userId,
        reaction_type: reactionType,
        created_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Error toggling reaction in Firestore:', err);
  }
}

/**
 * Seal a new Time Capsule
 */
export async function createTimeCapsule(params: {
  userId: string;
  content: string;
  unlockAt: string;
}): Promise<TimeCapsule> {
  const capsuleId = `capsule-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowStr = new Date().toISOString();

  const newCapsule: TimeCapsule = {
    id: capsuleId,
    user_id: params.userId,
    content: params.content,
    unlock_at: params.unlockAt,
    created_at: nowStr,
    opened_at: null,
    sealed: true,
    reflection: null,
    would_send: null,
    updated_at: nowStr,
  };

  try {
    await setDoc(doc(db, 'time_capsules', capsuleId), newCapsule);
    const list = getLocalCapsules();
    list.unshift(newCapsule);
    saveLocalCapsules(list);
    return newCapsule;
  } catch (err) {
    console.error('Error creating capsule in Firestore:', err);
    const list = getLocalCapsules();
    list.unshift(newCapsule);
    saveLocalCapsules(list);
    return newCapsule;
  }
}

/**
 * Fetch user's time capsules
 */
export async function fetchTimeCapsules(userId: string): Promise<TimeCapsule[]> {
  if (!userId) return [];
  const now = new Date();

  try {
    const q = query(collection(db, 'time_capsules'), where('user_id', '==', userId));
    const snap = await getDocs(q);
    let capsules = snap.docs.map(d => ({ ...d.data(), id: d.id } as TimeCapsule));

    capsules.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return capsules.map(capsule => {
      const isUnlocked = new Date(capsule.unlock_at) <= now;
      if (!isUnlocked && capsule.sealed) {
        return {
          ...capsule,
          content: '🔒 SEALED TIME CAPSULE - Locked until ' + new Date(capsule.unlock_at).toLocaleDateString(),
        };
      }
      return capsule;
    });
  } catch (err) {
    console.error('Error fetching capsules from Firestore:', err);
    const list = getLocalCapsules().filter(c => c.user_id === userId);
    return list.map(capsule => {
      const isUnlocked = new Date(capsule.unlock_at) <= now;
      if (!isUnlocked && capsule.sealed) {
        return {
          ...capsule,
          content: '🔒 SEALED TIME CAPSULE - Locked until ' + new Date(capsule.unlock_at).toLocaleDateString(),
        };
      }
      return capsule;
    });
  }
}

/**
 * Unseal / Reflect on a Time Capsule
 */
export async function recordCapsuleReflection(
  capsuleId: string,
  userId: string,
  wouldSend: 'Yes' | 'No' | 'Not sure',
  reflection: string
): Promise<void> {
  const nowStr = new Date().toISOString();
  try {
    await updateDoc(doc(db, 'time_capsules', capsuleId), {
      opened_at: nowStr,
      sealed: false,
      would_send: wouldSend,
      reflection: reflection,
      updated_at: nowStr,
    });
  } catch (err) {
    console.error('Error updating capsule in Firestore:', err);
  }

  const list = getLocalCapsules();
  const cap = list.find(c => c.id === capsuleId && c.user_id === userId);
  if (cap) {
    cap.opened_at = nowStr;
    cap.sealed = false;
    cap.would_send = wouldSend;
    cap.reflection = reflection;
    saveLocalCapsules(list);
  }
}

/**
 * Save AI Analysis
 */
export async function saveAiAnalysis(
  userId: string,
  messageId: string | null,
  result: AiAnalysisResult
): Promise<AiAnalysis> {
  const analysisId = `ai-${Date.now()}`;
  const nowStr = new Date().toISOString();

  const analysis: AiAnalysis = {
    id: analysisId,
    user_id: userId,
    message_id: messageId,
    analysis_type: 'emotional_interpretation',
    result: result,
    created_at: nowStr,
  };

  try {
    await setDoc(doc(db, 'ai_analyses', analysisId), analysis);
  } catch (err) {
    console.error('Error saving AI analysis to Firestore:', err);
  }

  return analysis;
}

/**
 * Report an anonymous message
 */
export async function reportMessage(messageId: string, reporterId: string, reason: string, details?: string): Promise<void> {
  const reportId = `report-${Date.now()}`;
  try {
    await setDoc(doc(db, 'reports', reportId), {
      id: reportId,
      message_id: messageId,
      reporter_id: reporterId,
      reason: reason,
      details: details || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error reporting message in Firestore:', err);
  }
}

/**
 * Initial sample reviews to seed empty states
 */
const DEFAULT_SAMPLE_REVIEWS: FeedbackReview[] = [
  {
    id: 'sample-review-1',
    user_id: null,
    user_display_name: 'Solitary Observer',
    user_email: null,
    rating: 5,
    category: 'testimonial',
    title: 'A sanctuary for what never could be spoken',
    content: 'UNSENT provided a safe, quiet space to write words I had carried for five years. Reading how other souls hurt and heal reminded me I was never truly alone.',
    is_public: true,
    created_at: '2026-08-01T14:20:00.000Z',
    status: 'published',
    admin_reply: 'Thank you for trusting the vault with your unspoken reflections.',
    admin_replied_at: '2026-08-02T10:00:00.000Z',
  },
  {
    id: 'sample-review-2',
    user_id: null,
    user_display_name: 'Midnight Writer',
    user_email: null,
    rating: 5,
    category: 'experience',
    title: 'The typography and atmosphere are breathtaking',
    content: 'The distraction-free editor, the gentle burn release effect, and the anonymous resonance reactions create an emotional purity rarely found anywhere else online.',
    is_public: true,
    created_at: '2026-08-05T09:15:00.000Z',
    status: 'published',
  },
  {
    id: 'sample-review-3',
    user_id: null,
    user_display_name: 'Anonymous Healer',
    user_email: null,
    rating: 4,
    category: 'feature_request',
    title: 'Time capsules helped me reflect on my growth',
    content: 'Sealing a capsule to open a year later was one of the most therapeutic exercises. Would love to see an audio whisper or ambient sound mode in the future!',
    is_public: true,
    created_at: '2026-08-09T18:40:00.000Z',
    status: 'published',
  },
];

function getLocalFeedback(): FeedbackReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(DEFAULT_SAMPLE_REVIEWS));
      return DEFAULT_SAMPLE_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SAMPLE_REVIEWS;
  }
}

function saveLocalFeedback(feedback: FeedbackReview[]) {
  localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(feedback));
}

/**
 * Submit feedback or review
 */
export async function submitFeedbackReview(params: {
  user_id: string | null;
  user_display_name: string;
  user_email: string | null;
  rating: number;
  category: FeedbackCategory;
  title: string;
  content: string;
  is_public: boolean;
}): Promise<FeedbackReview> {
  const reviewId = `review-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowStr = new Date().toISOString();

  const newReview: FeedbackReview = {
    id: reviewId,
    user_id: params.user_id,
    user_display_name: params.user_display_name.trim() || 'Anonymous Writer',
    user_email: params.user_email || null,
    rating: Math.min(5, Math.max(1, params.rating)),
    category: params.category,
    title: params.title.trim() || 'Unspoken Reflection',
    content: params.content.trim(),
    is_public: params.is_public,
    created_at: nowStr,
    updated_at: nowStr,
    status: 'published',
  };

  try {
    await setDoc(doc(db, 'feedback_reviews', reviewId), newReview);
  } catch (err) {
    console.error('Error saving feedback/review in Firestore:', err);
  }

  // Update local storage
  const list = getLocalFeedback();
  list.unshift(newReview);
  saveLocalFeedback(list);

  return newReview;
}

/**
 * Fetch feedback & reviews
 */
export async function fetchFeedbackReviews(
  includePrivate = false,
  userEmail?: string | null
): Promise<FeedbackReview[]> {
  const isOwner = userEmail && userEmail.toLowerCase() === 'sultanharis655@gmail.com';

  try {
    let q;
    if (isOwner || includePrivate) {
      q = query(collection(db, 'feedback_reviews'), orderBy('created_at', 'desc'));
    } else {
      q = query(
        collection(db, 'feedback_reviews'),
        where('is_public', '==', true),
        orderBy('created_at', 'desc')
      );
    }

    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as FeedbackReview);
    }
  } catch (err) {
    console.error('Error fetching reviews from Firestore, using local data:', err);
  }

  const local = getLocalFeedback();
  if (isOwner || includePrivate) {
    return local;
  }
  return local.filter(r => r.is_public);
}

/**
 * Delete feedback/review (Author or Admin Owner)
 */
export async function deleteFeedbackReview(reviewId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'feedback_reviews', reviewId));
  } catch (err) {
    console.error('Error deleting review in Firestore:', err);
  }

  const list = getLocalFeedback().filter(r => r.id !== reviewId);
  saveLocalFeedback(list);
}

/**
 * Reply to feedback/review (Admin Owner)
 */
export async function replyToFeedbackReview(reviewId: string, reply: string): Promise<void> {
  const nowStr = new Date().toISOString();
  try {
    await updateDoc(doc(db, 'feedback_reviews', reviewId), {
      admin_reply: reply,
      admin_replied_at: nowStr,
    });
  } catch (err) {
    console.error('Error replying to review in Firestore:', err);
  }

  const list = getLocalFeedback().map(r => {
    if (r.id === reviewId) {
      return { ...r, admin_reply: reply, admin_replied_at: nowStr };
    }
    return r;
  });
  saveLocalFeedback(list);
}

// -------------------------------------------------------------
// OWNER & MASTER CONTROLLER (sultanharis655@gmail.com) METHODS
// -------------------------------------------------------------

const LOCAL_BANNED_USERS_KEY = 'unsent_local_banned_users';

function getLocalBannedUsers(): BannedUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_BANNED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBannedUsers(users: BannedUser[]) {
  localStorage.setItem(LOCAL_BANNED_USERS_KEY, JSON.stringify(users));
}

/**
 * Check if a user ID is banned
 */
export async function checkIfUserIsBanned(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const banDoc = await getDoc(doc(db, 'banned_users', userId));
    if (banDoc.exists()) {
      return true;
    }
  } catch (err) {
    console.error('Error checking ban status in Firestore:', err);
  }

  const localBanned = getLocalBannedUsers();
  return localBanned.some(u => u.user_id === userId);
}

/**
 * Ban a user by user ID (Owner only)
 */
export async function banUserAsOwner(
  userId: string,
  reason: string,
  email?: string | null,
  deleteUserPosts: boolean = false
): Promise<void> {
  if (!userId) return;
  const nowStr = new Date().toISOString();
  const banRecord: BannedUser = {
    id: userId,
    user_id: userId,
    email: email || null,
    reason: reason || 'Violation of community safety guidelines',
    banned_by: 'sultanharis655@gmail.com',
    created_at: nowStr,
  };

  try {
    await setDoc(doc(db, 'banned_users', userId), banRecord);

    // Also mark in profile if exists
    await setDoc(doc(db, 'profiles', userId), {
      is_banned: true,
      banned_at: nowStr,
      ban_reason: reason,
    }, { merge: true }).catch(() => {});

    if (deleteUserPosts) {
      const q = query(collection(db, 'unsent_messages'), where('user_id', '==', userId));
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    }
  } catch (err) {
    console.error('Error recording ban in Firestore:', err);
  }

  // Update local cache
  const list = getLocalBannedUsers().filter(u => u.user_id !== userId);
  list.unshift(banRecord);
  saveLocalBannedUsers(list);

  if (deleteUserPosts) {
    const msgs = getLocalMessages().filter(m => m.user_id !== userId);
    saveLocalMessages(msgs);
  }
}

/**
 * Unban a user (Owner only)
 */
export async function unbanUserAsOwner(userId: string): Promise<void> {
  if (!userId) return;
  try {
    await deleteDoc(doc(db, 'banned_users', userId));
    await setDoc(doc(db, 'profiles', userId), {
      is_banned: false,
      unbanned_at: new Date().toISOString(),
    }, { merge: true }).catch(() => {});
  } catch (err) {
    console.error('Error unbanning user in Firestore:', err);
  }

  const list = getLocalBannedUsers().filter(u => u.user_id !== userId);
  saveLocalBannedUsers(list);
}

/**
 * Delete any message across the platform (Owner only)
 */
export async function deleteMessageAsOwner(messageId: string): Promise<void> {
  if (!messageId) return;
  try {
    await deleteDoc(doc(db, 'unsent_messages', messageId));
  } catch (err) {
    console.error('Error deleting message as Owner in Firestore:', err);
  }

  // Also remove from local messages
  const list = getLocalMessages().filter(m => m.id !== messageId);
  saveLocalMessages(list);
}

/**
 * Fetch all platform messages for the Owner Moderation Center
 */
export async function fetchAllMessagesForOwner(maxCount: number = 100): Promise<UnsentMessage[]> {
  try {
    const q = query(
      collection(db, 'unsent_messages'),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as UnsentMessage));
    }
  } catch (err) {
    console.error('Error fetching all messages for owner in Firestore:', err);
  }

  return getLocalMessages();
}

/**
 * Fetch all platform reports for the Owner
 */
export async function fetchAllReportsForOwner(): Promise<Report[]> {
  try {
    const q = query(
      collection(db, 'reports'),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Report));
    }
  } catch (err) {
    console.error('Error fetching reports for owner in Firestore:', err);
  }

  return [];
}

/**
 * Fetch all banned users list (Owner only)
 */
export async function fetchAllBannedUsersForOwner(): Promise<BannedUser[]> {
  try {
    const q = query(
      collection(db, 'banned_users'),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as BannedUser));
    }
  } catch (err) {
    console.error('Error fetching banned users in Firestore:', err);
  }

  return getLocalBannedUsers();
}

/**
 * Update report status (Owner only)
 */
export async function resolveReportAsOwner(reportId: string, status: 'reviewed' | 'actioned'): Promise<void> {
  try {
    await updateDoc(doc(db, 'reports', reportId), {
      status,
      resolved_at: new Date().toISOString(),
      resolved_by: 'sultanharis655@gmail.com',
    });
  } catch (err) {
    console.error('Error resolving report in Firestore:', err);
  }
}

/**
 * Delete report (Owner only)
 */
export async function deleteReportAsOwner(reportId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'reports', reportId));
  } catch (err) {
    console.error('Error deleting report in Firestore:', err);
  }
}

/**
 * Fetch platform-wide telemetry and stats for Owner Dashboard
 */
export async function fetchOwnerStats(): Promise<OwnerStats> {
  let totalMessages = 0;
  let totalPrivate = 0;
  let totalAnonymous = 0;
  let totalCapsules = 0;
  let totalReports = 0;
  let totalBanned = 0;
  let totalReviews = 0;

  try {
    const [msgSnap, capSnap, repSnap, banSnap, revSnap] = await Promise.all([
      getDocs(collection(db, 'unsent_messages')).catch(() => null),
      getDocs(collection(db, 'time_capsules')).catch(() => null),
      getDocs(collection(db, 'reports')).catch(() => null),
      getDocs(collection(db, 'banned_users')).catch(() => null),
      getDocs(collection(db, 'feedback_reviews')).catch(() => null),
    ]);

    if (msgSnap) {
      totalMessages = msgSnap.size;
      msgSnap.docs.forEach(d => {
        const data = d.data();
        if (data.visibility === 'private') totalPrivate++;
        if (data.visibility === 'anonymous') totalAnonymous++;
      });
    }

    if (capSnap) totalCapsules = capSnap.size;
    if (repSnap) totalReports = repSnap.size;
    if (banSnap) totalBanned = banSnap.size;
    if (revSnap) totalReviews = revSnap.size;
  } catch (err) {
    console.error('Error calculating owner stats:', err);
  }

  return {
    totalMessages,
    totalPrivate,
    totalAnonymous,
    totalCapsules,
    totalReports,
    totalBanned,
    totalReviews,
  };
}


