import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Users, 
  MessageSquareQuote, 
  Moon, 
  Lock, 
  Unlock,
  Clock, 
  Feather, 
  Flag, 
  UserX, 
  Check,
  ShieldCheck,
  EyeOff,
  Sparkles,
  Waves,
  HeartHandshake,
  Copy,
  Send,
  Key,
  Terminal,
  Globe,
  RefreshCw,
  Sliders,
  ExternalLink,
  Flame,
  FileText,
  Trash2,
  ShieldAlert,
  Crown
} from 'lucide-react';
import { AppUser as User, isOwnerUser } from '../../hooks/useAuth';
import { ActiveTab, UnsentMessage, TimeCapsule, ReactionType } from '../../types';
import { fetchAnonymousFeed, fetchUserArchive, fetchTimeCapsules, toggleReaction, reportMessage, blockUser, releaseMessageAnonymously, deleteMessageAsOwner, banUserAsOwner } from '../../services/db';
import { SpatialThoughtField } from '../ui/SpatialThoughtField';
import { Modal } from '../ui/Modal';
import { ReactionButton } from '../ui/ReactionButton';

interface HomeViewProps {
  user: User | null;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ user, onNavigate, onOpenAuth }) => {
  // Community Feed State (Spotlight 1 message at a time)
  const [feed, setFeed] = useState<UnsentMessage[]>([]);
  const [feedIndex, setFeedIndex] = useState(0);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Time Capsules State
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [loadingCapsules, setLoadingCapsules] = useState(true);

  // User Personal Vault State
  const [userVaultFilter, setUserVaultFilter] = useState<'all' | 'private' | 'anonymous'>('all');
  const [userMessages, setUserMessages] = useState<UnsentMessage[]>([]);
  const [loadingVault, setLoadingVault] = useState(true);

  // Report & Block Modal State
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [blockAuthor, setBlockAuthor] = useState(true);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [blockNotification, setBlockNotification] = useState<string | null>(null);

  // Personal Vault Interactive States (Section 4)
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [releaseSuccessId, setReleaseSuccessId] = useState<string | null>(null);
  const [inspirationIndex, setInspirationIndex] = useState(0);

  const INSPIRATION_PROMPTS = [
    "To the person who taught me what heartbreak actually felt like...",
    "To my younger self before you made that one irreversible choice...",
    "To the stranger on the train whose smile stayed with me for years...",
    "To the friend I drifted away from without ever having a fight...",
    "To the person I couldn't find the right words to thank in time...",
  ];

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickRelease = async (messageId: string) => {
    if (!user) return;
    setReleasingId(messageId);
    try {
      await releaseMessageAnonymously(messageId, user.id);
      setReleaseSuccessId(messageId);
      loadVault();
      loadFeed();
      setTimeout(() => setReleaseSuccessId(null), 3000);
    } catch (err) {
      console.error('Failed to release message:', err);
    } finally {
      setReleasingId(null);
    }
  };

  // Load Community Feed
  const loadFeed = useCallback(async () => {
    try {
      const data = await fetchAnonymousFeed({ limit: 15, currentUserId: user?.id });
      setFeed(data);
    } catch (err) {
      console.error('Error loading anonymous feed:', err);
    } finally {
      setLoadingFeed(false);
    }
  }, [user]);

  // Load Time Capsules
  const loadCapsules = useCallback(async () => {
    if (!user) {
      setCapsules([]);
      setLoadingCapsules(false);
      return;
    }
    try {
      const data = await fetchTimeCapsules(user.id);
      setCapsules(data);
    } catch (err) {
      console.error('Error loading time capsules:', err);
    } finally {
      setLoadingCapsules(false);
    }
  }, [user]);

  // Load User Archive
  const loadVault = useCallback(async () => {
    if (!user) {
      setUserMessages([]);
      setLoadingVault(false);
      return;
    }
    try {
      const data = await fetchUserArchive(user.id, userVaultFilter);
      setUserMessages(data);
    } catch (err) {
      console.error('Error loading user archive:', err);
    } finally {
      setLoadingVault(false);
    }
  }, [user, userVaultFilter]);

  useEffect(() => {
    loadFeed();
    loadCapsules();
    loadVault();
  }, [loadFeed, loadCapsules, loadVault]);

  // Toggle Reaction on Spotlighted Community Message
  const handleToggleReaction = async (messageId: string, type: ReactionType) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    const targetMsg = feed[feedIndex];
    if (!targetMsg) return;

    const hasReacted = targetMsg.user_reactions?.includes(type) || false;

    // Optimistic UI update
    setFeed(prev => {
      const copy = [...prev];
      const item = { ...copy[feedIndex] };
      if (!item.reactions_count) {
        item.reactions_count = { felt_this: 0, not_alone: 0, understand: 0, stayed_with_me: 0 };
      }
      if (!item.user_reactions) item.user_reactions = [];

      if (hasReacted) {
        item.reactions_count[type] = Math.max(0, item.reactions_count[type] - 1);
        item.user_reactions = item.user_reactions.filter(r => r !== type);
      } else {
        item.reactions_count[type] = (item.reactions_count[type] || 0) + 1;
        item.user_reactions.push(type);
      }
      copy[feedIndex] = item;
      return copy;
    });

    try {
      await toggleReaction(messageId, user.id, type, hasReacted);
    } catch (err) {
      console.error('Reaction toggle failed:', err);
      loadFeed();
    }
  };

  const handleSendReport = async () => {
    if (!reportingMessageId) return;
    if (!user) {
      onOpenAuth();
      return;
    }

    try {
      const msgToReport = feed.find(m => m.id === reportingMessageId);
      if (msgToReport && blockAuthor) {
        await blockUser(msgToReport.user_id, user.id);
        setFeed(prev => prev.filter(m => m.user_id !== msgToReport.user_id));
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

  const currentSpotlight = feed[feedIndex] || null;

  return (
    <div className="relative text-white selection:bg-white selection:text-black">
      {/* SECTION 1: HERO (100vh Full Viewport Canvas) */}
      <section className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-20 pt-28 pb-16 overflow-hidden">
        {/* Floating Atmospheric Spatial Thought Fragments */}
        <SpatialThoughtField />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl my-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[clamp(44px,8vw,140px)] font-black tracking-tighter uppercase leading-[0.88] text-white font-sans">
              THE THINGS YOU<br />
              NEVER SENT.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-xl md:text-2xl text-zinc-400 font-serif font-light max-w-2xl leading-relaxed tracking-wide"
          >
            Some words don't need a recipient.<br />
            They just need somewhere to exist.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4"
          >
            <button
              onClick={() => onNavigate('write')}
              className="group relative inline-flex items-center gap-4 text-lg sm:text-xl md:text-2xl font-mono tracking-widest uppercase text-white hover:text-zinc-200 focus:outline-none"
            >
              <span className="relative z-10">WRITE SOMETHING</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-3">
                →
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white transform scale-x-100 transition-transform duration-300 origin-left group-hover:scale-x-110" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            SCROLL TO EXPLORE
          </span>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500">
            01 / 04
          </span>
        </div>
      </section>

      {/* SECTION 2: COMMUNITY (SPOTLIGHT FULL SCREEN) */}
      <section className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-20 py-24 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-between space-y-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block mb-2">
                SECTION 02 — COMMUNITY
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-white font-sans leading-none">
                THE THINGS<br />
                PEOPLE NEVER SENT.
              </h2>
            </div>

            <button
              onClick={() => onNavigate('discover')}
              className="text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700"
            >
              EXPLORE ALL RELEASES →
            </button>
          </div>

          {/* Spotlight Content Area */}
          <div className="my-auto py-12 min-h-[320px] flex flex-col justify-center">
            {loadingFeed ? (
              <div className="space-y-4 animate-pulse max-w-2xl">
                <div className="h-8 bg-zinc-900 rounded w-3/4" />
                <div className="h-8 bg-zinc-900 rounded w-1/2" />
              </div>
            ) : !currentSpotlight ? (
              /* Mandatory Fallback when zero messages exist */
              <div className="space-y-4 max-w-2xl">
                <p className="text-2xl sm:text-4xl md:text-5xl font-mono text-white tracking-tight uppercase leading-tight font-bold">
                  NO WORDS HAVE BEEN RELEASED YET.
                </p>
                <p className="text-base text-zinc-400 font-serif italic">
                  Someone has to be first.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => onNavigate('write')}
                    className="text-xs font-mono tracking-widest uppercase border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
                  >
                    RELEASE THE FIRST MESSAGE →
                  </button>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSpotlight.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8 max-w-4xl"
                >
                  {/* Category Pill and Action Header */}
                  <div className="flex items-center justify-between">
                    {currentSpotlight.recipient_category ? (
                      <span className="inline-block text-[11px] font-mono tracking-widest text-zinc-400 border border-zinc-800 px-3 py-1 uppercase">
                        TO: {currentSpotlight.recipient_category}
                      </span>
                    ) : <div />}

                    <div className="flex flex-wrap items-center gap-2">
                      {isOwnerUser(user) && (
                        <>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Owner Action: Ban this author and purge their posts?')) {
                                await banUserAsOwner(currentSpotlight.user_id, 'Banned via Home Spotlight by Owner', null, true);
                                setFeed(prev => prev.filter(m => m.user_id !== currentSpotlight.user_id));
                                setBlockNotification(`Author [${currentSpotlight.user_id.substring(0, 10)}...] banned by Owner.`);
                                setTimeout(() => setBlockNotification(null), 3500);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white hover:text-zinc-200 py-1 px-2.5 bg-zinc-900 border border-zinc-700 uppercase focus:outline-none transition-colors"
                            title="Owner: Ban author"
                          >
                            <UserX className="h-3 w-3 text-zinc-300" />
                            <span>BAN (OWNER)</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Owner Action: Permanently purge this post from Firestore?')) {
                                await deleteMessageAsOwner(currentSpotlight.id);
                                setFeed(prev => prev.filter(m => m.id !== currentSpotlight.id));
                                setBlockNotification('Post permanently deleted by Platform Owner.');
                                setTimeout(() => setBlockNotification(null), 3500);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white hover:text-zinc-200 py-1 px-2.5 bg-zinc-900 border border-zinc-700 uppercase focus:outline-none transition-colors"
                            title="Owner: Permanently delete post"
                          >
                            <Trash2 className="h-3 w-3 text-zinc-300" />
                            <span>DELETE (OWNER)</span>
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setBlockingUserId(currentSpotlight.user_id || `author-${currentSpotlight.id}`)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors py-1 px-3 border border-zinc-800 hover:border-zinc-600 uppercase focus:outline-none"
                        title="Block this author"
                      >
                        <UserX className="h-3.5 w-3.5 text-zinc-400" />
                        <span>BLOCK USER</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportingMessageId(currentSpotlight.id)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors py-1 px-3 border border-zinc-800 hover:border-zinc-500 uppercase focus:outline-none"
                        aria-label="Report post"
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span>REPORT POST</span>
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <p className="text-[clamp(22px,4vw,56px)] font-serif font-light text-zinc-100 leading-[1.25] tracking-tight whitespace-pre-wrap">
                    “{currentSpotlight.content}”
                  </p>

                  <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                    — ANONYMOUS
                  </p>

                  {/* Spring Animated Reaction Controls */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                    <ReactionButton
                      type="felt_this"
                      label="I FELT THIS"
                      count={currentSpotlight.reactions_count?.felt_this || 0}
                      isActive={Boolean(currentSpotlight.user_reactions?.includes('felt_this'))}
                      onClick={() => handleToggleReaction(currentSpotlight.id, 'felt_this')}
                      size="md"
                    />

                    <ReactionButton
                      type="not_alone"
                      label="YOU'RE NOT ALONE"
                      count={currentSpotlight.reactions_count?.not_alone || 0}
                      isActive={Boolean(currentSpotlight.user_reactions?.includes('not_alone'))}
                      onClick={() => handleToggleReaction(currentSpotlight.id, 'not_alone')}
                      size="md"
                    />

                    <ReactionButton
                      type="understand"
                      label="I UNDERSTAND"
                      count={currentSpotlight.reactions_count?.understand || 0}
                      isActive={Boolean(currentSpotlight.user_reactions?.includes('understand'))}
                      onClick={() => handleToggleReaction(currentSpotlight.id, 'understand')}
                      size="md"
                    />

                    <ReactionButton
                      type="stayed_with_me"
                      label="STAYED WITH ME"
                      count={currentSpotlight.reactions_count?.stayed_with_me || 0}
                      isActive={Boolean(currentSpotlight.user_reactions?.includes('stayed_with_me'))}
                      onClick={() => handleToggleReaction(currentSpotlight.id, 'stayed_with_me')}
                      size="md"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Controls & Pagination */}
          {feed.length > 0 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                SPOTLIGHT {String(feedIndex + 1).padStart(2, '0')} / {String(feed.length).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setFeedIndex(prev => (prev === 0 ? feed.length - 1 : prev - 1))}
                  className="p-3 border border-zinc-800 hover:border-white transition-colors text-white"
                  title="Previous release"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setFeedIndex(prev => (prev === feed.length - 1 ? 0 : prev + 1))}
                  className="p-3 border border-zinc-800 hover:border-white transition-colors text-white"
                  title="Next release"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: TIME CAPSULES */}
      <section className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-20 py-24 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto w-full space-y-12 my-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block mb-2">
                SECTION 03 — TIME VAULT
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-white font-sans leading-none">
                WORDS FOR<br />
                ANOTHER VERSION<br />
                OF YOU.
              </h2>
            </div>

            <button
              onClick={() => onNavigate('capsules')}
              className="text-xs font-mono tracking-widest uppercase text-white hover:text-zinc-300 transition-colors underline underline-offset-4 decoration-zinc-600"
            >
              SEAL A CAPSULE →
            </button>
          </div>

          {/* Suspended Capsules Visual Field */}
          <div className="py-8">
            {loadingCapsules ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 border border-zinc-800 p-6" />
                ))}
              </div>
            ) : capsules.length === 0 ? (
              <div className="p-12 border border-dashed border-zinc-800 text-center space-y-4">
                <p className="text-xl font-mono text-zinc-300 uppercase">NO SEALED CAPSULES YET.</p>
                <p className="text-xs text-zinc-500 font-serif italic max-w-sm mx-auto">
                  “Write something for your future self.”
                </p>
                <button
                  onClick={() => onNavigate('capsules')}
                  className="text-xs font-mono tracking-widest uppercase border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
                >
                  CREATE YOUR FIRST TIME CAPSULE →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {capsules.map((cap) => {
                  const unlockDate = new Date(cap.unlock_at);
                  const isUnlocked = unlockDate <= new Date();

                  return (
                    <motion.div
                      key={cap.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      onClick={() => onNavigate('capsules')}
                      className={`
                        p-6 border transition-all cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden group
                        ${isUnlocked
                          ? 'border-white bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                          : 'border-zinc-800 hover:border-zinc-500 bg-black'}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                          {isUnlocked ? 'READY TO UNSEAL' : 'SEALED ENVELOPE'}
                        </span>
                        <Lock className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-lg font-bold font-mono text-white tracking-wider">
                          FOR FUTURE ME
                        </p>
                        <p className="text-xs font-mono text-zinc-500">
                          UNLOCKS: {unlockDate.toLocaleDateString().toUpperCase()}
                        </p>
                      </div>

                      <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-[11px] font-mono text-zinc-400">
                        <span>OPEN VAULT</span>
                        <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: YOUR UNSENT (USER PERSONAL ARCHIVE) */}
      <section className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-20 py-24 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto w-full space-y-12 my-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-zinc-900 border border-zinc-700 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  SECTION 04 — PERSONAL VAULT
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline-block">
                  AES-256 ROW ISOLATION
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-white font-sans leading-none">
                YOUR UNSENT.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-serif font-light leading-relaxed">
                Your private haven of unsaid thoughts—safely encrypted in your vault or anonymously released into the world.
              </p>
            </div>

            {/* Filter Tabs & Quick Action */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                {[
                  { key: 'all', label: 'All', icon: FileText, count: userMessages.length },
                  { key: 'private', label: 'Private', icon: Lock, count: userMessages.filter(m => m.visibility === 'private').length },
                  { key: 'anonymous', label: 'Released', icon: Globe, count: userMessages.filter(m => m.visibility === 'anonymous').length },
                ].map(({ key, label, icon: Icon, count }) => (
                  <button
                    key={key}
                    onClick={() => setUserVaultFilter(key as any)}
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all rounded-md
                      ${userVaultFilter === key 
                        ? 'bg-white text-black font-bold shadow-sm' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}
                    `}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                    <span className={`text-[10px] px-1 rounded ${userVaultFilter === key ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('write')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded-md shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <span>+ Write New</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Vault Body */}
          <div className="min-h-[300px]">
            {!user ? (
              /* Unauthenticated / Guest Vault Hologram Box */
              <div className="relative p-8 sm:p-12 border border-zinc-800 bg-zinc-950/80 rounded-xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck className="h-40 w-40 text-white" />
                </div>

                <div className="relative z-10 max-w-xl space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-xs uppercase tracking-widest rounded-full">
                    <Terminal className="h-3.5 w-3.5 text-white" />
                    <span>SECURE VAULT ACCESS</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                      Your words belong to you alone.
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-sans font-light">
                      Sign in to unlock persistent multi-device encryption, sealed time-capsules, and the ability to release your unsaid thoughts to the community whenever you're ready.
                    </p>
                  </div>

                  {/* Terminal Simulation Snippet */}
                  <div className="p-3 bg-black border border-zinc-800 rounded font-mono text-[11px] text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between text-zinc-500 pb-1 border-b border-zinc-900">
                      <span>STATUS: ENCRYPTED STORAGE READY</span>
                      <span className="text-white font-bold">● ONLINE</span>
                    </div>
                    <p className="text-zinc-300">&gt; CIPHER: AES-GCM-256 BIT</p>
                    <p className="text-zinc-500">&gt; ZERO TRACKING // ZERO METADATA LOGS</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={onOpenAuth}
                      className="px-6 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded shadow-lg"
                    >
                      Sign In to Access Vault →
                    </button>
                    <button
                      onClick={() => onNavigate('write')}
                      className="px-6 py-3 border border-zinc-700 font-mono text-xs uppercase tracking-widest text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors rounded"
                    >
                      Write as Guest →
                    </button>
                  </div>
                </div>
              </div>
            ) : loadingVault ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-48 bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <div className="h-4 bg-zinc-900 rounded w-1/3" />
                    <div className="h-16 bg-zinc-900 rounded w-full" />
                    <div className="h-4 bg-zinc-900 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : userMessages.length === 0 ? (
              /* Empty State with Dynamic Inspiration Generator */
              <div className="p-8 sm:p-12 border border-dashed border-zinc-800 bg-zinc-950/40 rounded-xl text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                  <Feather className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif text-white">Your personal vault is quiet.</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md mx-auto">
                    You haven't stored any unsaid words yet. Start with a private letter that will stay locked in your vault forever.
                  </p>
                </div>

                {/* Inspiration Card Generator */}
                <div className="p-4 bg-black/60 border border-zinc-800/80 rounded-lg text-left space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-zinc-500">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Sparkles className="h-3 w-3 text-white" /> NEED INSPIRATION?
                    </span>
                    <button
                      onClick={() => setInspirationIndex(prev => (prev + 1) % INSPIRATION_PROMPTS.length)}
                      className="text-zinc-400 hover:text-white transition-colors underline"
                    >
                      CYCLE PROMPT ↺
                    </button>
                  </div>
                  <p className="text-sm font-serif italic text-zinc-200">
                    "{INSPIRATION_PROMPTS[inspirationIndex]}"
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('write')}
                    className="px-6 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded shadow-lg inline-flex items-center gap-2"
                  >
                    <span>Write Your First Unsent</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Populated Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userMessages.map((msg) => {
                  const isPrivate = msg.visibility === 'private';
                  const wordCount = msg.content.trim().split(/\s+/).length;
                  const charCount = msg.content.length;
                  const dateStr = new Date(msg.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <motion.article
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative p-6 bg-zinc-950/70 border border-zinc-800/90 hover:border-zinc-600 rounded-xl transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-[0_0_25px_rgba(255,255,255,0.03)]"
                    >
                      {/* Top Bar Metadata */}
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-900 pb-3 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          {msg.recipient_category && (
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
                              TO: {msg.recipient_category}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-zinc-500 tracking-wider">
                          {dateStr}
                        </span>
                      </div>

                      {/* Content Excerpt */}
                      <div className="space-y-2 my-auto">
                        <p className="text-base sm:text-lg font-serif text-zinc-200 leading-relaxed font-light line-clamp-4 group-hover:text-white transition-colors">
                          "{msg.content}"
                        </p>
                      </div>

                      {/* Reaction Counters (if public) */}
                      {!isPrivate && msg.reactions_count && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900/80">
                          {Object.entries(msg.reactions_count).map(([rType, count]) => {
                            const num = Number(count);
                            if (!num || num <= 0) return null;
                            const formattedLabel = rType.replace('_', ' ');
                            return (
                              <span
                                key={rType}
                                className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900/90 border border-zinc-800 rounded text-[10px] font-mono text-zinc-300 uppercase"
                              >
                                <Heart className="h-2.5 w-2.5 text-white fill-white/20" />
                                <span>{formattedLabel}:</span>
                                <span className="font-bold text-white">{num}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-900 text-xs font-mono text-zinc-500">
                        <span className="text-[10px]">
                          {wordCount} WORDS • {charCount} CHARS
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? (
                              <Check className="h-3.5 w-3.5 text-white" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {isPrivate && (
                            <button
                              type="button"
                              onClick={() => handleQuickRelease(msg.id)}
                              disabled={releasingId === msg.id}
                              className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-zinc-900 hover:bg-white hover:text-black text-zinc-300 border border-zinc-700 rounded transition-all inline-flex items-center gap-1"
                              title="Release anonymously to community feed"
                            >
                              <Send className="h-2.5 w-2.5" />
                              <span>{releasingId === msg.id ? 'Releasing...' : releaseSuccessId === msg.id ? 'Released!' : 'Release'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onNavigate('profile')}
                            className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group/btn"
                          >
                            <span>Manage</span>
                            <ArrowRight className="h-3 w-3 transform group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: PLATFORM OVERVIEW (INTERACTIVE ARCHITECTURAL STATIONS) */}
      <section className="relative w-full py-28 px-6 sm:px-12 md:px-20 bg-zinc-950 border-t border-white/10 text-white font-sans overflow-hidden">
        {/* Ambient Glow Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient from-white/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          {/* Main Section Header */}
          <div className="space-y-4 border-b border-zinc-800/80 pb-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.25em] uppercase bg-zinc-900 border border-zinc-700 text-zinc-300">
                PLATFORM ARCHITECTURE // PROTOCOL SPEC
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden md:inline-block">
                ZERO-KNOWLEDGE SANCTUARY
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-sans leading-none">
              A place for the things<br />
              you never sent.
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 font-serif font-light leading-relaxed max-w-3xl">
              UNSENT is engineered as an emotionally pure, cryptographically private sanctuary. Explore the interactive stations below to see how our privacy, anonymity, time locks, and resonance protocols operate.
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* STATION 01: ZERO-KNOWLEDGE PRIVATE VAULT */}
            <div className="p-8 border border-zinc-800 bg-black/70 hover:border-zinc-600 rounded-2xl transition-all duration-300 space-y-6 flex flex-col justify-between group shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-xs uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4" />
                    <span>01 / PRIVACY FIRST</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    AES-GCM-256
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
                  Zero-Knowledge Private Vault
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  When stored in your personal vault, your thoughts are protected by strict row-level isolation. Private letters are never indexed by web crawlers or exposed to other members.
                </p>
              </div>
            </div>

            {/* STATION 02: RADICAL ANONYMITY */}
            <div className="p-8 border border-zinc-800 bg-black/70 hover:border-zinc-600 rounded-2xl transition-all duration-300 space-y-6 flex flex-col justify-between group shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-xs uppercase tracking-wider">
                    <EyeOff className="h-4 w-4" />
                    <span>02 / RADICAL ANONYMITY</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    ZERO TELEMETRY
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
                  Release Without Judgment
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  When releasing words to the world, your real identity, email, and tracking signatures are completely stripped. Speak truthfully without social anxiety or public profiles.
                </p>
              </div>
            </div>

            {/* STATION 03: TIME CAPSULES */}
            <div className="p-8 border border-zinc-800 bg-black/70 hover:border-zinc-600 rounded-2xl transition-all duration-300 space-y-6 flex flex-col justify-between group shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-xs uppercase tracking-wider">
                    <Clock className="h-4 w-4" />
                    <span>03 / TIME VAULT</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    CHRONO-SEALED
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
                  Words for Your Future Self
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  Lock reflections, goals, or unsaid feelings inside chronologically sealed envelopes. The vault prevents early opening until the precise unlock date you designated arrives.
                </p>
              </div>
            </div>

            {/* STATION 04: SILENT EMPATHETIC RESONANCE */}
            <div className="p-8 border border-zinc-800 bg-black/70 hover:border-zinc-600 rounded-2xl transition-all duration-300 space-y-6 flex flex-col justify-between group shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-xs uppercase tracking-wider">
                    <HeartHandshake className="h-4 w-4" />
                    <span>04 / SILENT RESONANCE</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    NO TOXIC COMMENTS
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
                  Pure Empathy, Zero Noise
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  UNSENT replaces toxic public comment sections with pure, silent resonance reactions. Connect with other human souls through quiet acknowledgment.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

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
            <div className="p-3 border border-zinc-600 text-white flex items-center gap-2 uppercase">
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
                  setFeed(prev => prev.filter(m => m.user_id !== blockingUserId));
                  setBlockNotification('Author blocked. All their posts are now hidden.');
                  setBlockingUserId(null);
                  setTimeout(() => setBlockNotification(null), 3500);
                }
              }}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase transition-colors"
            >
              Block Author
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
