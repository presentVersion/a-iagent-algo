import React from 'react';
import { LatentCluster, ImpactMetrics } from '../../types';
import { 
  TrendingUp, 
  Cpu, 
  Activity, 
  Clock,
  Sparkles
} from 'lucide-react';

interface AnalyticsProps {
  interests: LatentCluster[];
  metrics: ImpactMetrics;
  historyLogs: Array<{ timestamp: string; action: string; topInterest: string; score: number }>;
}

const getScallopPath = (radius = 40, numScallops = 16, depth = 4) => {
  let path = "";
  for (let i = 0; i <= numScallops; i++) {
    const theta = (i * 2 * Math.PI) / numScallops;
    const nextTheta = ((i + 1) * 2 * Math.PI) / numScallops;
    const x = 50 + radius * Math.cos(theta);
    const y = 50 + radius * Math.sin(theta);
    const midTheta = theta + (Math.PI / numScallops);
    const mx = 50 + (radius - depth) * Math.cos(midTheta);
    const my = 50 + (radius - depth) * Math.sin(midTheta);
    const nx = 50 + radius * Math.cos(nextTheta);
    const ny = 50 + radius * Math.sin(nextTheta);
    if (i === 0) path += `M ${x} ${y}`;
    path += ` Q ${mx} ${my} ${nx} ${ny}`;
  }
  return path;
};

export const Analytics: React.FC<AnalyticsProps> = ({
  interests,
  metrics,
  historyLogs
}) => {

  const totalScores = interests.reduce((acc, curr) => acc + Math.max(curr.score, 0), 0) || 1;

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-primary" />
          Scroll Insights & Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">Trace how ScrollIQ transforms scrolling into technology mapping in real time.</p>
      </div>

      {/* Live HUD Impact Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1.5 relative overflow-hidden">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Useful Tech Found</div>
          <div className="text-2xl font-extrabold text-white flex items-center gap-1.5">
            <span>{metrics.reelsDiscovered}</span>
            <span className="text-[10px] bg-accent-primary/20 text-accent-secondary border border-accent-primary/20 px-1.5 py-0.2 rounded font-bold uppercase">Live</span>
          </div>
          <p className="text-[9px] text-slate-500">CS & engineering topics filtered.</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1.5">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Learning Modules</div>
          <div className="text-2xl font-extrabold text-white">{metrics.topicsExplored}</div>
          <p className="text-[9px] text-slate-500">Unique technology clusters identified.</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1.5">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Study Value Accumulation</div>
          <div className="text-2xl font-extrabold text-accent-success flex items-center gap-1">
            <span>{metrics.learningMinutes} mins</span>
          </div>
          <p className="text-[9px] text-slate-500">Simulated conversion of scroll time.</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1.5">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hype Clickbait Flagged</div>
          <div className="text-2xl font-extrabold text-amber-500">97%</div>
          <p className="text-[9px] text-slate-500">Demo algorithm hype-bypass rate.</p>
        </div>
      </div>

      {/* 🧠 ScrollIQ Interest Stamp Capsules (Modern Reference Theme) */}
      <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 flex flex-col gap-5 bg-gradient-to-br from-slate-900/10 via-slate-900/30 to-indigo-950/15 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-400" />
            ScrollIQ Interest Capsules (Modern Aesthetic)
          </h3>
          <span className="text-[8px] bg-indigo-500/20 text-indigo-400 font-extrabold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest">
            Learning Profile Circles
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 py-4">
          
          {/* Capsule 1: Software Engineering (Blue Scalloped Stamp Badge) */}
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-20 h-20 flex items-center justify-center text-sky-400 hover:text-sky-300 transition-all hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-sky-950/40 stroke-sky-500 stroke-2 drop-shadow-md">
                <path d={getScallopPath(40, 16, 4)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <span className="text-[9px] font-extrabold text-sky-350">x</span>
                <span className="text-[8px] font-extrabold tracking-tighter">UI/UX</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-slate-300">Software Eng.</span>
          </div>

          {/* Capsule 2: AI & Machine Learning (Pink Solid Circle Badge) */}
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-450 text-white flex flex-col items-center justify-center shadow-lg border border-rose-400/30 hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-[8px] font-bold tracking-widest mt-1">AI/ML</span>
            </div>
            <span className="text-[10px] font-extrabold text-slate-300">AI & ML</span>
          </div>

          {/* Capsule 3: Cloud Computing (Purple Rounded Square Badge) */}
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500 hover:bg-indigo-400 text-white flex flex-col items-center justify-center shadow-lg border border-indigo-400/30 hover:scale-105 transition-all">
              <Cpu className="w-5 h-5" />
              <span className="text-[8px] font-bold tracking-widest mt-1">CLOUD</span>
            </div>
            <span className="text-[10px] font-extrabold text-slate-300">Cloud Systems</span>
          </div>

          {/* Capsule 4: Data Structures & Algorithms (Cyan Custom circular stamp Badge) */}
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-20 h-20 flex items-center justify-center text-cyan-400 hover:text-cyan-350 transition-all hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-cyan-950/40 stroke-cyan-500 stroke-2 drop-shadow-md">
                <path d={getScallopPath(40, 12, 5)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <span className="text-[8px] font-extrabold text-cyan-300">DSA</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-slate-300">Algorithms</span>
          </div>

        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* Left Col: Live Interest Profile (Col-span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-accent-primary" />
                Live Interest Clusters Mapping
              </h3>
              <span className="text-[9px] bg-accent-primary/20 text-accent-secondary font-bold border border-accent-primary/30 px-2 py-0.5 rounded uppercase tracking-wider">
                Active Inference
              </span>
            </div>

            <div className="flex flex-col gap-4.5">
              {interests.map(interest => {
                const percentage = Math.max(0, Math.min(100, Math.round((Math.max(interest.score, 0) / totalScores) * 100)));
                return (
                  <div key={interest.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-350">{interest.name}</span>
                      <span className="font-mono text-slate-400 font-semibold">{interest.score.toFixed(1)} pts ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className="bg-accent-primary h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    {interest.evidenceCount > 0 && (
                      <p className="text-[9px] text-slate-500 italic mt-0.5">
                        Based on: {interest.reasons.slice(-1)[0]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Timeline & History Logs (Col-span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Interest Evolution Timeline */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 border-b border-slate-800/80 pb-3">
              <TrendingUp className="w-4 h-4 text-accent-secondary" />
              Interest Evolution Timeline
            </h3>

            {historyLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-550 text-xs">
                Timeline logs will populate once interactions are registered.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                {historyLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-[10px] leading-relaxed border-l-2 border-slate-800 pl-3.5 relative">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-accent-secondary border border-slate-950"></div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
                        <span>{log.timestamp}</span>
                        <span className="text-slate-400 font-bold uppercase">{log.action}</span>
                      </div>
                      <p className="text-slate-300 font-semibold mt-0.5">
                        Top cluster shifted to <span className="text-accent-secondary">"{log.topInterest}"</span> ({log.score} pts)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Notice */}
          <div className="bg-slate-950/80 border border-slate-850 p-4.5 rounded-2xl text-[10px] leading-relaxed text-slate-400 flex items-start gap-2.5">
            <Clock className="w-4.5 h-4.5 text-accent-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">Simulation Compliance</span>
              Study value conversion times and Clickbait avoidances are simulated metrics calibrated to standard developer scroll studies. Real-time inference tracks active session interaction clicks.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
export default Analytics;
