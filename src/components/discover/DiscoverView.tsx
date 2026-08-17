import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Flag, UserX, RefreshCw, AlertCircle, Check, Trash2, ShieldAlert, Crown } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ReactionButton } from '../ui/ReactionButton';
import { UnsentMessage, EmotionName, ReactionType } from '../../types';
import { fetchAnonymousFeed, toggleReaction, reportMessage, blockUser, deleteMessageAsOwner, banUserAsOwner } from '../../services/db';
import { AppUser as User, isOwnerUser } from '../../hooks/useAuth';

interface DiscoverViewProps {
  user: User | null;
  onOpenAuth: () => void;
  onNavigateWrite: () => void;
}

const CATEGORIES = [
  'All',
  'Someone I love',
  'An ex',
  'Friend',
  'Family',
  'Someone who hurt me',
  'Stranger',
  'Someone I never met',
  'Myself',
  'Regret',
  'Goodbye',
  'Hope',
  'Anger',
  'Forgiveness',
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({ user, onOpenAuth, onNavigateWrite }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [messages, setMessages] = useState<UnsentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [blockAuthor, setBlockAuthor] = useState(true);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [blockNotification, setBlockNotification] = useState<string | null>(null);

  // Owner specific states
  const isOwner = isOwnerUser(user);
  const [ownerDeletePost, setOwnerDeletePost] = useState<UnsentMessage | null>(null);
  const [ownerBanPost, setOwnerBanPost] = useState<UnsentMessage | null>(null);
  const [ownerBanReason, setOwnerBanReason] = useState<string>('Violation of platform guidelines');
  const [ownerBanPurgePosts, setOwnerBanPurgePosts] = useState<boolean>(true);
  const [ownerActionNotice, setOwnerActionNotice] = useState<string | null>(null);

  const handleOwnerDelete = async (messageId: string) => {
    try {
      await deleteMessageAsOwner(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setOwnerDeletePost(null);
      setOwnerActionNotice('Post permanently deleted by Platform Owner.');
      setTimeout(() => setOwnerActionNotice(null), 3500);
    } catch (err: any) {
      alert('Failed to delete post: ' + (err?.message || 'Error'));
    }
  };

  const handleOwnerBan = async (userId: string, reason: string, purgePosts: boolean) => {
    try {
      await banUserAsOwner(userId, reason, null, purgePosts);
      if (purgePosts) {
        setMessages(prev => prev.filter(m => m.user_id !== userId));
      }
      setOwnerBanPost(null);
      setOwnerActionNotice(`Author [${userId.substring(0, 10)}...] banned and blacklisted by Platform Owner.`);
      setTimeout(() => setOwnerActionNotice(null), 3500);
    } catch (err: any) {
      alert('Failed to ban author: ' + (err?.message || 'Error'));
    }
  };

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const feed = await fetchAnonymousFeed({
        emotion: activeCategory,
        limit: 30,
        currentUserId: user?.id,
      });
      setMessages(feed);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load community feed.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, user?.id]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleToggleReaction = async (messageId: string, reactionType: ReactionType) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    const userReactions = msg.user_reactions || [];
    const hasReacted = userReactions.includes(reactionType);

    // Optimistic UI update
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== messageId) return m;
        const currentCount = m.reactions_count?.[reactionType] || 0;
        const newCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;
        const newUserReactions = hasReacted
          ? userReactions.filter(r => r !== reactionType)
          : [...userReactions, reactionType];

        return {
          ...m,
          reactions_count: {
            ...(m.reactions_count || { felt_this: 0, not_alone: 0, understand: 0, stayed_with_me: 0 }),
            [reactionType]: newCount,
          },
          user_reactions: newUserReactions,
        };
      })
    );

    try {
      await toggleReaction(messageId, user.id, reactionType, hasReacted);
    } catch (err) {
      console.error('Reaction update failed, reverting:', err);
      loadFeed();
    }
  };

  const handleSendReport = async () => {
    if (!reportingMessageId || !user) {
      if (!user) onOpenAuth();
      return;
    }

    try {
      const msgToReport = messages.find(m => m.id === reportingMessageId);
      if (msgToReport && blockAuthor) {
        await blockUser(msgToReport.user_id, user.id);
        setMessages(prev => prev.filter(m => m.user_id !== msgToReport.user_id));
      }

      await reportMessage(reportingMessageId, user.id, reportReason, reportDetails);
      setReportSuccess(blockAuthor ? 'Report submitted and author blocked.' : 'Report submitted for review. Thank you.');
      setTimeout(() => {
        setReportSuccess(null);
        setReportingMessageId(null);
        setReportDetails('');
      }, 2000);
    } catch (err: any) {
      alert('Failed to submit report: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-10 text-white selection:bg-white selection:text-black">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
        <div className="space-y-3">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block">
            COMMUNITY FEED
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-sans leading-none">
            THE THINGS<br />PEOPLE NEVER SENT.
          </h1>
        </div>

        {/* Premium Subtle Action Link */}
        <button
          onClick={onNavigateWrite}
          className="group relative inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-white hover:text-zinc-200 py-1 transition-colors self-start sm:self-auto shrink-0 focus:outline-none"
        >
          <span className="relative z-10 font-bold">WRITE & PUBLISH UNSENT</span>
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 font-bold">→</span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white group-hover:bg-zinc-300 transition-colors" />
        </button>
      </div>

      {/* Categories Filter Bar (Horizontal Scroll without scrollbars) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 border-b border-white/10 no-scrollbar touch-pan-x">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                text-xs font-mono tracking-widest uppercase px-3.5 py-1.5 transition-all shrink-0 focus:outline-none
                ${isActive
                  ? 'bg-white text-black font-bold border border-white'
                  : 'text-zinc-500 hover:text-white border border-zinc-800/80 hover:border-zinc-600'}
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notifications */}
      {blockNotification && (
        <div className="p-3 border border-zinc-700 bg-zinc-900 text-xs font-mono uppercase text-white flex items-center gap-2">
          <UserX className="h-4 w-4 shrink-0 text-zinc-300" />
          <span>{blockNotification}</span>
        </div>
      )}

      {ownerActionNotice && (
        <div className="p-3 border border-white bg-zinc-900 text-xs font-mono uppercase text-white flex items-center gap-2 shadow-xl">
          <ShieldAlert className="h-4 w-4 shrink-0 text-white" />
          <span className="font-bold">{ownerActionNotice}</span>
        </div>
      )}

      {/* Owner Badge Notice */}
      {isOwner && (
        <div className="p-3 bg-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-white">
            <Crown className="h-4 w-4 text-white" />
            <span className="font-bold uppercase tracking-wider">PLATFORM OWNER ACTIVE: SULTANHARIS655@GMAIL.COM</span>
          </div>
          <span className="text-[10px] text-zinc-400 uppercase hidden sm:inline">
            Direct Post Deletion & User Banning enabled on all cards
          </span>
        </div>
      )}

      {/* Feed Content */}
      {loading ? (
        <div className="space-y-8 animate-pulse pt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4 border-b border-zinc-900 pb-8">
              <div className="h-4 bg-zinc-900 w-1/4 rounded" />
              <div className="h-16 bg-zinc-900 w-full rounded" />
              <div className="h-6 bg-zinc-900 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : errorMsg ? (
        <div className="p-8 border border-zinc-800 text-center space-y-3 bg-zinc-950/40">
          <AlertCircle className="h-5 w-5 text-white mx-auto" />
          <p className="text-xs text-zinc-300 font-mono uppercase tracking-wider">{errorMsg}</p>
          <button
            onClick={loadFeed}
            className="text-xs font-mono uppercase tracking-widest border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
          >
            RETRY FEED
          </button>
        </div>
      ) : messages.length === 0 ? (
        /* Empty State */
        <div className="py-16 border border-dashed border-zinc-800 text-center space-y-4">
          <p className="text-lg sm:text-xl font-mono text-zinc-300 uppercase tracking-widest font-bold">
            NO WORDS HAVE BEEN RELEASED YET.
          </p>
          <p className="text-xs text-zinc-500 font-serif italic">Someone has to be first.</p>
          <button
            onClick={onNavigateWrite}
            className="text-xs font-mono tracking-widest uppercase border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
          >
            RELEASE FIRST ANONYMOUS THOUGHT →
          </button>
        </div>
      ) : (
        /* Streamlined Editorial Messages Feed */
        <div className="space-y-8 md:space-y-10 divide-y divide-zinc-900">
          {messages.map((msg, index) => (
            <div key={msg.id} className={index === 0 ? 'space-y-4' : 'pt-8 md:pt-10 space-y-4'}>
              {/* Post Metadata Header */}
              <div className="flex items-start justify-between text-xs font-mono">
                <div className="space-y-1">
                  <span className="block text-zinc-300 font-semibold tracking-[0.25em] uppercase text-[11px]">
                    {msg.recipient_category || 'ANONYMOUS'}
                  </span>
                  <span className="block text-[10px] text-zinc-500 tracking-widest uppercase">
                    {new Date(msg.released_at || msg.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Action Buttons: BLOCK USER, REPORT, & OWNER ACTIONS */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Master Owner Controls */}
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={() => setOwnerBanPost(msg)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white hover:text-zinc-300 py-1 px-2 bg-zinc-900 border border-zinc-700 uppercase focus:outline-none transition-colors shadow-sm"
                        title="Owner: Ban author"
                      >
                        <UserX className="h-3 w-3 text-white" />
                        <span>BAN AUTHOR (OWNER)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOwnerDeletePost(msg)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white hover:text-zinc-300 py-1 px-2 bg-zinc-900 border border-zinc-700 uppercase focus:outline-none transition-colors shadow-sm"
                        title="Owner: Permanently delete post"
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                        <span>DELETE (OWNER)</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setBlockingUserId(msg.user_id || `author-${msg.id}`)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors py-1 px-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 uppercase focus:outline-none"
                    title="Block this author"
                  >
                    <UserX className="h-3.5 w-3.5 text-zinc-400" />
                    <span>BLOCK USER</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportingMessageId(msg.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors py-1 px-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 uppercase focus:outline-none"
                    aria-label="Report post"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>REPORT</span>
                  </button>
                </div>
              </div>

              {/* Message Typography */}
              <div className="py-2">
                <p className="text-xl sm:text-2xl md:text-3xl font-serif text-zinc-100 leading-relaxed font-light tracking-wide">
                  “{msg.content}”
                </p>
              </div>

              {/* Spring Animated Reaction Controls */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <ReactionButton
                  type="felt_this"
                  label="I FELT THIS"
                  count={msg.reactions_count?.felt_this || 0}
                  isActive={Boolean(msg.user_reactions?.includes('felt_this'))}
                  onClick={() => handleToggleReaction(msg.id, 'felt_this')}
                  size="sm"
                />

                <ReactionButton
                  type="not_alone"
                  label="YOU'RE NOT ALONE"
                  count={msg.reactions_count?.not_alone || 0}
                  isActive={Boolean(msg.user_reactions?.includes('not_alone'))}
                  onClick={() => handleToggleReaction(msg.id, 'not_alone')}
                  size="sm"
                />

                <ReactionButton
                  type="understand"
                  label="I UNDERSTAND"
                  count={msg.reactions_count?.understand || 0}
                  isActive={Boolean(msg.user_reactions?.includes('understand'))}
                  onClick={() => handleToggleReaction(msg.id, 'understand')}
                  size="sm"
                />

                <ReactionButton
                  type="stayed_with_me"
                  label="STAYED WITH ME"
                  count={msg.reactions_count?.stayed_with_me || 0}
                  isActive={Boolean(msg.user_reactions?.includes('stayed_with_me'))}
                  onClick={() => handleToggleReaction(msg.id, 'stayed_with_me')}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={Boolean(reportingMessageId)}
        onClose={() => setReportingMessageId(null)}
        title="REPORT CONTENT"
        maxWidth="sm"
      >
        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <p className="uppercase">Select a reason for reporting:</p>

          {reportSuccess ? (
            <div className="p-3 border border-zinc-700 bg-zinc-900 text-white flex items-center gap-2 uppercase">
              <Check className="h-4 w-4 text-white" />
              <span>{reportSuccess}</span>
            </div>
          ) : (
            <>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-black border border-zinc-700 p-3 text-xs text-white focus:outline-none uppercase"
              >
                <option value="harassment">Harassment / Bullying</option>
                <option value="threats">Threats of violence</option>
                <option value="hate">Hate speech</option>
                <option value="self_harm">Self-harm content</option>
                <option value="spam">Spam or advertisement</option>
                <option value="other">Other</option>
              </select>

              <textarea
                placeholder="Additional details (optional)..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={3}
                className="w-full bg-black border border-zinc-700 p-3 text-xs text-white focus:outline-none resize-none font-sans"
              />

              <label className="flex items-center gap-2.5 cursor-pointer pt-1 text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={blockAuthor}
                  onChange={(e) => setBlockAuthor(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-black text-white focus:ring-0 accent-white"
                />
                <span className="uppercase text-[11px] font-mono tracking-wide text-zinc-200">
                  Block author (hide all posts from this user)
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setReportingMessageId(null)}
                  className="px-4 py-2 border border-zinc-800 uppercase hover:border-zinc-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReport}
                  className="px-4 py-2 bg-white text-black font-bold uppercase hover:bg-zinc-200"
                >
                  Submit Report
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
      {/* Dedicated Block User Modal */}
      <Modal
        isOpen={Boolean(blockingUserId)}
        onClose={() => setBlockingUserId(null)}
        title="BLOCK USER"
        maxWidth="sm"
      >
        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-3 text-white border-b border-zinc-800 pb-3">
            <UserX className="h-5 w-5 shrink-0 text-white" />
            <span className="font-bold uppercase tracking-wider text-sm">BLOCK THIS ANONYMOUS AUTHOR?</span>
          </div>

          <p className="font-sans text-zinc-300 leading-relaxed text-sm">
            All current and future unsent posts from this author will be immediately hidden from your Discover feed and Home spotlight.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setBlockingUserId(null)}
              className="px-4 py-2 border border-zinc-800 uppercase hover:border-zinc-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (blockingUserId) {
                  await blockUser(blockingUserId, user?.id);
                  setMessages(prev => prev.filter(m => m.user_id !== blockingUserId));
                  setBlockNotification('Author blocked. All their posts are now hidden.');
                  setBlockingUserId(null);
                  setTimeout(() => setBlockNotification(null), 3500);
                }
              }}
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 font-bold uppercase transition-colors"
            >
              Block Author
            </button>
          </div>
        </div>
      </Modal>

      {/* OWNER: Delete Post Modal */}
      <Modal
        isOpen={Boolean(ownerDeletePost)}
        onClose={() => setOwnerDeletePost(null)}
        title="OWNER: PERMANENTLY PURGE POST"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-3 text-white border-b border-zinc-800 pb-3">
            <Trash2 className="h-5 w-5 shrink-0 text-white" />
            <span className="font-bold uppercase tracking-wider text-sm">
              PERMANENTLY PURGE POST FROM FIRESTORE
            </span>
          </div>

          <p className="text-zinc-400">
            As Platform Owner (<strong>sultanharis655@gmail.com</strong>), you are deleting this message across the entire platform.
          </p>

          {ownerDeletePost && (
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded font-serif text-sm text-zinc-200">
              "{ownerDeletePost.content}"
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setOwnerDeletePost(null)}
              className="px-4 py-2 border border-zinc-800 uppercase hover:border-zinc-500 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => ownerDeletePost && handleOwnerDelete(ownerDeletePost.id)}
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 font-bold uppercase shadow-lg"
            >
              PURGE POST NOW
            </button>
          </div>
        </div>
      </Modal>

      {/* OWNER: Ban Author Modal */}
      <Modal
        isOpen={Boolean(ownerBanPost)}
        onClose={() => setOwnerBanPost(null)}
        title="OWNER: BAN & BLACKLIST AUTHOR"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-3 text-white border-b border-zinc-800 pb-3">
            <UserX className="h-5 w-5 shrink-0 text-white" />
            <span className="font-bold uppercase tracking-wider text-sm">
              BAN USER FROM PLATFORM
            </span>
          </div>

          <p className="text-zinc-400">
            Author UID: <strong className="text-white">{ownerBanPost?.user_id}</strong>
          </p>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase mb-1">Reason for Ban</label>
            <input
              type="text"
              value={ownerBanReason}
              onChange={e => setOwnerBanReason(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ownerBanPurgePosts}
              onChange={e => setOwnerBanPurgePosts(e.target.checked)}
              className="rounded bg-black border-zinc-700 text-white accent-white"
            />
            <span>Also purge all posts authored by this user from public feed</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setOwnerBanPost(null)}
              className="px-4 py-2 border border-zinc-800 uppercase hover:border-zinc-500 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => ownerBanPost && handleOwnerBan(ownerBanPost.user_id, ownerBanReason, ownerBanPurgePosts)}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase shadow-lg"
            >
              EXECUTE BAN NOW
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
