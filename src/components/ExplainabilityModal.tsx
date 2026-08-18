import React from 'react';
import { RecommendationResult, Interaction } from '../types';
import { DEMO_REELS } from '../data/demoReels';
import { X, CornerDownRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  rec: RecommendationResult;
  interactions: Interaction[];
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  rec,
  interactions
}) => {
  if (!isOpen) return null;

  const currentReel = DEMO_REELS.find(r => r.id === rec.currentReel.id) || DEMO_REELS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="explain-title">
      <div className="relative w-full max-w-2xl bg-surface border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent-primary" />
            <h2 id="explain-title" className="text-base font-bold text-slate-100">
              Explainable AI Recommendation Trace
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs text-slate-300">
          
          {/* Step 1: Interaction Inputs */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[10px] text-indigo-400">
              Step 1: Raw Scroll Interactions (Signals)
            </h3>
            <p className="text-slate-400 leading-normal">
              ScrollIQ monitors your engagement patterns, assigning positive weights for likes/shares and negative weights for skips:
            </p>
            <div className="flex flex-col gap-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
              {interactions.length === 0 ? (
                <div className="text-slate-500 italic">No interactions recorded. Showing default signals.</div>
              ) : (
                interactions.map((i, idx) => {
                  const r = DEMO_REELS.find(item => item.id === i.reelId);
                  return (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900/50 last:border-0">
                      <span className="font-medium text-slate-300 truncate max-w-[320px]">
                        {r?.title || 'Unknown Reel'}
                      </span>
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        i.type === 'like' || i.type === 'save' 
                          ? 'bg-emerald-950/40 text-emerald-400' 
                          : i.type === 'skip' 
                          ? 'bg-red-950/40 text-red-400' 
                          : 'bg-indigo-950/40 text-indigo-400'
                      }`}>
                        {i.type.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
 
          {/* Step 2: Content Understanding */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[10px] text-indigo-400">
              Step 2: Content Understanding & Semantic Signals
            </h3>
            <p className="text-slate-400 leading-normal">
              The AI analyzes metadata, subtopics, and developer-oriented tags of your scrolled content:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Active Reel Domain:</div>
                <div className="font-bold text-slate-200 mt-0.5 capitalize">{currentReel.domain}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Associated Subtopics:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentReel.subtopics.map(t => (
                    <span key={t} className="bg-slate-900 text-[10px] px-1.5 py-0.5 rounded text-slate-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
 
          {/* Step 3: Interest Clusters */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[10px] text-indigo-400">
              Step 3: Latent Interest Clustering
            </h3>
            <p className="text-slate-400 leading-normal">
              Instead of matching keywords like "Java", ScrollIQ mapped your signals to the broader target career cluster:
            </p>
            <div className="flex items-center gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
              <CornerDownRight className="w-5 h-5 text-accent-primary shrink-0" />
              <div>
                <div className="text-sm font-bold text-slate-100">{rec.detectedInterest.topic}</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {rec.detectedInterest.evidence.map((ev, idx) => (
                    <span key={idx} className="bg-indigo-950/30 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-900/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Quality & Hype Filter */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[10px] text-indigo-400">
              Step 4: Quality & Hype Risk Shielding
            </h3>
            <p className="text-slate-400 leading-normal">
              The AI rates content substance, penalizing exaggerations and clickbait titles:
            </p>
            <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-900">
              <ShieldCheck className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-200">
                  Hype Assessment: {rec.qualityAssessment.hypeRisk} Risk
                </div>
                <div className="text-slate-400 mt-1">
                  {rec.qualityAssessment.reason}
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Final Bridge Recommendation */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[10px] text-indigo-400">
              Step 5: Bridge Recommendation Generation
            </h3>
            <p className="text-slate-400 leading-normal">
              The recommended Reel connects your latent interest with valuable computer-science and industry concepts:
            </p>
            <div className="bg-indigo-950/15 p-4 rounded-xl border border-indigo-900/30">
              <div className="font-bold text-slate-100 text-sm">{rec.recommendation.title}</div>
              <div className="text-slate-300 mt-1 leading-normal">{rec.recommendation.why}</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-bold text-white bg-accent-primary hover:bg-indigo-600 px-5 py-2.5 rounded-lg focus:outline-none transition-colors"
          >
            Acknowledge Trace
          </button>
        </div>
      </div>
    </div>
  );
};
export default ExplainabilityModal;
