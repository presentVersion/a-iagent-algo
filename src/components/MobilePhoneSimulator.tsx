import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Reel, InteractionType, Interaction, RecommendationResult } from '../types';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  EyeOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Bot, 
  X
} from 'lucide-react';
import { generateMockRecommendation } from '../services/mockAIService';
import { FeedContentMode } from '../services/recommendationConfig';

interface MobilePhoneSimulatorProps {
  reels: Reel[];
  onInteract: (reelId: string, type: InteractionType) => void;
  interactions: Record<string, InteractionType[]>;
  interactionsList: Interaction[];
  userFeedback: { topicPenalties: Record<string, number>; topicBoosts: Record<string, number> };
  activeModes: { learningMode: boolean; careerMode: boolean; makeUseful: boolean };
  feedMode: FeedContentMode;
  onChangeFeedMode: (mode: FeedContentMode) => void;
}

export const MobilePhoneSimulator: React.FC<MobilePhoneSimulatorProps> = ({
  reels,
  onInteract,
  interactions,
  interactionsList,
  userFeedback,
  activeModes,
  feedMode,
  onChangeFeedMode
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [watchRecorded, setWatchRecorded] = useState<Record<string, { partial: boolean; complete: boolean }>>({});
  const [showWhyPanel, setShowWhyPanel] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  // Auto-fallback: if YouTube iframe doesn't signal ready within 5s, show preview card
  const iframeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIframeTimeout = useCallback(() => {
    if (iframeTimeoutRef.current) {
      clearTimeout(iframeTimeoutRef.current);
      iframeTimeoutRef.current = null;
    }
  }, []);

  const startIframeTimeout = useCallback(() => {
    clearIframeTimeout();
    iframeTimeoutRef.current = setTimeout(() => {
      setMediaError(true);
    }, 5000);
  }, [clearIframeTimeout]);

  // Reset on feed mode change
  useEffect(() => {
    setActiveIndex(0);
    setShowWhyPanel(false);
    setMediaError(false);
    clearIframeTimeout();
  }, [feedMode, clearIframeTimeout]);

  // Reset error state when navigating to a new reel
  useEffect(() => {
    setMediaError(false);
    clearIframeTimeout();
  }, [activeIndex, clearIframeTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { clearIframeTimeout(); };
  }, [clearIframeTimeout]);

  const currentReel = reels[activeIndex] || reels[0];

  // Capture Keyboard Shortcuts inside phone feed simulator
  useEffect(() => {
    if (!currentReel) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (activeIndex > 0) setActiveIndex(prev => prev - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (activeIndex < reels.length - 1) setActiveIndex(prev => prev + 1);
          break;
        case 'KeyM':
          setIsMuted(prev => !prev);
          break;
        case 'KeyL':
          onInteract(currentReel.id, 'like');
          break;
        case 'KeyS':
          onInteract(currentReel.id, 'save');
          break;
        case 'KeyN':
          onInteract(currentReel.id, 'skip');
          if (activeIndex < reels.length - 1) {
            setActiveIndex(prev => prev + 1);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, currentReel, reels.length]);

  // Simulate watch progress timing for YouTube iframe
  useEffect(() => {
    if (!currentReel) return;
    setIsPlaying(true);
    
    // Clear state or initialize
    if (!watchRecorded[currentReel.id]) {
      setWatchRecorded(prev => ({
        ...prev,
        [currentReel.id]: { partial: false, complete: false }
      }));
    }

    const partialTimer = setTimeout(() => {
      setWatchRecorded(prev => {
        const current = prev[currentReel.id] || { partial: false, complete: false };
        if (!current.partial) {
          onInteract(currentReel.id, 'watch_partial');
          return { ...prev, [currentReel.id]: { ...current, partial: true } };
        }
        return prev;
      });
    }, 1500); // 1.5 seconds partial watch

    const completeTimer = setTimeout(() => {
      setWatchRecorded(prev => {
        const current = prev[currentReel.id] || { partial: false, complete: false };
        if (!current.complete) {
          onInteract(currentReel.id, 'watch_complete');
          return { ...prev, [currentReel.id]: { ...current, complete: true } };
        }
        return prev;
      });
    }, 4000); // 4 seconds complete watch

    return () => {
      clearTimeout(partialTimer);
      clearTimeout(completeTimer);
    };
  }, [activeIndex, currentReel?.id]);

  const handleNext = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!currentReel) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        No reels loaded in this content mode.
      </div>
    );
  }

  const reelInteractions = interactions[currentReel.id] || [];
  const isLiked = reelInteractions.includes('like');
  const isSaved = reelInteractions.includes('save');
  const isShared = reelInteractions.includes('share');
  const isSkipped = reelInteractions.includes('skip');

  // Compute on-the-fly inline recommendation result for the overlay
  const recTrace: RecommendationResult = generateMockRecommendation(
    interactionsList,
    currentReel.id,
    userFeedback,
    activeModes
  );

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      
      {/* 🟢 Mode Switcher Tabs */}
      <div className="flex bg-slate-900/60 border border-slate-800 rounded-xl p-1 gap-1 w-full max-w-[340px]">
        {(['live', 'curated', 'demo'] as FeedContentMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => onChangeFeedMode(mode)}
            className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase rounded-lg transition-all focus:outline-none ${
              feedMode === mode
                ? 'bg-accent-primary text-white shadow-md'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            {mode === 'live' ? '🟢 Live' : mode === 'curated' ? '🟡 Curated' : '🔵 Demo'}
          </button>
        ))}
      </div>

      {/* Phone Viewport */}
      <div className="relative w-[340px] h-[580px] rounded-[36px] border-[8px] border-slate-900 bg-black overflow-hidden shadow-2xl flex flex-col select-none ring-4 ring-indigo-500/10">
        
        {/* Status bar mock */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/80 to-transparent z-30 px-6 flex justify-between items-center text-[10px] font-bold text-white/95">
          <span>9:41 AM</span>
          <div className="w-16 h-3 bg-black rounded-b-xl absolute left-1/2 transform -translate-x-1/2 top-0"></div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-4 h-2 bg-white rounded-sm border border-white/20"></div>
          </div>
        </div>

        {/* Home indicator mock */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white/80 rounded-full z-30"></div>

        {/* Player Viewport */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
          {isSkipped ? (
            <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center text-center p-6">
              <EyeOff className="w-12 h-12 text-red-400 mb-3" />
              <div className="text-sm font-bold text-slate-100">Video Skipped</div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Negative scroll signal sent. Press next to continue scrolling.
              </p>
            </div>
          ) : (
            isPlaying && !mediaError ? (
              <iframe
                key={currentReel.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${currentReel.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentReel.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
                className="absolute inset-0 w-full h-full object-cover z-0"
                title={currentReel.title}
                frameBorder="0"
                onLoad={() => { clearIframeTimeout(); }}
                onError={() => { clearIframeTimeout(); setMediaError(true); }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ref={(el) => { if (el && isPlaying) startIframeTimeout(); }}
              ></iframe>
            ) : (
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${currentReel.thumbnailColor || 'from-indigo-950 to-slate-900'} flex flex-col items-center justify-center text-center p-6 z-0 cursor-pointer select-none overflow-hidden`}
                onClick={togglePlay}
              >
                {/* Background glowing particle radial */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
                
                {/* Animated Code Wave Visualizer */}
                <div className="flex items-center gap-1.5 mb-4 z-10">
                  <div className="w-1.5 h-6 bg-white/80 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-10 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-14 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-8 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-1.5 h-5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>

                <span className="text-white font-extrabold text-xs z-10 px-3 max-w-[200px] leading-tight drop-shadow-md">
                  {currentReel.title}
                </span>
                <span className="text-white/70 font-semibold text-[10px] mt-2 z-10 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                  {isPlaying ? '▶ Reel Streaming...' : 'Click to resume reel'}
                </span>
              </div>
            )
          )}

          {/* Glowing Hype Warning */}
          {currentReel.hypeScore > 0.8 && !isSkipped && (
            <div className="absolute top-8 left-3 z-20 bg-accent-danger/95 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse shadow-lg">
              <span>⚠️ High Hype Clickbait</span>
            </div>
          )}

          {/* Right Floating Actions */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col gap-4 items-center">
            
            {/* Play/Pause */}
            <button 
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/90 hover:scale-105 transition-transform focus:outline-none"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            {/* Mute/Unmute */}
            <button 
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/90 hover:scale-105 transition-transform focus:outline-none"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Like */}
            <button 
              onClick={() => onInteract(currentReel.id, 'like')}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex flex-col items-center justify-center border transition-all hover:scale-105 focus:outline-none ${
                isLiked 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg' 
                  : 'bg-black/45 text-white/90 border-white/10'
              }`}
              aria-label="Like video"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
            </button>

            {/* Save */}
            <button 
              onClick={() => onInteract(currentReel.id, 'save')}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex flex-col items-center justify-center border transition-all hover:scale-105 focus:outline-none ${
                isSaved 
                  ? 'bg-accent-success/20 text-accent-success border-accent-success/40 shadow-lg' 
                  : 'bg-black/45 text-white/90 border-white/10'
              }`}
              aria-label="Save video"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-accent-success' : ''}`} />
            </button>

            {/* Share */}
            <button 
              onClick={() => onInteract(currentReel.id, 'share')}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex flex-col items-center justify-center border transition-all hover:scale-105 focus:outline-none ${
                isShared 
                  ? 'bg-accent-secondary/20 text-accent-secondary border-accent-secondary/40 shadow-lg' 
                  : 'bg-black/45 text-white/90 border-white/10'
              }`}
              aria-label="Share video"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Skip */}
            <button 
              onClick={() => onInteract(currentReel.id, 'skip')}
              className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 text-white/90 hover:scale-105 transition-transform focus:outline-none"
              aria-label="Skip video"
            >
              <EyeOff className="w-4 h-4 text-red-400" />
            </button>

          </div>

          {/* Bottom Left Info Text Details */}
          <div className="absolute left-3 right-16 bottom-6 z-20 text-white flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs">{currentReel.creator}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider bg-accent-primary/80 px-1.5 py-0.2 rounded border border-accent-primary/20">
                {currentReel.category}
              </span>
            </div>
            <h3 className="font-bold text-[10px] leading-tight line-clamp-1">{currentReel.title}</h3>
            
            {/* Inline Why This button */}
            <button
              onClick={() => setShowWhyPanel(true)}
              className="mt-1 flex items-center gap-1 text-[9px] font-bold text-indigo-300 hover:text-white bg-indigo-950/65 backdrop-blur-md border border-indigo-900/40 px-2 py-1 rounded w-max focus:outline-none"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Why am I seeing this?</span>
            </button>
          </div>

          {/* Dark gradients */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>

          {/* 🧠 3. INLINE RECOMMENDATION EXPLANATION OVERLAY */}
          {showWhyPanel && (
            <div className="absolute inset-0 bg-slate-950/95 z-30 p-5 flex flex-col justify-between text-left overflow-y-auto animate-fade-in text-[10px] leading-relaxed text-slate-300">
              
              <div className="flex flex-col gap-3.5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1">
                    <Bot className="w-4 h-4 text-accent-primary" />
                    <span className="font-extrabold text-slate-200 uppercase tracking-wider text-[9px]">
                      ScrollIQ Reason
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowWhyPanel(false)}
                    className="p-1 rounded text-slate-500 hover:text-white focus:outline-none"
                    aria-label="Close explainability panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Details */}
                <div className="flex flex-col gap-2.5">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold block">Inferred Latent Interest</span>
                    <div className="text-slate-100 font-extrabold mt-0.5 text-xs">{recTrace.detectedInterest.topic}</div>
                    <div className="text-slate-450 text-[9px] mt-0.5">Confidence: {recTrace.detectedInterest.confidence}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold block">Evidence Base</span>
                    <div className="flex flex-col gap-1 mt-1 text-[9px]">
                      {recTrace.detectedInterest.evidence.slice(0, 2).map((ev, idx) => (
                        <div key={idx} className="text-slate-350 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {ev}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold block">Next Bridge Recommendation</span>
                    <div className="text-slate-200 font-bold mt-0.5 text-[9px]">{recTrace.recommendation.title}</div>
                    <p className="text-slate-400 mt-1 leading-normal text-[9px]">
                      {recTrace.recommendation.why}
                    </p>
                  </div>

                  <div className="flex gap-2.5">
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold">Category</span>
                      <div className="text-indigo-400 font-bold">{recTrace.recommendation.category}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold">Difficulty</span>
                      <div className="text-accent-secondary font-bold">{recTrace.recommendation.difficulty}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowWhyPanel(false)}
                className="w-full bg-accent-primary hover:bg-indigo-650 text-white font-extrabold py-2 rounded-xl transition-all focus:outline-none"
              >
                Return to Video
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4 text-slate-400">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Scroll Up (Previous Reel)"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono font-bold">
          REEL {activeIndex + 1} OF {reels.length}
        </span>
        <button
          onClick={handleNext}
          disabled={activeIndex === reels.length - 1}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Scroll Down (Next Reel)"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
export default MobilePhoneSimulator;
