import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Key, Plus, AlertCircle, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { TimeCapsule } from '../../types';
import { fetchTimeCapsules, createTimeCapsule, recordCapsuleReflection } from '../../services/db';
import { AppUser as User } from '../../hooks/useAuth';

interface CapsulesViewProps {
  user: User | null;
  onOpenAuth: () => void;
}

export const CapsulesView: React.FC<CapsulesViewProps> = ({ user, onOpenAuth }) => {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openingCapsule, setOpeningCapsule] = useState<TimeCapsule | null>(null);

  // New capsule form state
  const [content, setContent] = useState('');
  const [timePreset, setTimePreset] = useState<'1m' | '6m' | '1y' | '5y' | 'custom'>('1y');
  const [customDate, setCustomDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Unsealed capsule reflection form state
  const [wouldSend, setWouldSend] = useState<'Yes' | 'No' | 'Not sure'>('Not sure');
  const [reflection, setReflection] = useState('');
  const [submittingReflection, setSubmittingReflection] = useState(false);

  const loadCapsules = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchTimeCapsules(user.id);
      setCapsules(data);
    } catch (err: any) {
      console.error('Failed to load capsules:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCapsules();
  }, [loadCapsules]);

  const calculateUnlockDate = (): string => {
    const now = new Date();
    if (timePreset === '1m') now.setMonth(now.getMonth() + 1);
    else if (timePreset === '6m') now.setMonth(now.getMonth() + 6);
    else if (timePreset === '1y') now.setFullYear(now.getFullYear() + 1);
    else if (timePreset === '5y') now.setFullYear(now.getFullYear() + 5);
    else if (timePreset === 'custom' && customDate) return new Date(customDate).toISOString();
    return now.toISOString();
  };

  const handleSealCapsule = async () => {
    if (!content.trim()) {
      setErrorMsg('Please write something for your future self.');
      return;
    }
    if (!user) {
      onOpenAuth();
      return;
    }

    setCreating(true);
    setErrorMsg(null);
    try {
      const unlockAt = calculateUnlockDate();
      await createTimeCapsule({
        userId: user.id,
        content: content.trim(),
        unlockAt: unlockAt,
      });

      setContent('');
      setShowCreateModal(false);
      loadCapsules();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to seal capsule.');
    } finally {
      setCreating(false);
    }
  };

  const handleSaveReflection = async () => {
    if (!openingCapsule || !user) return;

    setSubmittingReflection(true);
    try {
      await recordCapsuleReflection(openingCapsule.id, user.id, wouldSend, reflection);
      setOpeningCapsule(null);
      setReflection('');
      loadCapsules();
    } catch (err: any) {
      alert('Failed to save reflection: ' + (err?.message || 'Unknown error'));
    } finally {
      setSubmittingReflection(false);
    }
  };

  return (
    <div className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-12 text-white selection:bg-white selection:text-black">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-8 gap-4">
        <div className="space-y-3">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block">
            TIME VAULT
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-sans">
            WORDS FOR<br />ANOTHER VERSION OF YOU.
          </h1>
        </div>

        <button
          onClick={() => {
            if (!user) onOpenAuth();
            else setShowCreateModal(true);
          }}
          className="text-xs font-mono tracking-widest uppercase bg-white text-black px-6 py-3 font-bold hover:bg-zinc-200 transition-colors shrink-0"
        >
          + SEAL CAPSULE
        </button>
      </div>

      {/* List of Suspended Capsules */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="h-56 border border-zinc-800 p-6" />
          ))}
        </div>
      ) : capsules.length === 0 ? (
        /* Mandatory Exact Empty State */
        <div className="p-12 border border-dashed border-zinc-800 text-center space-y-4">
          <p className="text-xl font-mono text-zinc-300 uppercase">NO SEALED CAPSULES YET.</p>
          <p className="text-xs text-zinc-500 font-serif italic">
            “Write something for your future self.”
          </p>
          <button
            onClick={() => {
              if (!user) onOpenAuth();
              else setShowCreateModal(true);
            }}
            className="text-xs font-mono tracking-widest uppercase border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
          >
            CREATE TIME CAPSULE →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {capsules.map((capsule) => {
            const isUnlocked = new Date(capsule.unlock_at) <= new Date();
            const createdDateStr = new Date(capsule.created_at).toLocaleDateString();
            const unlockDateStr = new Date(capsule.unlock_at).toLocaleDateString();

            return (
              <div
                key={capsule.id}
                className={`
                  p-8 border transition-all flex flex-col justify-between h-72 relative group
                  ${isUnlocked
                    ? 'border-white bg-white/5'
                    : 'border-zinc-800 hover:border-zinc-500 bg-black'}
                `}
              >
                <div className="flex justify-between items-start text-xs font-mono tracking-widest text-zinc-500 uppercase">
                  <span>{isUnlocked ? 'READY TO UNSEAL' : 'SEALED ENVELOPE'}</span>
                  <Lock className="h-4 w-4" />
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-black font-sans uppercase tracking-tight text-white">
                    FOR FUTURE ME
                  </p>
                  <p className="text-xs font-mono text-zinc-500 uppercase">
                    UNLOCKS: {unlockDateStr}
                  </p>
                </div>

                {isUnlocked ? (
                  <div className="space-y-3 pt-3 border-t border-zinc-800">
                    <p className="text-sm font-serif text-zinc-200 line-clamp-2">
                      {capsule.content}
                    </p>
                    <button
                      onClick={() => setOpeningCapsule(capsule)}
                      className="text-xs font-mono uppercase tracking-widest text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-white"
                    >
                      READ & REFLECT →
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-zinc-800 pt-3 text-[11px] font-mono text-zinc-500 uppercase">
                    SEALED ON {createdDateStr}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Seal New Time Capsule Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="SEAL A TIME CAPSULE"
        maxWidth="lg"
      >
        <div className="space-y-6 font-mono text-xs text-white">
          {errorMsg && (
            <div className="p-3 border border-zinc-700 bg-zinc-900 text-white uppercase flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-zinc-300" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block uppercase tracking-widest text-zinc-400">
              Unlock Timeline
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: '1m', label: '1 Month' },
                { id: '6m', label: '6 Months' },
                { id: '1y', label: '1 Year' },
                { id: '5y', label: '5 Years' },
                { id: 'custom', label: 'Custom Date' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTimePreset(p.id as any)}
                  className={`
                    px-3 py-1.5 uppercase transition-colors border
                    ${timePreset === p.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white'}
                  `}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {timePreset === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-2 bg-black border border-zinc-700 p-3 text-xs text-white focus:outline-none uppercase"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="block uppercase tracking-widest text-zinc-400">
              Letter to your Future Self
            </label>
            <textarea
              placeholder="Open this when..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:outline-none resize-none font-serif"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-zinc-800 uppercase hover:border-zinc-500"
            >
              Cancel
            </button>
            <button
              disabled={creating}
              onClick={handleSealCapsule}
              className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-zinc-200"
            >
              Seal into Vault
            </button>
          </div>
        </div>
      </Modal>

      {/* Unseal Reflection Modal */}
      {openingCapsule && (
        <Modal
          isOpen={Boolean(openingCapsule)}
          onClose={() => setOpeningCapsule(null)}
          title="A MESSAGE FROM YOU"
          maxWidth="md"
        >
          <div className="space-y-6 font-mono text-xs text-white">
            <p className="text-zinc-400 uppercase">
              WROTE ON {new Date(openingCapsule.created_at).toLocaleDateString()}
            </p>

            <div className="p-4 border border-zinc-800 font-serif text-base text-zinc-100 whitespace-pre-wrap leading-relaxed">
              {openingCapsule.content}
            </div>

            <div className="space-y-2">
              <label className="block uppercase tracking-widest text-zinc-400">Would you still send it?</label>
              <div className="flex gap-2">
                {(['Yes', 'No', 'Not sure'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setWouldSend(option)}
                    className={`
                      px-3 py-1.5 uppercase border transition-colors
                      ${wouldSend === option
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-black text-zinc-400 border-zinc-800'}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block uppercase tracking-widest text-zinc-400">What changed?</label>
              <textarea
                placeholder="Reflect on how you've grown..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                className="w-full bg-black border border-zinc-700 p-3 text-xs text-white focus:outline-none resize-none font-sans"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={submittingReflection}
                onClick={handleSaveReflection}
                className="px-6 py-2 bg-white text-black font-bold uppercase hover:bg-zinc-200"
              >
                Save Reflection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
