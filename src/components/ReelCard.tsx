import React, { useState, useRef, useCallback } from 'react';
import { Reel, InteractionType } from '../types';
import { Heart, Bookmark, Share2, Play, EyeOff, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ReelCardProps {
  reel: Reel;
  onInteract: (reelId: string, type: InteractionType) => void;
  interactions: Record<string, InteractionType[]>;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, onInteract, interactions }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const iframeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIframeTimeout = useCallback(() => {
    if (iframeTimeoutRef.current) {
      clearTimeout(iframeTimeoutRef.current);
      iframeTimeoutRef.current = null;
    }
  }, []);

  const reelInteractions = interactions[reel.id] || [];
  
  const isLiked = reelInteractions.includes('like');
  const isSaved = reelInteractions.includes('save');
  const isShared = reelInteractions.includes('share');
  const isSkipped = reelInteractions.includes('skip');
  const isWatchedComplete = reelInteractions.includes('watch_complete');
  const isWatchedPartial = reelInteractions.includes('watch_partial');

  const togglePlay = () => {
    if (isSkipped) return;
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    
    if (nextState) {
      // Simulate watch progression signals
      onInteract(reel.id, 'watch_partial');
      setTimeout(() => {
        onInteract(reel.id, 'watch_complete');
      }, 2000);
    }
  };

  const handleSkip = () => {
    setIsPlaying(false);
    onInteract(reel.id, 'skip');
  };

  return (
    <div 
      className={`relative w-full rounded-[24px] overflow-hidden bg-black transition-all duration-300 flex flex-col h-[520px] shadow-lg border border-slate-800 hover:shadow-2xl hover:scale-[1.01] group ${
        isSkipped ? 'opacity-30' : ''
      }`}
      aria-label={`Reel: ${reel.title}`}
    >
      
      {/* 1. Main Media Area covering 100% of height */}
      <div className="absolute inset-0 w-full h-full z-0 bg-slate-950">
        
        {/* Playable YouTube Shorts iframe embed or fallback */}
        {!isSkipped && (isPlaying || isWatchedPartial) && !mediaError ? (
          <iframe
            key={reel.youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${reel.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${reel.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
            className="absolute inset-0 w-full h-full object-cover z-0"
            title={reel.title}
            frameBorder="0"
            onLoad={() => clearIframeTimeout()}
            onError={() => { clearIframeTimeout(); setMediaError(true); }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            ref={(el) => {
              if (el) {
                clearIframeTimeout();
                iframeTimeoutRef.current = setTimeout(() => setMediaError(true), 6000);
              }
            }}
          ></iframe>
        ) : (
          /* High-quality Animated Fallback Player Preview */
          <div className={`absolute inset-0 bg-gradient-to-br ${reel.thumbnailColor || 'from-indigo-900 to-slate-900'} flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden`}>
            {/* Background glowing particles/grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
            
            {/* Animated Code Wave Visualizer */}
            <div className="flex items-center gap-1.5 mb-4 z-10">
              <div className="w-1.5 h-8 bg-white/80 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-12 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-16 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-10 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-1.5 h-6 bg-white/70 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>

            <span className="text-white font-extrabold text-sm z-10 px-4 max-w-[220px] leading-snug drop-shadow-md">
              {reel.topic}
            </span>
            <span className="text-white/70 font-semibold text-xs mt-2 z-10 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              {isPlaying ? '▶ Streaming Clip...' : 'Click play to start reel stream'}
            </span>
          </div>
        )}

        {/* Dynamic Scanline overlay */}
        <div className="scanline z-10 pointer-events-none"></div>
      </div>

      {/* 2. Glassy Overlay Headers (Tags, Warning alerts) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-start pointer-events-none">
        <span className="text-[9px] font-extrabold uppercase tracking-widest bg-black/45 backdrop-blur-md text-indigo-200 px-2.5 py-1 rounded-full border border-white/10">
          {reel.category}
        </span>
        {reel.hypeScore > 0.8 && (
          <span className="bg-red-500/90 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md animate-pulse">
            <Sparkles className="w-3 h-3" /> Hype Risk
          </span>
        )}
      </div>

      {/* 3. Middle Play Button overlay trigger */}
      {!isSkipped && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform duration-200 focus:outline-none"
            aria-label={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? (
              <RotateCcw className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* 4. Bottom-Left Details Overlay Panel */}
      <div className="absolute bottom-0 left-0 right-14 z-20 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white flex flex-col gap-1.5 pointer-events-none">
        
        <span className="text-[10px] font-black tracking-wider text-slate-350">
          <span>@</span>{reel.creator}
        </span>

        {/* Reel Title */}
        <h3 className="font-extrabold text-sm leading-snug line-clamp-1">
          {reel.title}
        </h3>

        {/* Short description */}
        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium">
          {reel.description}
        </p>

        {/* Watch indicators */}
        <div className="flex gap-1.5 mt-1">
          {isWatchedComplete && (
            <span className="bg-emerald-500/95 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
              <Check className="w-2.5 h-2.5" /> Watched
            </span>
          )}
          {isWatchedPartial && !isWatchedComplete && (
            <span className="bg-amber-500/95 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
              Partial
            </span>
          )}
        </div>

      </div>

      {/* 5. Right-Hand Floating Reels Actions Column */}
      <div className="absolute right-2 bottom-4 z-20 flex flex-col items-center gap-3">
        
        {/* Like Button */}
        <button
          onClick={() => onInteract(reel.id, 'like')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none ${
            isLiked 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/50 backdrop-blur-md text-white/80 hover:bg-black/75'
          }`}
          disabled={isSkipped}
          aria-label="Like video"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
        </button>

        {/* Save Button */}
        <button
          onClick={() => onInteract(reel.id, 'save')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none ${
            isSaved 
              ? 'bg-emerald-505 bg-emerald-500 text-white' 
              : 'bg-black/50 backdrop-blur-md text-white/80 hover:bg-black/75'
          }`}
          disabled={isSkipped}
          aria-label="Save video"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Share Button */}
        <button
          onClick={() => onInteract(reel.id, 'share')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none ${
            isShared 
              ? 'bg-blue-500 text-white' 
              : 'bg-black/50 backdrop-blur-md text-white/80 hover:bg-black/75'
          }`}
          disabled={isSkipped}
          aria-label="Share video"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none ${
            isSkipped 
              ? 'bg-red-650 bg-red-600 text-white animate-pulse' 
              : 'bg-black/50 backdrop-blur-md text-white/80 hover:bg-red-500/30 hover:text-red-400'
          }`}
          aria-label="Skip video"
        >
          <EyeOff className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
export default ReelCard;
