import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Check, 
  Flame, 
  AlertTriangle 
} from 'lucide-react';
import { DEFAULT_RECOMMENDATION_CONFIG } from '../../services/recommendationConfig';

interface AlgorithmSimulatorProps {
  onRecalculateWeights: (newWeights: Record<string, number>) => void;
  onRunTrapScenario: () => void;
}

export const AlgorithmSimulator: React.FC<AlgorithmSimulatorProps> = ({
  onRecalculateWeights,
  onRunTrapScenario
}) => {
  // Sliders states
  const [skip, setSkip] = useState(DEFAULT_RECOMMENDATION_CONFIG.weights.skip);
  const [watchComplete, setWatchComplete] = useState(DEFAULT_RECOMMENDATION_CONFIG.weights.watch_complete);
  const [like, setLike] = useState(DEFAULT_RECOMMENDATION_CONFIG.weights.like);
  const [save, setSave] = useState(DEFAULT_RECOMMENDATION_CONFIG.weights.save);
  const [share, setShare] = useState(DEFAULT_RECOMMENDATION_CONFIG.weights.share);

  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  const handleApply = () => {
    onRecalculateWeights({
      skip,
      watch_partial: 0.2,
      watch_complete: watchComplete,
      like,
      save,
      share
    });
    setSimulatedSuccess(true);
    setTimeout(() => setSimulatedSuccess(false), 2500);
  };

  // Static A/B display data based on Trap Scenario inputs
  const trapReels = [
    { title: "Java NPE Meme", icon: "☕" },
    { title: "Day in the Life of a SWE", icon: "💻" },
    { title: "Coding Interview Joke", icon: "🤯" },
    { title: "Laptop A vs B Hardware Review", icon: "🔌" }
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-accent-primary" />
          Algorithm Sandbox & A/B Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1">Interactively tweak recommendation weights and compare models side-by-side.</p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        
        {/* Sliders Console (Col-span 5) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 border-b border-slate-850 pb-3">
            <Sliders className="w-4 h-4 text-accent-primary" />
            Recalculate Sliders
          </h3>

          <div className="flex flex-col gap-5 text-xs">
            {/* Skip Weight */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-slate-350">
                <span>Skip Video Penalty</span>
                <span className="text-red-400 font-mono">{skip.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="0.0"
                step="0.1"
                value={skip}
                onChange={(e) => setSkip(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                aria-label="Skip video penalty slider"
              />
            </div>

            {/* Watch Complete Weight */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-slate-350">
                <span>Full Watch Completion</span>
                <span className="text-accent-success font-mono">+{watchComplete.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={watchComplete}
                onChange={(e) => setWatchComplete(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                aria-label="Full watch completion weight slider"
              />
            </div>

            {/* Like Weight */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-slate-350">
                <span>Like Interaction</span>
                <span className="text-rose-400 font-mono">+{like.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={like}
                onChange={(e) => setLike(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                aria-label="Like interaction weight slider"
              />
            </div>

            {/* Save Weight */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-slate-350">
                <span>Save/Bookmark Action</span>
                <span className="text-accent-success font-mono">+{save.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={save}
                onChange={(e) => setSave(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                aria-label="Save bookmark weight slider"
              />
            </div>

            {/* Share Weight */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-bold text-slate-350">
                <span>Share Action</span>
                <span className="text-accent-secondary font-mono">+{share.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={share}
                onChange={(e) => setShare(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                aria-label="Share weight slider"
              />
            </div>

            <button
              onClick={handleApply}
              className="mt-2 w-full bg-accent-primary hover:bg-indigo-600 text-white font-extrabold py-3 rounded-xl transition-all focus:outline-none flex items-center justify-center gap-1.5 glow-primary"
            >
              <Cpu className="w-4 h-4" />
              Recalculate Interest Graph
            </button>

            {simulatedSuccess && (
              <div className="text-center text-[10px] text-accent-success font-semibold flex items-center justify-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Applied! Recommendation weights updated dynamically.
              </div>
            )}
          </div>
        </div>

        {/* A/B Comparison Board (Col-span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-accent-secondary" />
                Compare Algorithms: Latent Trap Test
              </h3>
              <button
                onClick={onRunTrapScenario}
                className="bg-accent-secondary hover:bg-teal-600 text-[10px] text-slate-950 font-extrabold px-3 py-1 rounded-lg transition-all"
              >
                🚀 Run Simulation
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-350 block mb-2">Simulated User Watching Behavior:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {trapReels.map((reel, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 flex items-center gap-2">
                      <span className="text-base">{reel.icon}</span>
                      <span className="text-[9px] font-bold text-slate-300 leading-tight">{reel.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Keyword Algorithm */}
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/5 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-red-400 border-b border-red-900/30 pb-1.5">
                    <span>Algorithm A: Keyword-Only</span>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Detected Pattern</span>
                    <div className="text-xs font-extrabold text-slate-200 mt-0.5">Topic: JAVA</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Recommended Reel</span>
                    <div className="text-xs font-extrabold text-slate-300 mt-0.5">"C++ vs Python Memory Management"</div>
                    <p className="text-[9px] text-slate-400 leading-relaxed mt-1 italic">
                      "Recommends based on simple keyword matches like 'code' and 'java' fields."
                    </p>
                  </div>
                </div>

                {/* ScrollIQ Algorithm */}
                <div className="p-4 rounded-xl border border-accent-secondary/20 bg-accent-secondary/5 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-accent-secondary border-b border-accent-secondary/30 pb-1.5">
                    <span>Algorithm B: ScrollIQ Contextual</span>
                    <Flame className="w-3.5 h-3.5 text-accent-secondary animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Inferred Latent Cluster</span>
                    <div className="text-xs font-extrabold text-slate-200 mt-0.5">Topic: SOFTWARE ENGINEERING</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Recommended Discovery</span>
                    <div className="text-xs font-extrabold text-slate-100 mt-0.5 flex items-center gap-1">
                      <span>"Why Big-O Notation Matters"</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed mt-1">
                      "Recognizes Java + Interview + Laptop reviews represent a software engineering context, steering scrollers into high-value computer science logic."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AlgorithmSimulator;
