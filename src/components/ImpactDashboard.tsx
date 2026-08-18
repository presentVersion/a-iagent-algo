import React from 'react';
import { ImpactMetrics } from '../types';
import { Activity, Brain, Clock, ShieldCheck, TrendingUp, Info } from 'lucide-react';

interface ImpactDashboardProps {
  metrics: ImpactMetrics;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ metrics }) => {
  return (
    <section className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col gap-6" aria-labelledby="impact-dashboard-title">
      <div>
        <h2 id="impact-dashboard-title" className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-secondary" />
          <span>ScrollSense AI Impact Dashboard</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          ScrollSense AI redirects social scrolling attention towards educational resources and tech career learning path topics.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Useful Discoveries</div>
            <div className="text-xl font-bold text-slate-100 mt-0.5">{metrics.reelsDiscovered}</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Brain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Topics Explored</div>
            <div className="text-xl font-bold text-slate-100 mt-0.5">{metrics.topicsExplored}</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Career Matches</div>
            <div className="text-xl font-bold text-slate-100 mt-0.5">{metrics.careerTopicsFound}</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Learning Minutes</div>
            <div className="text-xl font-bold text-slate-100 mt-0.5">{metrics.learningMinutes}m</div>
          </div>
        </div>
      </div>

      {/* Educational Ratio Visual Bar */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-300">Feed Educational vs. Pure Entertainment Ratio:</span>
          <span className="font-bold text-accent-secondary">{Math.round(metrics.educationalRatio * 100)}% Educational</span>
        </div>
        
        <div className="w-full bg-slate-950 rounded-full h-2.5 flex overflow-hidden">
          <div 
            className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2.5 transition-all duration-500" 
            style={{ width: `${metrics.educationalRatio * 100}%` }}
          ></div>
          <div 
            className="bg-slate-800 h-2.5 transition-all duration-500 flex-1"
          ></div>
        </div>
        
        <p className="text-[10px] text-slate-500">
          * Calculated based on interaction weights of educational topics (AI, DSA, Cloud, HLD, Hardware, Career) vs. pure entertainment/memes.
        </p>
      </div>

      {/* Demo metrics warning statement */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-950/20 p-2.5 rounded-lg border border-slate-900/50">
        <Info className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <p>
          <span className="font-semibold text-slate-400">DEMO DATA:</span> These dashboard metrics illustrate potential social/educational value and are not real-world population statistics.
        </p>
      </div>
    </section>
  );
};
export default ImpactDashboard;
