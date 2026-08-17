import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  UserX, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  FileText, 
  Flag, 
  Lock, 
  Unlock, 
  MessageSquare,
  Activity,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { 
  UnsentMessage, 
  Report, 
  BannedUser, 
  OwnerStats 
} from '../../types';
import { 
  fetchOwnerStats, 
  fetchAllMessagesForOwner, 
  fetchAllReportsForOwner, 
  fetchAllBannedUsersForOwner, 
  deleteMessageAsOwner, 
  banUserAsOwner, 
  unbanUserAsOwner, 
  resolveReportAsOwner, 
  deleteReportAsOwner 
} from '../../services/db';
import { Modal } from '../ui/Modal';

interface OwnerControlPanelProps {
  ownerEmail: string;
}

export const OwnerControlPanel: React.FC<OwnerControlPanelProps> = ({ ownerEmail }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'bans' | 'reports' | 'stats'>('posts');
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [messages, setMessages] = useState<UnsentMessage[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Ban User Modal / Form State
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [targetUserEmail, setTargetUserEmail] = useState<string>('');
  const [banReason, setBanReason] = useState<string>('Violation of community guidelines');
  const [deleteUserPostsOnBan, setDeleteUserPostsOnBan] = useState<boolean>(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Confirm delete modal
  const [deleteModalPost, setDeleteModalPost] = useState<UnsentMessage | null>(null);
  const [banModalUser, setBanModalUser] = useState<{ id: string; email?: string } | null>(null);

  const loadOwnerData = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    try {
      const [statsData, msgsData, repsData, bansData] = await Promise.all([
        fetchOwnerStats(),
        fetchAllMessagesForOwner(150),
        fetchAllReportsForOwner(),
        fetchAllBannedUsersForOwner(),
      ]);

      setStats(statsData);
      setMessages(msgsData);
      setReports(repsData);
      setBannedUsers(bansData);
    } catch (err: any) {
      console.error('Error loading owner data:', err);
      setActionError('Failed to load owner telemetry: ' + (err?.message || 'Check Firestore rules'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOwnerData();
  }, [loadOwnerData]);

  const showSuccessNotice = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Delete message as owner
  const handleDeletePost = async (messageId: string) => {
    try {
      await deleteMessageAsOwner(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setDeleteModalPost(null);
      showSuccessNotice(`Post [${messageId.substring(0, 10)}...] permanently purged.`);
      loadOwnerData();
    } catch (err: any) {
      setActionError('Failed to delete post: ' + (err?.message || 'Permission denied'));
    }
  };

  // Ban user as owner
  const handleBanUser = async (userId: string, reason: string, email?: string, purgePosts: boolean = false) => {
    if (!userId.trim()) {
      setActionError('Please provide a valid User ID to ban.');
      return;
    }
    try {
      await banUserAsOwner(userId.trim(), reason.trim(), email?.trim() || null, purgePosts);
      setBanModalUser(null);
      setTargetUserId('');
      setTargetUserEmail('');
      showSuccessNotice(`User [${userId}] has been banned and added to the platform blacklist.`);
      loadOwnerData();
    } catch (err: any) {
      setActionError('Failed to ban user: ' + (err?.message || 'Permission denied'));
    }
  };

  // Unban user as owner
  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUserAsOwner(userId);
      setBannedUsers(prev => prev.filter(u => u.user_id !== userId));
      showSuccessNotice(`User [${userId}] has been unbanned.`);
      loadOwnerData();
    } catch (err: any) {
      setActionError('Failed to unban user: ' + (err?.message || 'Permission denied'));
    }
  };

  // Resolve / delete report
  const handleResolveReport = async (reportId: string, action: 'actioned' | 'dismissed') => {
    try {
      if (action === 'dismissed') {
        await deleteReportAsOwner(reportId);
        setReports(prev => prev.filter(r => r.id !== reportId));
        showSuccessNotice('Report dismissed.');
      } else {
        await resolveReportAsOwner(reportId, 'actioned');
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'actioned' } : r));
        showSuccessNotice('Report marked as actioned.');
      }
    } catch (err: any) {
      setActionError('Failed to handle report: ' + (err?.message || 'Error'));
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(m => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.content.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term) ||
      m.user_id.toLowerCase().includes(term) ||
      (m.recipient_category || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 bg-black border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Header bar */}
      <div className="relative z-10 border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-white text-black text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded tracking-widest flex items-center gap-1.5 shadow-lg">
              <ShieldAlert className="h-3 w-3" />
              MASTER OWNER ACCESS
            </span>
            <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase">
              {ownerEmail}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-white flex items-center gap-2.5">
            PLATFORM MASTER CONTROL CENTER
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Unrestricted administrator authority to purge content, blacklist users, and audit platform telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOwnerData}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono uppercase px-3.5 py-2 rounded-xl text-zinc-200 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC DATA</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-mono text-white flex items-center gap-2.5 shadow-lg">
          <CheckCircle className="h-4 w-4 shrink-0 text-white" />
          <span className="font-bold">{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-mono text-white flex items-center gap-2.5 shadow-lg">
          <AlertTriangle className="h-4 w-4 shrink-0 text-zinc-300" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Real-time Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-center">
          <span className="text-[9px] uppercase text-zinc-500 tracking-wider block mb-1">TOTAL POSTS</span>
          <span className="text-xl sm:text-2xl font-black text-white">{stats?.totalMessages ?? '...'}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-center">
          <span className="text-[9px] uppercase text-zinc-500 tracking-wider block mb-1">PUBLIC FEED</span>
          <span className="text-xl sm:text-2xl font-black text-white">{stats?.totalAnonymous ?? '...'}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-center">
          <span className="text-[9px] uppercase text-zinc-500 tracking-wider block mb-1">PRIVATE VAULT</span>
          <span className="text-xl sm:text-2xl font-black text-white">{stats?.totalPrivate ?? '...'}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-center">
          <span className="text-[9px] uppercase text-zinc-500 tracking-wider block mb-1">CAPSULES</span>
          <span className="text-xl sm:text-2xl font-black text-white">{stats?.totalCapsules ?? '...'}</span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-center">
          <span className="text-[9px] uppercase text-zinc-500 tracking-wider block mb-1">REPORTS</span>
          <span className="text-xl sm:text-2xl font-black text-white">
            {stats?.totalReports ?? '...'}
          </span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-center">
          <span className="text-[9px] uppercase text-zinc-500 tracking-wider block mb-1">BANNED USERS</span>
          <span className="text-xl sm:text-2xl font-black text-white">
            {stats?.totalBanned ?? '...'}
          </span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-center">
          <span className="text-[9px] uppercase text-zinc-500 tracking-wider block mb-1">REVIEWS</span>
          <span className="text-xl sm:text-2xl font-black text-white">{stats?.totalReviews ?? '...'}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-xl transition-colors font-bold uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>ALL POSTS MODERATION ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bans')}
          className={`px-4 py-2 rounded-xl transition-colors font-bold uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'bans'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
          }`}
        >
          <UserX className="h-3.5 w-3.5" />
          <span>BAN / BLACKLIST MANAGER ({bannedUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition-colors font-bold uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
          }`}
        >
          <Flag className="h-3.5 w-3.5" />
          <span>FLAGGED REPORTS ({reports.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL POSTS MODERATION */}
      {activeTab === 'posts' && (
        <div className="space-y-4 font-mono">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search all posts by content keyword, author User ID, message ID, or recipient category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-mono"
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-zinc-500 animate-pulse">
              SYNCING ALL DATABASE MESSAGES...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500 bg-black/40 border border-zinc-800/80 rounded-xl">
              NO POSTS MATCHING SEARCH QUERY.
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredMessages.map(msg => (
                <div
                  key={msg.id}
                  className="bg-black border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl space-y-3 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-900 text-white border border-zinc-700">
                        {msg.visibility}
                      </span>
                      {msg.recipient_category && (
                        <span className="text-zinc-400">
                          To: <strong className="text-zinc-200 font-normal">{msg.recipient_category}</strong>
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-600">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-mono">
                      Author UID: <span className="text-zinc-400 font-bold">{msg.user_id.substring(0, 12)}...</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-serif text-zinc-200 leading-relaxed font-light pl-2 border-l-2 border-zinc-800">
                    "{msg.content}"
                  </p>

                  <div className="pt-2 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[10px] text-zinc-500">
                      ID: <span className="text-zinc-400">{msg.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBanModalUser({ id: msg.user_id })}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white hover:text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded transition-colors uppercase"
                        title="Ban author from publishing"
                      >
                        <UserX className="h-3 w-3" />
                        <span>Ban Author</span>
                      </button>

                      <button
                        onClick={() => setDeleteModalPost(msg)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white hover:text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded transition-colors uppercase"
                        title="Permanently delete message as Owner"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BAN / BLACKLIST MANAGER */}
      {activeTab === 'bans' && (
        <div className="space-y-6 font-mono">
          {/* Ban new user form */}
          <div className="bg-black border border-zinc-800 p-4 sm:p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              BLACKLIST & BAN ANY USER
            </h3>
            <p className="text-xs text-zinc-400">
              Banning a user immediately revokes their ability to write letters, create time capsules, or post to the public feed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Target User ID (UID)</label>
                <input
                  type="text"
                  placeholder="e.g. 5x7ab198kd0..."
                  value={targetUserId}
                  onChange={e => setTargetUserId(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Target Email (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. badactor@example.com"
                  value={targetUserEmail}
                  onChange={e => setTargetUserEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 uppercase mb-1">Reason for Ban</label>
              <input
                type="text"
                placeholder="e.g. Harassment, Spamming, Hate speech, Malicious activity"
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deleteUserPostsOnBan}
                  onChange={e => setDeleteUserPostsOnBan(e.target.checked)}
                  className="rounded bg-black border-zinc-700 text-white accent-white"
                />
                <span>Also purge all existing messages authored by this user</span>
              </label>

              <button
                onClick={() => handleBanUser(targetUserId, banReason, targetUserEmail, deleteUserPostsOnBan)}
                className="bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-lg transition-colors flex items-center gap-2"
              >
                <UserX className="h-4 w-4" />
                <span>EXECUTE BAN & BLACKLIST</span>
              </button>
            </div>
          </div>

          {/* Currently banned users list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase">
              ACTIVE BLACKLIST / BANNED USERS ({bannedUsers.length})
            </h3>

            {bannedUsers.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 bg-black/40 border border-zinc-800 rounded-xl">
                NO USERS ARE CURRENTLY BANNED.
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {bannedUsers.map(u => (
                  <div
                    key={u.id || u.user_id}
                    className="bg-black border border-zinc-800 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          UID: {u.user_id}
                        </span>
                        {u.email && (
                          <span className="text-[11px] text-zinc-400">({u.email})</span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Reason: <span className="text-zinc-200">{u.reason}</span>
                      </p>
                      <p className="text-[10px] text-zinc-600">
                        Banned at: {new Date(u.created_at).toLocaleString()} by {u.banned_by}
                      </p>
                    </div>

                    <button
                      onClick={() => handleUnbanUser(u.user_id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 border border-white px-3 py-1.5 rounded-xl transition-colors uppercase self-start sm:self-auto"
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      <span>UNBAN USER</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FLAGGED REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4 font-mono">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span className="uppercase">Platform Content Reports</span>
            <span>{reports.length} Reports Logged</span>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500 bg-black/40 border border-zinc-800 rounded-xl">
              NO ACTIVE REPORTS PENDING. ALL CONTENT CLEAN.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="bg-black border border-zinc-800 p-4 rounded-xl space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-900 text-white border border-zinc-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                        {rep.reason}
                      </span>
                      <span className="text-zinc-500">
                        {new Date(rep.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[10px] text-zinc-400">
                      Report ID: {rep.id}
                    </div>
                  </div>

                  {rep.details && (
                    <p className="text-xs text-zinc-300 bg-zinc-900/60 p-2 rounded">
                      Details: "{rep.details}"
                    </p>
                  )}

                  <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                    <span>Target Message ID: <strong className="text-zinc-200">{rep.message_id}</strong></span>
                    <span>•</span>
                    <span>Reporter UID: <strong className="text-zinc-200">{rep.reporter_id.substring(0, 10)}...</strong></span>
                  </div>

                  <div className="pt-2 border-t border-zinc-900 flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismissed')}
                      className="text-[10px] font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded uppercase"
                    >
                      Dismiss Report
                    </button>

                    <button
                      onClick={() => handleDeletePost(rep.message_id)}
                      className="text-[10px] font-bold text-white hover:text-zinc-300 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded uppercase flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete Reported Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={Boolean(deleteModalPost)}
        onClose={() => setDeleteModalPost(null)}
        title="OWNER ACTION: PERMANENTLY PURGE MESSAGE"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <p className="uppercase text-white font-bold">
            Warning: As Platform Owner, you are about to permanently delete this message from Firestore database.
          </p>

          {deleteModalPost && (
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded font-serif text-sm text-zinc-100">
              "{deleteModalPost.content}"
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => setDeleteModalPost(null)}
              className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white uppercase"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteModalPost && handleDeletePost(deleteModalPost.id)}
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 font-bold uppercase shadow-lg"
            >
              PURGE MESSAGE NOW
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRM BAN MODAL */}
      <Modal
        isOpen={Boolean(banModalUser)}
        onClose={() => setBanModalUser(null)}
        title="OWNER ACTION: BAN AUTHOR"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <p className="uppercase text-white font-bold">
            Ban this author from writing or publishing on Unsent:
          </p>

          <p className="text-zinc-400">
            User ID: <strong className="text-white">{banModalUser?.id}</strong>
          </p>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase mb-1">Reason</label>
            <input
              type="text"
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-xs text-white"
            />
          </div>

          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={deleteUserPostsOnBan}
              onChange={e => setDeleteUserPostsOnBan(e.target.checked)}
              className="rounded bg-black border-zinc-700 text-white accent-white"
            />
            <span>Also purge all posts authored by this user</span>
          </label>

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => setBanModalUser(null)}
              className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white uppercase"
            >
              Cancel
            </button>
            <button
              onClick={() => banModalUser && handleBanUser(banModalUser.id, banReason, banModalUser.email, deleteUserPostsOnBan)}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase shadow-lg"
            >
              EXECUTE BAN
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
