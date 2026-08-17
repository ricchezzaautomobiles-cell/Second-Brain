import React, { useState } from 'react';
import { Star, MessageSquare, Check, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { AppUser } from '../../hooks/useAuth';
import { FeedbackCategory, FeedbackReview } from '../../types';
import { submitFeedbackReview } from '../../services/db';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
  onSubmitted?: (review: FeedbackReview) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>('experience');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [displayName, setDisplayName] = useState(
    user?.displayName || (user?.email ? user.email.split('@')[0] : '')
  );
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ratingDescriptions: Record<number, string> = {
    1: 'Needs Significant Improvement',
    2: 'Fair / Has Issues',
    3: 'Good / Decent Experience',
    4: 'Great / Very Meaningful',
    5: 'Deeply Resonant / Exceptional',
  };

  const categories: { id: FeedbackCategory; label: string; desc: string }[] = [
    { id: 'experience', label: 'EXPERIENCE', desc: 'Overall emotional feel and design' },
    { id: 'testimonial', label: 'TESTIMONIAL', desc: 'Personal story or how UNSENT helped' },
    { id: 'feature_request', label: 'FEATURE IDEA', desc: 'Suggestions for future features' },
    { id: 'bug_report', label: 'BUG / ISSUE', desc: 'Something not working as intended' },
    { id: 'general', label: 'GENERAL', desc: 'General thoughts or open letter' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write a few words of feedback or your review reflection.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newReview = await submitFeedbackReview({
        user_id: user?.id || null,
        user_display_name: displayName.trim() || 'Anonymous Writer',
        user_email: user?.email || null,
        rating,
        category,
        title: title.trim() || (category === 'testimonial' ? 'A Letter of Reflection' : 'Community Feedback'),
        content: content.trim(),
        is_public: isPublic,
      });

      setSuccess(true);
      if (onSubmitted) {
        onSubmitted(newReview);
      }

      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setContent('');
        setRating(5);
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FEEDBACK & REVIEW"
      maxWidth="md"
    >
      {success ? (
        <div className="py-12 px-4 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white">
            <Check className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-mono uppercase tracking-widest text-white font-bold">
            THANK YOU FOR YOUR WORDS
          </h3>
          <p className="text-zinc-400 font-serif italic text-sm max-w-md mx-auto leading-relaxed">
            Your review and feedback have been received. Your reflections help shape and nurture this quiet sanctuary.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-zinc-300">
          {error && (
            <div className="p-3 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-zinc-300" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Rating Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
              YOUR RATING
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-2 bg-zinc-950 border border-zinc-800 rounded-sm">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          isFilled
                            ? 'text-white fill-white'
                            : 'text-zinc-700 hover:text-zinc-500'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-mono text-zinc-400 italic">
                {ratingDescriptions[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
              FEEDBACK CATEGORY
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`text-left p-2.5 border transition-all text-xs font-mono ${
                      isSelected
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    <div className="tracking-wider">{cat.label}</div>
                    <div
                      className={`text-[9px] mt-0.5 font-sans leading-tight ${
                        isSelected ? 'text-zinc-800' : 'text-zinc-500'
                      }`}
                    >
                      {cat.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
              HEADLINE / TITLE <span className="text-zinc-600">(OPTIONAL)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., A healing space for unspoken words"
              className="w-full bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 font-serif focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Detailed Content */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
              YOUR REVIEW &amp; THOUGHTS <span className="text-zinc-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your honest review, experience, suggestion, or note..."
              className="w-full bg-zinc-950 border border-zinc-800 p-3.5 text-sm text-zinc-200 placeholder-zinc-600 font-serif leading-relaxed focus:outline-none focus:border-zinc-500 resize-y"
            />
          </div>

          {/* Author Display Name & Public Review Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                SIGNATURE NAME
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Anonymous Writer"
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <span className="text-[10px] font-mono text-zinc-600 block">
                Leave blank to remain completely anonymous.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                VISIBILITY
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer select-none p-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mt-0.5 accent-white rounded-none cursor-pointer"
                />
                <div className="text-[11px] font-mono text-zinc-300">
                  <span className="font-bold">Publish to Community Wall</span>
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
                    {isPublic
                      ? 'Visible to visitors on the Reviews wall.'
                      : 'Private message sent only to the creators.'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-mono uppercase text-zinc-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Submit {isPublic ? 'Review' : 'Feedback'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
