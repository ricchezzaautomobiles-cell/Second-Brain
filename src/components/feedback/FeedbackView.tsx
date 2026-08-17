import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  MessageSquare,
  Sparkles,
  Shield,
  Trash2,
  CornerDownRight,
  Send,
  Filter,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { AppUser, isOwnerUser } from '../../hooks/useAuth';
import { FeedbackCategory, FeedbackReview } from '../../types';
import {
  fetchFeedbackReviews,
  deleteFeedbackReview,
  replyToFeedbackReview
} from '../../services/db';
import { FeedbackModal } from './FeedbackModal';

interface FeedbackViewProps {
  user: AppUser | null;
  onOpenAuth: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ user, onOpenAuth }) => {
  const [reviews, setReviews] = useState<FeedbackReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [adminViewAll, setAdminViewAll] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const isOwner = isOwnerUser(user);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFeedbackReviews(adminViewAll && isOwner, user?.email);
      setReviews(data);
    } catch (err) {
      console.error('Error loading feedback & reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [adminViewAll, isOwner, user?.email]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Aggregate Metrics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
      : '5.0';

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    percentage:
      totalReviews > 0
        ? Math.round((reviews.filter((r) => r.rating === s).length / totalReviews) * 100)
        : 0,
  }));

  // Filtering
  const filteredReviews = reviews.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) {
      return false;
    }
    if (selectedRatingFilter !== 'all' && r.rating !== selectedRatingFilter) {
      return false;
    }
    return true;
  });

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review/feedback?')) return;
    try {
      await deleteFeedbackReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setNotification('Review deleted successfully.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    try {
      await replyToFeedbackReview(reviewId, replyText.trim());
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, admin_reply: replyText.trim(), admin_replied_at: new Date().toISOString() }
            : r
        )
      );
      setReplyingId(null);
      setReplyText('');
      setNotification('Response posted to review.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setReplySubmitting(false);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'ALL REVIEWS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'testimonial', label: 'TESTIMONIALS' },
    { id: 'feature_request', label: 'FEATURE IDEAS' },
    { id: 'bug_report', label: 'BUG REPORTS' },
    { id: 'general', label: 'GENERAL' },
  ];

  return (
    <div className="min-h-screen bg-black text-[#FAFAFA] pt-28 pb-24 px-6 sm:px-10 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pb-12 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          <MessageSquare className="h-3 w-3 text-white" />
          <span>COMMUNITY FEEDBACK &amp; REVIEWS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
          Wall of Reflections &amp; Reviews
        </h1>

        <p className="text-sm sm:text-base font-serif italic text-zinc-400 leading-relaxed max-w-xl mx-auto">
          Honest words, experiences, and suggestions from writers, visitors, and souls who entrusted their unspoken thoughts to the vault.
        </p>

        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Leave a Review / Feedback</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="my-6 p-3.5 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-white" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-zinc-500 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Rating Breakdown & Stats Module */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-12 p-8 bg-zinc-950/80 border border-zinc-800">
        {/* Big Score Block */}
        <div className="md:col-span-4 flex flex-col justify-center items-center text-center md:border-r md:border-zinc-800/80 pr-0 md:pr-8">
          <div className="text-6xl sm:text-7xl font-serif font-light text-white tracking-tight">
            {averageRating}
          </div>
          <div className="flex items-center gap-1 my-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 fill-white text-white"
              />
            ))}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Based on {totalReviews} community {totalReviews === 1 ? 'reflection' : 'reflections'}
          </span>
        </div>

        {/* Star Rating Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5 pl-0 md:pl-4 font-mono text-xs">
          {starCounts.map(({ star, count, percentage }) => (
            <button
              key={star}
              onClick={() =>
                setSelectedRatingFilter((prev) => (prev === star ? 'all' : star))
              }
              className={`flex items-center gap-3 w-full group text-left transition-opacity ${
                selectedRatingFilter !== 'all' && selectedRatingFilter !== star
                  ? 'opacity-40 hover:opacity-100'
                  : 'opacity-100'
              }`}
            >
              <div className="flex items-center gap-1 w-12 text-zinc-400 group-hover:text-white">
                <span>{star}</span>
                <Star className="h-3 w-3 fill-white text-white" />
              </div>
              <div className="flex-1 h-2 bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-16 text-right text-zinc-500 group-hover:text-zinc-300">
                {count} ({percentage}%)
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Admin Owner Bar */}
      {isOwner && (
        <div className="mb-8 p-4 bg-zinc-900 border border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-white">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-white" />
            <span className="font-bold uppercase tracking-wider">
              ADMINISTRATOR MODE (sultanharis655@gmail.com)
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={adminViewAll}
              onChange={(e) => setAdminViewAll(e.target.checked)}
              className="accent-white"
            />
            <span>Include Private Creator Feedback</span>
          </label>
        </div>
      )}

      {/* Filter Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 border transition-all uppercase tracking-wider ${
                  isActive
                    ? 'border-white bg-white text-black font-bold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {selectedRatingFilter !== 'all' && (
            <button
              onClick={() => setSelectedRatingFilter('all')}
              className="text-[11px] font-mono text-white hover:underline uppercase"
            >
              Clear Star Filter ({selectedRatingFilter}★)
            </button>
          )}
          <button
            onClick={loadReviews}
            disabled={loading}
            className="p-2 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
            title="Refresh reviews"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reviews Grid / Feed */}
      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
            <p className="uppercase tracking-widest">LOADING REFLECTIONS &amp; REVIEWS...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-dashed border-zinc-800 p-8">
            <MessageSquare className="h-8 w-8 mx-auto text-zinc-600" />
            <h3 className="text-lg font-serif text-zinc-300">No reviews found in this filter</h3>
            <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
              Be the first to share your thoughts or review for this category.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 border border-zinc-700 font-mono text-xs uppercase text-white hover:bg-white hover:text-black transition-colors"
            >
              Write Review
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const canManage = isOwner || (user && review.user_id === user.id);
            const categoryLabels: Record<FeedbackCategory, string> = {
              experience: 'EXPERIENCE',
              testimonial: 'TESTIMONIAL',
              feature_request: 'FEATURE IDEA',
              bug_report: 'BUG REPORT',
              general: 'COMMUNITY THOUGHT',
            };

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 sm:p-8 bg-zinc-950 border transition-all ${
                  !review.is_public
                    ? 'border-zinc-700 bg-zinc-900/50'
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Review Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-3">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= review.rating
                              ? 'fill-white text-white'
                              : 'text-zinc-800'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 border border-zinc-800 text-zinc-400 uppercase tracking-widest">
                      {categoryLabels[review.category] || 'REVIEW'}
                    </span>

                    {!review.is_public && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-white uppercase tracking-widest flex items-center gap-1">
                        <EyeOff className="h-3 w-3 text-white" />
                        <span>Private Creator Feedback</span>
                      </span>
                    )}
                  </div>

                  {/* Actions (Delete/Reply) */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString()
                        : 'RECENT'}
                    </span>

                    {canManage && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1 text-zinc-500 hover:text-white transition-colors ml-2"
                        title="Delete review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Body */}
                <div className="py-4 space-y-2">
                  {review.title && (
                    <h3 className="text-base sm:text-lg font-serif font-medium text-white">
                      {review.title}
                    </h3>
                  )}
                  <p className="text-sm sm:text-base font-serif italic text-zinc-300 leading-relaxed whitespace-pre-wrap font-light">
                    "{review.content}"
                  </p>
                </div>

                {/* Author Signature */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-900 text-xs font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-medium uppercase tracking-wider">
                      &mdash; {review.user_display_name || 'Anonymous Writer'}
                    </span>
                    {review.user_id && (
                      <span className="text-[9px] text-zinc-500 border border-zinc-800 px-1.5 py-0.2 uppercase">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Admin Reply Action Button */}
                  {isOwner && !review.admin_reply && replyingId !== review.id && (
                    <button
                      onClick={() => {
                        setReplyingId(review.id);
                        setReplyText('');
                      }}
                      className="text-white hover:text-zinc-300 text-[11px] font-mono uppercase underline flex items-center gap-1"
                    >
                      <CornerDownRight className="h-3 w-3" />
                      <span>Reply as Creator</span>
                    </button>
                  )}
                </div>

                {/* Admin Reply Box (Displayed) */}
                {review.admin_reply && (
                  <div className="mt-4 p-4 bg-zinc-900/60 border-l-2 border-white pl-4 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      <span className="text-white font-bold flex items-center gap-1">
                        <Shield className="h-3 w-3 text-zinc-400" />
                        CREATOR RESPONSE
                      </span>
                      {review.admin_replied_at && (
                        <span>{new Date(review.admin_replied_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-serif italic text-zinc-200 leading-relaxed">
                      {review.admin_reply}
                    </p>
                  </div>
                )}

                {/* Admin Reply Form Input */}
                {isOwner && replyingId === review.id && (
                  <div className="mt-4 p-4 bg-zinc-900 border border-zinc-700 space-y-3">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                      Write response to {review.user_display_name}:
                    </label>
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type official response..."
                      className="w-full bg-black border border-zinc-700 p-2.5 text-xs font-serif text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingId(null)}
                        className="px-3 py-1 text-xs font-mono text-zinc-500 hover:text-white uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={replySubmitting || !replyText.trim()}
                        onClick={() => handleSendReply(review.id)}
                        className="px-4 py-1.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Send className="h-3 w-3" />
                        <span>Post Response</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Floating Action / Bottom CTA */}
      <div className="mt-16 text-center border-t border-zinc-900 pt-12">
        <h3 className="text-xl font-serif text-white mb-2">Have a thought to share?</h3>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">
          Every suggestion and reflection directly guides the development of UNSENT.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Leave Feedback or Review</span>
        </button>
      </div>

      {/* Feedback Submission Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSubmitted={(newReview) => {
          setReviews((prev) => [newReview, ...prev]);
          setNotification('Your review and feedback were submitted successfully!');
          setTimeout(() => setNotification(null), 3500);
        }}
      />
    </div>
  );
};
