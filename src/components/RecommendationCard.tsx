import React from 'react';
import { RecommendationResult } from '../types';
import { Sparkles, AlertTriangle, ArrowRight, ShieldAlert, Bookmark, ThumbsDown, GraduationCap, ChevronRight, Check } from 'lucide-react';

interface RecommendationCardProps {
  rec: RecommendationResult;
  onExplore: (minutes: number) => void;
  onSave: () => void;
  onDislike: (category: string) => void;
  onShowAnother: () => void;
  mode: 'Gemini AI' | 'Demo Heuristics';
  isSaved: boolean;
  hasExplored: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  rec,
  onExplore,
  onSave,
  onDislike,
  onShowAnother,
  mode,
  isSaved,
  hasExplored
}) => {
  const { currentReel, detectedInterest, recommendation, qualityAssessment } = rec;

  const difficultyColor = {
    Beginner: 'text-accent-success bg-accent-success/15 border-accent-success/30',
    Intermediate: 'text-accent-secondary bg-accent-secondary/15 border-accent-secondary/30',
    Advanced: 'text-accent-purple bg-accent-purple/15 border-accent-purple/30',
  }[recommendation.difficulty];

  const confidenceColor = {
    High: 'text-accent-success bg-accent-success/15',
    Medium: 'text-amber-400 bg-amber-400/10',
    Low: 'text-red-400 bg-red-400/10',
  }[detectedInterest.confidence];

  const hypeColor = {
    Low: 'text-accent-success bg-accent-success/15 border-accent-success/30',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    High: 'text-accent-danger bg-accent-danger/15 border-accent-danger/30',
  }[qualityAssessment.hypeRisk];

  return (
    <article className="glass-panel-elevated rounded-2xl border border-indigo-500/20 p-6 flex flex-col gap-6 relative overflow-hidden" aria-labelledby="rec-title">
      {/* Top Banner */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-purple"></div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="rec-title" className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-secondary animate-pulse" />
            <span>AI Recommendation Target</span>
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Generated via <span className="font-semibold text-indigo-400">{mode}</span>
          </p>
        </div>

        {/* Confidence Badge */}
        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${confidenceColor}`}>
          Confidence: {detectedInterest.confidence}
        </div>
      </div>

      {/* Connection Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-slate-950/60 p-4 rounded-xl border border-slate-900">
        <div className="md:col-span-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Based On Feed Scroll:</div>
          <div className="font-bold text-slate-300 mt-1 truncate max-w-full" title={currentReel.title}>
            {currentReel.title}
          </div>
        </div>

        <div className="flex justify-center md:col-span-1">
          <ArrowRight className="w-4 h-4 text-accent-primary animate-pulse hidden md:block" />
          <div className="h-4 w-px bg-slate-800 md:hidden my-1"></div>
        </div>

        <div className="md:col-span-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Inferred Latent Topic:</div>
          <div className="font-bold text-indigo-400 mt-1 truncate max-w-full">
            {detectedInterest.topic}
          </div>
        </div>
      </div>

      {/* Main Recommended Content Details */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded border border-accent-secondary/20">
              {recommendation.category}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${difficultyColor}`}>
              {recommendation.difficulty}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-100 group-hover:text-accent-secondary leading-snug">
            {recommendation.title}
          </h3>
          
          <p className="text-xs text-slate-300 leading-relaxed mt-2.5 bg-slate-900/30 p-3 rounded-xl border border-slate-800/40">
            <span className="font-semibold text-indigo-300 block mb-1">Bridge Explanation (Why this?):</span>
            {recommendation.why}
          </p>
        </div>

        {/* Quality Assessment Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Content Quality Score:</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-full bg-slate-950 rounded-full h-1.5 max-w-[80px]">
                <div 
                  className="bg-accent-success h-1.5 rounded-full" 
                  style={{ width: `${qualityAssessment.qualityScore * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-accent-success">
                {Math.round(qualityAssessment.qualityScore * 100)}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hype & Clickbait Risk:</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${hypeColor} flex items-center gap-1`}>
                {qualityAssessment.hypeRisk === 'High' ? (
                  <ShieldAlert className="w-3 h-3 text-accent-danger" />
                ) : qualityAssessment.hypeRisk === 'Medium' ? (
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                ) : (
                  <Check className="w-3 h-3 text-accent-success" />
                )}
                {qualityAssessment.hypeRisk}
              </span>
              <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[150px]" title={qualityAssessment.reason}>
                {qualityAssessment.reason}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Save Button */}
          <button
            onClick={onSave}
            className={`p-2 rounded-lg border flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary ${
              isSaved 
                ? 'bg-accent-success/20 text-accent-success border-accent-success/40' 
                : 'hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
            title="Save this recommendation"
            aria-label="Save recommendation"
          >
            <Bookmark className={`w-4.5 h-4.5 ${isSaved ? 'fill-accent-success' : ''}`} />
          </button>

          {/* Not Interested Button */}
          <button
            onClick={() => onDislike(recommendation.category)}
            className="p-2 rounded-lg border border-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 hover:border-red-500/20 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
            title="Not interested in this category"
            aria-label="Dislike recommendation category"
          >
            <ThumbsDown className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShowAnother}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2.5 rounded-lg hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all focus:outline-none"
          >
            Show Another
          </button>

          {/* Explore Course Button */}
          <button
            onClick={() => onExplore(recommendation.learningMinutes || 15)}
            disabled={hasExplored}
            className={`text-xs font-bold text-white px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              hasExplored 
                ? 'bg-accent-success/20 text-accent-success border border-accent-success/40 cursor-default glow-primary' 
                : 'bg-accent-primary hover:bg-indigo-600 hover-scale glow-primary hover:glow-hover'
            }`}
          >
            {hasExplored ? (
              <>
                <Check className="w-4 h-4" />
                Explored (+{recommendation.learningMinutes || 15}m)
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4" />
                Explore Topic
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
export default RecommendationCard;
