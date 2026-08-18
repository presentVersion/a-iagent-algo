import React, { useState } from 'react';
import { Reel, InteractionType, LatentCluster } from '../types';
import ReelCard from './ReelCard';
import { RefreshCw, ShieldCheck } from 'lucide-react';

interface ReelFeedProps {
  reels: Reel[];
  interactions: Record<string, InteractionType[]>;
  onInteract: (reelId: string, type: InteractionType) => void;
  onReset: () => void;
  interests?: LatentCluster[];
}

export const ReelFeed: React.FC<ReelFeedProps> = ({ 
  reels, 
  interactions, 
  onInteract, 
  onReset,
  interests = []
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter and sort logical execution of the feed candidates
  const filteredReels = (() => {
    switch (activeFilter) {
      case 'foryou': {
        if (interests.length === 0) return [...reels];
        // Sort reels by matching the top latent interest cluster score
        const topInterest = interests[0]?.name || 'Software Engineering';
        return [...reels].sort((a, b) => {
          const aMatch = a.domain === topInterest ? 1 : 0;
          const bMatch = b.domain === topInterest ? 1 : 0;
          return bMatch - aMatch;
        });
      }
      case 'coding':
        return reels.filter(r => 
          r.category === 'Coding Meme' || 
          r.category === 'SWE Lifestyle' || 
          r.domain === 'Software Engineering'
        );
      case 'ai':
        return reels.filter(r => 
          r.category === 'AI / ML' || 
          r.domain === 'AI & Machine Learning'
        );
      case 'cloud':
        return reels.filter(r => 
          r.category === 'Cloud' || 
          r.domain === 'Cloud Computing'
        );
      case 'gaming':
        return reels.filter(r => 
          r.category === 'Gaming' || 
          r.domain === 'Game Development'
        );
      default:
        return reels;
    }
  })();

  const filterPills = [
    { id: 'all', label: `All (${reels.length})` },
    { id: 'foryou', label: 'For You (Algorithm)' },
    { id: 'coding', label: 'Coding & SWE' },
    { id: 'ai', label: 'AI & ML' },
    { id: 'cloud', label: 'Cloud & DevOps' },
    { id: 'gaming', label: 'Gaming' }
  ];

  return (
    <section className="flex flex-col gap-6 w-full text-slate-800" aria-labelledby="feed-title">
      
      {/* Feed Title and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 id="feed-title" className="text-lg font-black text-black tracking-tight flex items-center gap-2">
            <span>ScrollIQ Discover Feed</span>
            <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
              Interactive Library
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tap and stream Youtube Shorts. Like, Save, or Skip to train your Latent Interest Profile.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-black px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none"
          aria-label="Reset all feed interactions"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Feed</span>
        </button>
      </div>

      {/* Category Pills Filters */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3" aria-label="Category feed filters">
        {filterPills.map(pill => (
          <button
            key={pill.id}
            onClick={() => setActiveFilter(pill.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all focus:outline-none ${
              activeFilter === pill.id
                ? 'bg-black text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Grid of Reels */}
      {filteredReels.length === 0 ? (
        <div className="text-center py-20 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
          No clips found matching this filter query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReels.map(reel => (
            <ReelCard
              key={reel.id}
              reel={reel}
              onInteract={onInteract}
              interactions={interactions}
            />
          ))}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-150">
        <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
        <p>
          <span className="font-extrabold text-slate-700">Privacy First:</span> ScrollIQ calculates recommendation coordinates inside your secure local session container.
        </p>
      </div>

    </section>
  );
};
export default ReelFeed;
