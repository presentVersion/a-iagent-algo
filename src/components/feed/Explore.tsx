import React, { useState } from 'react';
import { InteractionType } from '../../types';
import { DEMO_REELS } from '../../data/demoReels';
import { Search, Compass, Sparkles, Cpu, Award, Zap } from 'lucide-react';
import ReelCard from '../ReelCard';

interface ExploreProps {
  onInteract: (reelId: string, type: InteractionType) => void;
  interactions: Record<string, InteractionType[]>;
}

export const Explore: React.FC<ExploreProps> = ({ onInteract, interactions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = [
    { name: 'AI & Machine Learning', tag: 'ai', icon: Cpu, color: 'from-blue-600 to-indigo-900' },
    { name: 'Data Structures & Algorithms', tag: 'dsa', icon: Award, color: 'from-indigo-600 to-violet-900' },
    { name: 'Cloud Computing & HLD', tag: 'cloud', icon: Zap, color: 'from-cyan-600 to-blue-900' },
    { name: 'Developer Hardware', tag: 'hardware', icon: Compass, color: 'from-emerald-600 to-teal-900' }
  ];

  // Semantic-like search ranking + tag filtering
  const filteredReels = DEMO_REELS.filter(reel => {
    const matchesTag = selectedTag 
      ? (reel.topic.toLowerCase() === selectedTag.toLowerCase() || 
         reel.category.toLowerCase() === selectedTag.toLowerCase() ||
         reel.subtopics.some(s => s.toLowerCase() === selectedTag.toLowerCase()))
      : true;

    if (!searchQuery.trim()) return matchesTag;

    const q = searchQuery.toLowerCase().trim();
    const titleMatch = reel.title.toLowerCase().includes(q);
    const descMatch = reel.description.toLowerCase().includes(q);
    const subMatch = reel.subtopics.some(s => s.toLowerCase().includes(q));
    const topicMatch = reel.topic.toLowerCase().includes(q) || reel.category.toLowerCase().includes(q);

    return matchesTag && (titleMatch || descMatch || subMatch || topicMatch);
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Header bar and search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-accent-primary" />
            Explore Content Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">Discover structured learning topics across all software fields.</p>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search topics, creators, libraries..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTag(null); // clear tag on search
            }}
            className="w-full bg-slate-900 border border-slate-800/80 focus:border-accent-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid Category selections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedTag === cat.tag;
          return (
            <button
              key={cat.tag}
              onClick={() => {
                setSelectedTag(isSelected ? null : cat.tag);
                setSearchQuery(''); // clear query on tag toggle
              }}
              className={`p-4 rounded-2xl text-left border flex flex-col justify-between h-32 transition-all duration-300 relative overflow-hidden group ${
                isSelected 
                  ? 'border-accent-primary bg-indigo-950/20 shadow-md shadow-accent-primary/5 scale-[1.01]' 
                  : 'border-slate-800/80 bg-slate-900/10 hover:border-slate-700/60'
              }`}
            >
              <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-br ${cat.color} opacity-10 rounded-full blur-xl group-hover:scale-125 transition-transform`}></div>
              
              <div className={`p-2.5 rounded-xl shrink-0 w-max ${isSelected ? 'bg-accent-primary text-white' : 'bg-slate-900 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <div className="font-bold text-xs text-slate-200">{cat.name}</div>
                <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Explore Tag</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtered Grid Display Output */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {filteredReels.length} Reels Match Your Selection
          </span>
          {(selectedTag || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTag(null);
                setSearchQuery('');
              }}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredReels.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 border border-slate-850 text-center py-20 flex flex-col items-center justify-center gap-2">
            <Sparkles className="w-10 h-10 text-slate-700 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-200">No Match Found</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              We couldn't find any reels matching your criteria. Try adjusting your query or selecting another tech category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>

    </div>
  );
};
export default Explore;
