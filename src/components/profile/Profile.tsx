import React, { useState } from 'react';
import { User, ShieldCheck, RefreshCw, Check } from 'lucide-react';

interface ProfileProps {
  username: string;
  followedTopics: string[];
  onToggleTopic: (topic: string) => void;
  followedCreators: string[];
  onToggleCreator: (creator: string) => void;
  onResetAlgorithm: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  username,
  followedTopics,
  onToggleTopic,
  followedCreators,
  onToggleCreator,
  onResetAlgorithm
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const availableTopics = [
    'AI',
    'DSA',
    'Java',
    'Cloud',
    'Cybersecurity',
    'Hardware',
    'HLD',
    'Career',
    'Web Development',
    'Backend',
    'DevOps',
    'Data Science'
  ];

  const mockCreators = [
    '@code_monkey',
    '@tech_sarah',
    '@dsa_wizard',
    '@hardware_hype',
    '@ai_explained',
    '@cloud_ninja'
  ];

  const handleReset = () => {
    onResetAlgorithm();
    setShowConfirmReset(false);
    alert("Algorithm successfully reset. Recommendation prior profiles returned to default state!");
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-accent-primary" />
          Profile & Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure followed topics and creators for @{username}, and manage privacy settings.</p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Follows (Col-span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Follow Topics */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-200">Follow Topics (Increases prior weights)</span>
            <div className="flex flex-wrap gap-2.5">
              {availableTopics.map(topic => {
                const isFollowed = followedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => onToggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 focus:outline-none ${
                      isFollowed
                        ? 'bg-accent-primary/20 text-accent-secondary border-accent-primary/45 shadow-sm shadow-accent-primary/5'
                        : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {isFollowed && <Check className="w-3.5 h-3.5" />}
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follow Creators */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-200">Follow Creators</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockCreators.map(creator => {
                const isFollowed = followedCreators.includes(creator);
                return (
                  <button
                    key={creator}
                    type="button"
                    onClick={() => onToggleCreator(creator)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all focus:outline-none ${
                      isFollowed
                        ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/45'
                        : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {creator}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Reset & Privacy (Col-span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Privacy Center */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 border-b border-slate-850 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-accent-success" />
              Privacy Center
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-400">
              ScrollIQ prioritizes data autonomy. We never require passwords or scrape external credentials. All scroll mappings are kept inside local storage session variables.
            </p>
          </div>

          {/* Reset Algorithm Console */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 border-b border-slate-850 pb-2.5">
              <RefreshCw className="w-4 h-4 text-red-400" />
              Reset My Algorithm
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-450">
              Clicking below will clear your interest graph profile score weights, dynamic interactions list, and return your scroller feed to cold-start mode.
            </p>

            {showConfirmReset ? (
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] text-amber-500 font-bold">Are you absolutely sure? This cannot be undone.</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-red-650 hover:bg-red-700 text-xs font-bold text-white py-2 rounded-xl transition-all"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 bg-slate-900 border border-slate-800 hover:text-white text-xs font-bold text-slate-400 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-400 py-2.5 rounded-xl transition-all"
              >
                Reset My Feed
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
export default Profile;
