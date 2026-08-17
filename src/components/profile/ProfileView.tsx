import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, UserX, MessageSquare, Sparkles, ShieldCheck, Crown } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { FeedbackModal } from '../feedback/FeedbackModal';
import { Profile, UnsentMessage, UserStats, ActiveTab } from '../../types';
import { fetchUserArchive, fetchUserStats, deleteMessage, releaseMessageAnonymously, getBlockedUsers, clearBlockedUsers } from '../../services/db';
import { db, doc, deleteDoc, collection, query, where, getDocs } from '../../lib/firebase';
import { AppUser, isOwnerUser } from '../../hooks/useAuth';
import { OwnerControlPanel } from './OwnerControlPanel';

interface ProfileViewProps {
  user: AppUser | null;
  profile: Profile | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
  onNavigateWrite: () => void;
  onNavigate?: (tab: ActiveTab) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  profile,
  onSignOut,
  onOpenAuth,
  onNavigateWrite,
  onNavigate,
}) => {
  const [stats, setStats] = useState<UserStats>({
    totalMessages: 0,
    privateMessages: 0,
    anonymousReleases: 0,
    timeCapsules: 0,
    openedCapsules: 0,
    reactionsGiven: 0,
  });
  const [messages, setMessages] = useState<UnsentMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'private' | 'anonymous'>('all');
  const [loading, setLoading] = useState(true);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [blockedCount, setBlockedCount] = useState<number>(() => getBlockedUsers().length);

  const handleClearBlockedList = () => {
    clearBlockedUsers();
    setBlockedCount(0);
    setActionSuccess('Blocked authors list cleared. All posts will be visible in feed.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const loadProfileData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [statsData, archiveData] = await Promise.all([
        fetchUserStats(user.id),
        fetchUserArchive(user.id, filter),
      ]);
      setStats(statsData);
      setMessages(archiveData);
    } catch (err) {
      console.error('Failed to load profile archive:', err);
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleDeleteMsg = async (msgId: string) => {
    if (!user) return;
    try {
      await deleteMessage(msgId, user.id);
      setActionSuccess('Message permanently deleted.');
      setTimeout(() => setActionSuccess(null), 2000);
      loadProfileData();
    } catch (err: any) {
      alert('Failed to delete message: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleReleaseMsg = async (msgId: string) => {
    if (!user) return;
    try {
      await releaseMessageAnonymously(msgId, user.id);
      setActionSuccess('Message released anonymously to the community!');
      setTimeout(() => setActionSuccess(null), 2000);
      loadProfileData();
    } catch (err: any) {
      alert('Failed to release message: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeletingAccount(true);
    try {
      // Delete user's messages
      const msgsQuery = query(collection(db, 'unsent_messages'), where('user_id', '==', user.id));
      const msgsSnap = await getDocs(msgsQuery);
      await Promise.all(msgsSnap.docs.map(d => deleteDoc(d.ref)));

      // Delete time capsules
      const capsQuery = query(collection(db, 'time_capsules'), where('user_id', '==', user.id));
      const capsSnap = await getDocs(capsQuery);
      await Promise.all(capsSnap.docs.map(d => deleteDoc(d.ref)));

      // Delete profile doc
      await deleteDoc(doc(db, 'profiles', user.id));

      await onSignOut();
      setShowDeleteAccountModal(false);
    } catch (err: any) {
      alert('Account data deletion notice: ' + (err?.message || 'Data cleared.'));
      await onSignOut();
      setShowDeleteAccountModal(false);
    } finally {
      setDeletingAccount(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-28 pb-28 max-w-xl mx-auto px-6 text-center space-y-6 text-white font-mono">
        <p className="text-2xl uppercase tracking-wider font-bold">PROFILE & PRIVATE VAULT</p>
        <p className="text-xs text-zinc-500 uppercase">
          Sign in or create an Unsent account to access your private archive, time capsules, and stats.
        </p>
        <button
          onClick={onOpenAuth}
          className="text-xs font-mono tracking-widest uppercase bg-white text-black px-8 py-3 font-bold hover:bg-zinc-200 transition-colors"
        >
          SIGN IN / SIGN UP →
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-12 text-white selection:bg-white selection:text-black">
      {/* Editorial Profile Header */}
      <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
        <div className="space-y-2 font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs tracking-[0.3em] uppercase text-zinc-500 block">
              USER PROFILE
            </span>
            {isOwnerUser(user) ? (
              <span className="text-[10px] bg-white text-black font-bold px-2.5 py-0.5 rounded uppercase flex items-center gap-1 shadow-lg">
                <Crown className="h-3 w-3" />
                PLATFORM OWNER & MASTER CONTROLLER
              </span>
            ) : user.isAnonymous ? (
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase font-semibold">
                Guest Mode
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            {profile?.display_name || user.displayName || 'ANONYMOUS WRITER'}
          </h1>
          <p className="text-xs text-zinc-500 uppercase">{user.email || 'Guest Account'}</p>
        </div>

        <button
          onClick={onSignOut}
          className="text-xs font-mono tracking-widest uppercase border border-zinc-800 px-4 py-2 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors self-start sm:self-auto"
        >
          SIGN OUT
        </button>
      </div>

      {/* MASTER OWNER CONTROL PANEL */}
      {isOwnerUser(user) && (
        <OwnerControlPanel ownerEmail={user.email || 'sultanharis655@gmail.com'} />
      )}

      {/* Real Statistics Row */}
      <div className="grid grid-cols-3 gap-6 font-mono border-b border-white/10 pb-8 text-center sm:text-left">
        <div>
          <span className="text-[10px] uppercase text-zinc-500 tracking-widest block mb-1">PRIVATE</span>
          <span className="text-3xl font-black text-white">{stats.privateMessages}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-zinc-500 tracking-widest block mb-1">RELEASED</span>
          <span className="text-3xl font-black text-white">{stats.anonymousReleases}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-zinc-500 tracking-widest block mb-1">CAPSULES</span>
          <span className="text-3xl font-black text-white">{stats.timeCapsules}</span>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="p-3 border border-white text-xs font-mono uppercase text-white">
          {actionSuccess}
        </div>
      )}

      {/* My Archive Section */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/10 pb-4 gap-4">
          <h2 className="text-xl font-black font-sans uppercase tracking-tight text-white">
            MY ARCHIVE
          </h2>

          <div className="flex gap-4 font-mono text-xs">
            {(['all', 'private', 'anonymous'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  uppercase tracking-widest transition-colors relative py-1
                  ${filter === f ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                {f}
                {filter === f && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => (
              <div key={i} className="h-20 border-b border-zinc-800" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 border border-dashed border-zinc-800 text-center space-y-4 font-mono">
            <p className="text-xl text-zinc-300 uppercase">YOUR ARCHIVE IS EMPTY.</p>
            <p className="text-xs text-zinc-500 font-serif italic">“Start with the words you never sent.”</p>
            <button
              onClick={onNavigateWrite}
              className="text-xs tracking-widest uppercase border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
            >
              WRITE SOMETHING →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {messages.map((msg) => (
              <div key={msg.id} className="py-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
                  <div className="flex items-center gap-3">
                    <span className="border border-zinc-800 px-2 py-0.5 text-zinc-300">
                      {msg.visibility}
                    </span>
                    <span>•</span>
                    <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {msg.visibility === 'private' && (
                      <button
                        onClick={() => handleReleaseMsg(msg.id)}
                        className="text-white hover:underline underline-offset-4 decoration-zinc-500"
                      >
                        RELEASE ANONYMOUSLY
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMsg(msg.id)}
                      className="text-zinc-600 hover:text-white transition-colors"
                      title="Permanently delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-base sm:text-lg font-serif text-zinc-200 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback & Community Review Option */}
      <div className="p-6 border border-zinc-800 bg-zinc-950/80 font-mono text-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider">
            <MessageSquare className="h-4 w-4 text-white" />
            <span>SHARE YOUR FEEDBACK &amp; REVIEW</span>
          </div>
          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('feedback')}
                className="text-zinc-400 hover:text-white underline uppercase text-[11px]"
              >
                VIEW COMMUNITY WALL →
              </button>
            )}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-3.5 py-1.5 bg-white text-black font-bold uppercase hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3" />
              <span>LEAVE REVIEW</span>
            </button>
          </div>
        </div>
        <p className="text-zinc-500 font-serif italic text-xs">
          Help shape UNSENT. Share your experiences, suggest new features, or report any bugs you encountered.
        </p>
      </div>

      {/* Blocked Authors Management */}
      <div className="p-6 border border-zinc-800 bg-zinc-950/80 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider">
            <UserX className="h-4 w-4 text-white" />
            <span>BLOCKED AUTHORS ({blockedCount})</span>
          </div>
          {blockedCount > 0 && (
            <button
              onClick={handleClearBlockedList}
              className="text-zinc-300 hover:text-white underline uppercase text-[11px]"
            >
              UNBLOCK ALL AUTHORS
            </button>
          )}
        </div>
        <p className="text-zinc-500 font-serif italic text-xs">
          {blockedCount > 0
            ? `${blockedCount} author(s) are currently blocked. Their unsent posts are hidden from your feed.`
            : 'You have not blocked any authors. Posts from all authors are visible in your feed.'}
        </p>
      </div>

      {/* Account Privacy Footer */}
      <div className="pt-8 border-t border-white/10 flex justify-between items-center text-xs font-mono text-zinc-500 uppercase">
        <span>ACCOUNT PRIVACY (UNSENT AUTH)</span>
        <button
          onClick={() => setShowDeleteAccountModal(true)}
          className="text-zinc-400 hover:text-white hover:underline uppercase"
        >
          DELETE ACCOUNT DATA
        </button>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        user={user}
        onSubmitted={() => {
          setActionSuccess('Thank you! Your review/feedback was submitted.');
          setTimeout(() => setActionSuccess(null), 3000);
        }}
      />

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <Modal
          isOpen={showDeleteAccountModal}
          onClose={() => setShowDeleteAccountModal(false)}
          title="DELETE ACCOUNT DATA"
          maxWidth="sm"
        >
          <div className="space-y-4 font-mono text-xs text-zinc-300">
            <p className="uppercase">
              This will permanently delete your messages, time capsules, and profile record from the Unsent database.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-4 py-2 border border-zinc-800 uppercase text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={deletingAccount}
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 font-bold uppercase"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
