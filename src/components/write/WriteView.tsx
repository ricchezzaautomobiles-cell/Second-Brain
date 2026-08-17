import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, Lock, Globe, Send, Bookmark } from 'lucide-react';
import { RecipientCategory } from '../../types';
import { createUnsentMessage, checkIfUserIsBanned } from '../../services/db';
import { auth } from '../../lib/firebase';
import { AppUser as User, useAuth } from '../../hooks/useAuth';

interface WriteViewProps {
  user: User | null;
  onOpenAuth: () => void;
  onSaved: () => void;
}

const RECIPIENT_OPTIONS: RecipientCategory[] = [
  'Myself',
  'Someone I love',
  'An ex',
  'Friend',
  'Family',
  'Stranger',
  'Someone who hurt me',
  'Someone I never met',
  'Other',
];

export const WriteView: React.FC<WriteViewProps> = ({ user, onOpenAuth, onSaved }) => {
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState<RecipientCategory | null>(null);
  const [publishMode, setPublishMode] = useState<'private' | 'anonymous'>('private');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signInAsGuest } = useAuth();

  // Dissolve Release Animation State
  const [isAnimatingRelease, setIsAnimatingRelease] = useState(false);
  const [animatingText, setAnimatingText] = useState('');
  const [releaseCompleted, setReleaseCompleted] = useState(false);

  const characterCount = content.length;

  const handleSaveOrPublish = async (visibility: 'private' | 'anonymous') => {
    if (!content.trim()) {
      setErrorMsg('Please write your unsent letter before saving or publishing.');
      return;
    }

    let activeUser = user;

    // If not authenticated, offer quick guest sign-in or open auth modal
    if (!activeUser) {
      try {
        setSaving(true);
        await signInAsGuest('Guest Writer');
      } catch (err: any) {
        setSaving(false);
        onOpenAuth();
        return;
      }
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const activeUserId = auth.currentUser?.uid || user?.id || 'guest';
      
      const isBanned = await checkIfUserIsBanned(activeUserId);
      if (isBanned) {
        setErrorMsg('Your account has been suspended by the platform administrator for violating community guidelines.');
        setSaving(false);
        return;
      }

      await createUnsentMessage({
        userId: activeUserId,
        content: content.trim(),
        visibility: visibility,
        recipientCategory: recipient,
      });

      // Trigger Signature Dissolve Animation
      setAnimatingText(content.trim());
      setIsAnimatingRelease(true);

      setTimeout(() => {
        setReleaseCompleted(true);
        setTimeout(() => {
          setContent('');
          setRecipient(null);
          setIsAnimatingRelease(false);
          setReleaseCompleted(false);
          onSaved();
        }, 2200);
      }, 2500);

    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to process unsent message.');
    } finally {
      setSaving(false);
    }
  };

  // Render Dissolve Release Canvas Overlay
  if (isAnimatingRelease) {
    const letters = animatingText.split('');

    return (
      <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-8 overflow-hidden">
        {!releaseCompleted ? (
          <div className="max-w-3xl w-full flex flex-wrap justify-center content-center gap-1 sm:gap-2 text-center select-none">
            {letters.map((char, index) => {
              const randomX = (Math.random() - 0.5) * 350;
              const randomY = -Math.random() * 450 - 100;
              const randomRotate = (Math.random() - 0.5) * 360;

              return (
                <motion.span
                  key={index}
                  initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: randomX,
                    y: randomY,
                    rotate: randomRotate,
                    scale: 0.2,
                  }}
                  transition={{
                    duration: 2.2,
                    ease: [0.25, 1, 0.5, 1],
                    delay: Math.random() * 0.5,
                  }}
                  className="text-xl sm:text-3xl font-serif text-white inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <p className="text-3xl sm:text-5xl md:text-6xl font-mono uppercase font-black text-white tracking-widest">
              IT'S NO LONGER YOURS.
            </p>
            <p className="text-sm font-serif italic text-zinc-500">
              {publishMode === 'anonymous' ? 'Released anonymously to the world.' : 'Saved securely in your private vault.'}
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-4 sm:p-8 md:p-12 overflow-y-auto selection:bg-white selection:text-black">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4 z-10 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onSaved}
            className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>RETURN TO UNSENT</span>
          </button>

          {/* Header Quick Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSaveOrPublish('private')}
              disabled={saving || !content.trim()}
              className="text-xs font-mono tracking-widest uppercase border border-zinc-700 hover:border-white px-3.5 py-1.5 text-zinc-300 hover:text-white transition-colors disabled:opacity-30 flex items-center gap-1.5"
            >
              <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Save Private</span>
            </button>

            <button
              onClick={() => handleSaveOrPublish('anonymous')}
              disabled={saving || !content.trim()}
              className="text-xs font-mono tracking-widest uppercase bg-white text-black px-4 py-1.5 font-bold hover:bg-zinc-200 transition-colors disabled:opacity-30 flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Publish Anonymous</span>
            </button>
          </div>
        </div>

        {/* Recipient Category Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-4xl custom-scrollbar">
          <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0">RECIPIENT:</span>
          {RECIPIENT_OPTIONS.map((cat) => {
            const isSelected = recipient === cat;
            return (
              <button
                key={cat}
                onClick={() => setRecipient(isSelected ? null : cat)}
                className={`
                  text-[10px] font-mono uppercase px-2.5 py-1 transition-all shrink-0 border rounded-sm
                  ${isSelected
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'}
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications / Errors */}
      {errorMsg && (
        <div className="max-w-2xl mx-auto my-2 text-white text-xs font-mono uppercase tracking-wider flex items-center justify-between gap-2 border border-zinc-700 bg-zinc-900 p-3.5 rounded-lg w-full">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-zinc-300" />
            <span>{errorMsg}</span>
          </div>
          {!user && (
            <button
              onClick={onOpenAuth}
              className="text-[10px] uppercase font-bold underline text-white hover:text-zinc-300"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Main Writing Room Textarea */}
      <div className="flex-1 my-auto flex flex-col justify-center max-w-4xl mx-auto w-full py-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dear…"
          autoFocus
          rows={8}
          className="w-full bg-transparent text-white placeholder-zinc-700 text-2xl sm:text-3xl md:text-4xl font-serif leading-relaxed focus:outline-none resize-none tracking-wide caret-white"
        />
      </div>

      {/* Publishing Option Selector & Action Toolbar */}
      <div className="flex flex-col z-10 border-t border-white/10 pt-4 gap-4 max-w-4xl mx-auto w-full">
        {/* Toggle Mode Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-zinc-950 border border-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => setPublishMode('private')}
            className={`p-3 text-left rounded-lg transition-all border flex items-start gap-3 ${
              publishMode === 'private'
                ? 'bg-zinc-900 border-white/40 text-white shadow-md'
                : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Lock className={`h-4 w-4 mt-0.5 shrink-0 ${publishMode === 'private' ? 'text-white' : 'text-zinc-600'}`} />
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider">Option A: Save to Private Vault</div>
              <div className="text-[11px] text-zinc-400 font-sans mt-0.5">Only visible to you in your personal profile archive.</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPublishMode('anonymous')}
            className={`p-3 text-left rounded-lg transition-all border flex items-start gap-3 ${
              publishMode === 'anonymous'
                ? 'bg-zinc-900 border-white/40 text-white shadow-md'
                : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Globe className={`h-4 w-4 mt-0.5 shrink-0 ${publishMode === 'anonymous' ? 'text-white' : 'text-zinc-600'}`} />
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider">Option B: Publish Anonymously</div>
              <div className="text-[11px] text-zinc-400 font-sans mt-0.5">Shared publicly on Discover feed. Nobody sees your identity.</div>
            </div>
          </button>
        </div>

        {/* Bottom Bar: Character Count + Main Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span>{characterCount} CHARACTERS</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {publishMode === 'private' ? (
              <button
                onClick={() => handleSaveOrPublish('private')}
                disabled={saving || !content.trim()}
                className="w-full sm:w-auto text-xs font-mono tracking-widest uppercase bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 font-bold transition-colors disabled:opacity-30 flex items-center justify-center gap-2 border border-zinc-600"
              >
                <Bookmark className="h-4 w-4" />
                <span>SAVE TO PRIVATE VAULT</span>
              </button>
            ) : (
              <button
                onClick={() => handleSaveOrPublish('anonymous')}
                disabled={saving || !content.trim()}
                className="w-full sm:w-auto text-xs font-mono tracking-widest uppercase bg-white text-black px-8 py-3 font-bold hover:bg-zinc-200 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>PUBLISH ANONYMOUSLY →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
