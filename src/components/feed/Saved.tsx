import React, { useState } from 'react';
import { InteractionType } from '../../types';
import { DEMO_REELS } from '../../data/demoReels';
import { Bookmark, Search, FolderHeart } from 'lucide-react';
import ReelCard from '../ReelCard';

interface SavedProps {
  onInteract: (reelId: string, type: InteractionType) => void;
  interactions: Record<string, InteractionType[]>;
}

export const Saved: React.FC<SavedProps> = ({ onInteract, interactions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');

  // Folders map to reel categories
  const folders = ['All', 'AI', 'Programming', 'Career', 'Hardware', 'Cloud', 'Cybersecurity'];

  // Retrieve all saved reel IDs from interactions state
  const savedIds = Object.keys(interactions).filter(id => 
    interactions[id]?.includes('save')
  );

  const savedReels = DEMO_REELS.filter(r => savedIds.includes(r.id));

  // Filter saved list based on search and selected folder category
  const filteredSaved = savedReels.filter(reel => {
    const matchesFolder = selectedFolder === 'All' 
      ? true 
      : (reel.category.toLowerCase().includes(selectedFolder.toLowerCase()) || 
         reel.topic.toLowerCase().includes(selectedFolder.toLowerCase()));

    if (!searchQuery.trim()) return matchesFolder;

    const q = searchQuery.toLowerCase().trim();
    return matchesFolder && (
      reel.title.toLowerCase().includes(q) ||
      reel.description.toLowerCase().includes(q) ||
      reel.creator.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Header bar and search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent-success" />
            Your Saved Discoveries
          </h2>
          <p className="text-xs text-slate-400 mt-1">Reference and review high-value clips you bookmarked during scrolling.</p>
        </div>

        {/* Search bar inside Saved */}
        {savedReels.length > 0 && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search your saved clips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800/80 focus:border-accent-success focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 transition-colors"
            />
          </div>
        )}
      </div>

      {savedReels.length === 0 ? (
        /* Empty State */
        <div className="glass-panel rounded-2xl p-12 border border-slate-850 text-center py-24 flex flex-col items-center justify-center gap-3">
          <FolderHeart className="w-12 h-12 text-slate-700 animate-bounce" />
          <h3 className="font-bold text-sm text-slate-200">No Bookmarks Saved</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Your saved discoveries will appear here. Tap the <span className="font-semibold text-accent-success">Save</span> button on any Reel to keep a learning reference.
          </p>
        </div>
      ) : (
        /* Folder Categorization Chips */
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-4">
            {folders.map(folder => {
              const count = folder === 'All' 
                ? savedReels.length 
                : savedReels.filter(r => r.category.toLowerCase().includes(folder.toLowerCase()) || r.topic.toLowerCase().includes(folder.toLowerCase())).length;

              const isSelected = selectedFolder === folder;

              return (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all focus:outline-none ${
                    isSelected 
                      ? 'bg-accent-success/20 text-accent-success border-accent-success/40' 
                      : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  aria-label={`View folder ${folder}`}
                >
                  {folder} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid Render */}
          {filteredSaved.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No saved items match your criteria in this folder.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSaved.map(reel => (
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
      )}

    </div>
  );
};
export default Saved;
