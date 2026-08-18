import React from 'react';
import { 
  Home, 
  Compass, 
  Users, 
  Bookmark, 
  BarChart2, 
  User, 
  LogOut, 
  Award, 
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  username: string;
  onLogout: () => void;
  learningMode: boolean;
  setLearningMode: (val: boolean) => void;
  careerMode: boolean;
  setCareerMode: (val: boolean) => void;
  makeUseful: boolean;
  setMakeUseful: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  username,
  onLogout,
  learningMode,
  setLearningMode,
  careerMode,
  setCareerMode,
  makeUseful,
  setMakeUseful
}) => {
  
  const menuItems = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'saved', label: 'Saved Reels', icon: Bookmark },
    { id: 'analytics', label: 'Scroll Insights', icon: BarChart2 },
    { id: 'profile', label: 'Profile Settings', icon: User }
  ];

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between h-[calc(100vh-73px)] sticky top-[73px] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Upper Menu Navigation */}
      <div className="flex flex-col gap-5">
        
        {/* Profile Card Header (Bogdan Nikitin Style) */}
        <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            {/* Colorful abstract background container */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-450 via-purple-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center">
              <img 
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'guest'}`} 
                alt="Avatar" 
                className="w-full h-full rounded-full bg-white dark:bg-slate-800 object-cover border border-slate-100 dark:border-slate-700" 
              />
            </div>
            {/* Online Green Indicator Dot */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-accent-success rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>
          <div className="text-center mt-1">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white block">@{username || 'Guest'}</span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block mt-0.5">student</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Sidebar Navigation">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-[14px] text-xs font-bold transition-all duration-200 focus:outline-none ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
                aria-label={`Go to ${item.label}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Mode Boost Toggles */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-5 flex flex-col gap-3.5">
          <div className="text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px] font-extrabold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent-secondary" />
            <span>Scroll Optimization</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Make Feed More Useful */}
            <div className="flex items-center justify-between">
              <label htmlFor="make-useful-toggle" className="flex flex-col text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Make Feed Useful</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">Boosts CS & Careers</span>
              </label>
              <button
                id="make-useful-toggle"
                onClick={() => setMakeUseful(!makeUseful)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  makeUseful ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
                aria-label="Toggle make feed useful mode"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-250 ${
                  makeUseful ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Learning Mode */}
            <div className="flex items-center justify-between">
              <label htmlFor="learning-mode-toggle" className="flex flex-col text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <span className="flex items-center gap-1">
                  <span>Learning Path</span>
                  <Award className="w-3 h-3 text-amber-500" />
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">Blocks hype / clickbait</span>
              </label>
              <button
                id="learning-mode-toggle"
                onClick={() => setLearningMode(!learningMode)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  learningMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
                aria-label="Toggle learning pathway mode"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-250 ${
                  learningMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Career Mode */}
            <div className="flex items-center justify-between">
              <label htmlFor="career-mode-toggle" className="flex flex-col text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Career Sprint</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">Prioritizes DSA/HLD</span>
              </label>
              <button
                id="career-mode-toggle"
                onClick={() => setCareerMode(!careerMode)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  careerMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
                aria-label="Toggle career mode"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-250 ${
                  careerMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          ScrollIQ Account
        </span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100/60 dark:hover:bg-red-900/50 px-2.5 py-1.5 rounded-xl transition-all focus:outline-none"
          title="Sign out of ScrollIQ"
          aria-label="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );
};
export default Sidebar;
