import React from 'react';
import { Sparkles, Heart, Brain, Lightbulb, PenTool, ShieldCheck, BookmarkPlus, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AiAnalysisResult } from '../../types';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AiAnalysisResult | null;
  onSave?: () => void;
  isSaved?: boolean;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onSave,
  isSaved = false,
}) => {
  if (!analysis) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Private AI Emotional Analysis" maxWidth="lg">
      <div className="space-y-5 font-mono">
        {/* Privacy Callout */}
        <div className="flex items-center gap-2 text-xs text-white bg-zinc-900 border border-zinc-700 rounded-xl p-3">
          <ShieldCheck className="h-4 w-4 shrink-0 text-white" />
          <span>Your AI analysis is completely private. Only you can see this breakdown.</span>
        </div>

        {/* Primary Emotions Spectrum */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-white" /> Emotional Spectrum
          </h4>
          <div className="space-y-2 bg-black p-3.5 rounded-xl border border-zinc-800">
            {analysis.emotions?.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-200">{item.emotion}</span>
                  <span className="text-white font-bold">{item.intensityPercentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, item.intensityPercentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Underlying Intention */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-white" /> Possible Intention
          </h4>
          <p className="text-xs text-zinc-300 bg-black p-3.5 rounded-xl border border-zinc-800 leading-relaxed italic font-serif">
            "{analysis.underlyingIntention}"
          </p>
        </div>

        {/* Reflective Subtext */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-white" /> Reflection & Subtext
          </h4>
          <p className="text-xs text-zinc-300 bg-black p-3.5 rounded-xl border border-zinc-800 leading-relaxed font-sans">
            {analysis.reflection}
          </p>
        </div>

        {/* Supportive Writing Prompt */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <PenTool className="h-3.5 w-3.5 text-white" /> Next Reflection Prompt
          </h4>
          <div className="text-xs text-white bg-zinc-900 border border-zinc-700 p-3.5 rounded-xl leading-relaxed italic font-serif">
            "{analysis.writingPrompt}"
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white transition-colors uppercase"
          >
            Close
          </button>
          {onSave && (
            <Button
              size="sm"
              variant={isSaved ? 'outline' : 'primary'}
              onClick={onSave}
              disabled={isSaved}
              icon={isSaved ? <Check className="h-3.5 w-3.5 text-white" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
            >
              {isSaved ? 'Saved to Archive' : 'Save Analysis'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
