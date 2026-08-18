import React from 'react';
import { LatentCluster } from '../types';
import { Sparkles, HelpCircle, Ban, ThumbsUp } from 'lucide-react';

interface InterestMapProps {
  interests: LatentCluster[];
  onDislikeInterest: (interestName: string) => void;
  onLikeInterest: (interestName: string) => void;
  topicPenalties: Record<string, number>;
  topicBoosts: Record<string, number>;
}

export const InterestMap: React.FC<InterestMapProps> = ({ 
  interests, 
  onDislikeInterest, 
  onLikeInterest,
  topicPenalties,
  topicBoosts
}) => {
  // Sort and extract active interests
  const activeInterests = interests.filter(i => i.score > 0 || Object.keys(topicBoosts).includes(i.name)).slice(0, 6);
  const primaryInterest = activeInterests[0];

  // Helper to normalize scores into percentages
  const getPercentage = (score: number) => {
    if (score <= 0) return 0;
    const maxScore = Math.max(...interests.map(i => i.score), 1);
    return Math.min(Math.round((score / maxScore) * 100), 100);
  };

  // --- SVG RADAR CHART GENERATOR ---
  const renderRadarChart = () => {
    const size = 220;
    const center = size / 2;
    const rMax = 80;
    const numAxes = 5;
    
    // Axes labels
    const axesLabels = ['SWE', 'AI & ML', 'DevOps', 'Cyber', 'Career'];
    const axesKeys = [
      'Software Engineering',
      'AI & ML',
      'Cloud & DevOps',
      'Cybersecurity',
      'Career Growth'
    ];

    // Compute coordinate points
    const polygonVertices: string[] = [];

    // Concentric grid lines helper
    const gridLines = [0.25, 0.5, 0.75, 1.0];

    return (
      <div className="flex flex-col items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm w-full">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 self-start">
          Interest Distribution Radar
        </h4>
        
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Concentric grid lines */}
          {gridLines.map((fraction, index) => {
            const r = rMax * fraction;
            const pointsList = Array.from({ length: numAxes }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <polygon
                key={index}
                points={pointsList}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          })}

          {/* Axes lines and labels */}
          {axesLabels.map((label, i) => {
            const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
            
            // Outer point
            const xLine = center + rMax * Math.cos(angle);
            const yLine = center + rMax * Math.sin(angle);

            // Label position (floated slightly outwards)
            const xLabel = center + (rMax + 20) * Math.cos(angle);
            const yLabel = center + (rMax + 14) * Math.sin(angle);

            // Fetch actual score mapping
            const keyName = axesKeys[i];
            const interestItem = interests.find(item => item.name === keyName);
            const scoreVal = interestItem ? interestItem.score : 0;
            const maxScore = Math.max(...interests.map(item => item.score), 1);
            const normalizedFraction = Math.max(0.1, Math.min(scoreVal / maxScore, 1.0));

            // Compute data point
            const xData = center + (rMax * normalizedFraction) * Math.cos(angle);
            const yData = center + (rMax * normalizedFraction) * Math.sin(angle);
            polygonVertices.push(`${xData},${yData}`);

            return (
              <g key={i}>
                {/* Axis line */}
                <line
                  x1={center}
                  y1={center}
                  x2={xLine}
                  y2={yLine}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                
                {/* Label text */}
                <text
                  x={xLabel}
                  y={yLabel}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-[9px] font-extrabold text-slate-500 tracking-tight"
                >
                  {label}
                </text>

                {/* Data point dot */}
                <circle
                  cx={xData}
                  cy={yData}
                  r="3.5"
                  fill="#6366f1"
                  className="shadow-sm"
                />
              </g>
            );
          })}

          {/* Core Data Area Polygon */}
          {polygonVertices.length > 0 && (
            <polygon
              points={polygonVertices.join(' ')}
              fill="rgba(99, 102, 241, 0.2)"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-6 transition-colors duration-300" aria-labelledby="interest-map-title">
      
      {/* Header Info */}
      <div>
        <h2 id="interest-map-title" className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span>Latent Interest Inference Map</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          ScrollIQ aggregates your content interaction signals into semantic clusters.
        </p>
      </div>

      {activeInterests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
          <HelpCircle className="w-10 h-10 text-slate-350 mb-3 animate-pulse" />
          <p className="text-xs font-bold">No scroll interactions recorded yet.</p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[240px]">
            Stream Reels on the feed to trigger interest signal coordinates!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Semantic list & Radar Chart */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Semantic Clusters</h3>
              
              <div className="flex flex-col gap-2.5">
                {activeInterests.map(interest => {
                  const percentage = getPercentage(interest.score);
                  const isPenalized = !!topicPenalties[interest.name];
                  const isBoosted = !!topicBoosts[interest.name];
                  
                  return (
                    <div key={interest.name} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-extrabold ${isPenalized ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {interest.name}
                          </span>
                          {isBoosted && (
                            <span className="text-[8px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.2 rounded-full border border-emerald-100">
                              Boosted
                            </span>
                          )}
                          {isPenalized && (
                            <span className="text-[8px] bg-red-50 text-red-500 font-bold px-1.5 py-0.2 rounded-full border border-red-100">
                              Muted
                            </span>
                          )}
                        </div>
                        
                        {/* Interaction adjustment buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onLikeInterest(interest.name)}
                            className={`p-1 rounded-lg hover:bg-slate-200 transition-colors focus:outline-none ${isBoosted ? 'text-emerald-600' : 'text-slate-400'}`}
                            title="Boost category"
                            aria-label={`Boost ${interest.name}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDislikeInterest(interest.name)}
                            className={`p-1 rounded-lg hover:bg-slate-200 transition-colors focus:outline-none ${isPenalized ? 'text-red-500' : 'text-slate-400'}`}
                            title="Mute category"
                            aria-label={`Mute ${interest.name}`}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            isPenalized 
                              ? 'bg-slate-300' 
                              : interest.name === primaryInterest.name 
                              ? 'bg-black' 
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Render radar chart */}
            {renderRadarChart()}

          </div>

          {/* RIGHT COLUMN: LiveChat Style Interactive Interest Network Graph */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden bg-[#E2DFD5] border border-white/60 relative h-[480px] shadow-sm select-none">
            
            {/* Header label flag (orange-brown) */}
            <div className="absolute top-0 left-0 bg-[#D37D4B] text-white py-3.5 px-5 rounded-br-3xl z-10 shadow-sm">
              <h3 className="text-xs font-black tracking-wider uppercase">Interest Graph</h3>
              <p className="text-[9px] text-white/80 font-medium leading-normal mt-0.5 max-w-[200px]">
                Network of topics you share interests with, based on interactive feedback loops.
              </p>
            </div>

            {/* Interactive SVG Network Map */}
            <svg width="100%" height="100%" viewBox="0 0 500 480" className="absolute inset-0">
              
              {/* Connecting lines - Solid & Dashed */}
              {/* Core to Sub-nodes */}
              <line x1="250" y1="240" x2="250" y2="120" stroke="white" strokeWidth="3" />
              <line x1="250" y1="240" x2="360" y2="170" stroke="white" strokeWidth="3" />
              <line x1="250" y1="240" x2="350" y2="330" stroke="white" strokeWidth="3" />
              <line x1="250" y1="240" x2="250" y2="380" stroke="white" strokeWidth="3" />
              <line x1="250" y1="240" x2="150" y2="330" stroke="white" strokeWidth="3" />
              <line x1="250" y1="240" x2="140" y2="170" stroke="white" strokeWidth="3" strokeDasharray="3,3" />

              {/* Sub-node linkages */}
              <line x1="250" y1="120" x2="360" y2="170" stroke="white" strokeWidth="2.5" strokeDasharray="4,4" />
              <line x1="350" y1="330" x2="250" y2="380" stroke="white" strokeWidth="2.5" />
              
              {/* Branch Node linkages (Planes/Flying nodes) */}
              <line x1="140" y1="170" x2="80" y2="100" stroke="white" strokeWidth="2.5" />
              <line x1="140" y1="170" x2="160" y2="80" stroke="white" strokeWidth="2.5" />
              <line x1="80" y1="100" x2="160" y2="80" stroke="white" strokeWidth="2.5" />

              {/* Auxiliary Joint Dots */}
              <circle cx="70" cy="180" r="4.5" fill="white" />
              <line x1="140" y1="170" x2="70" y2="180" stroke="white" strokeWidth="2" />
              
              <circle cx="410" cy="110" r="5" fill="white" />
              <line x1="360" y1="170" x2="410" y2="110" stroke="white" strokeWidth="2" />
              
              <circle cx="420" cy="270" r="4.5" fill="white" />
              <line x1="350" y1="330" x2="420" y2="270" stroke="white" strokeWidth="2.2" />

              <circle cx="100" cy="380" r="5" fill="white" />
              <line x1="150" y1="330" x2="100" y2="380" stroke="white" strokeWidth="2" strokeDasharray="3,3" />

              {/* Render Node Circles (turqoise/cyan nodes with thick white borders) */}
              
              {/* Main central node (TRAVEL equivalents) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle
                  cx="250"
                  cy="240"
                  r="56"
                  fill="#7ED4C7"
                  stroke="white"
                  strokeWidth="5"
                  className="shadow-md"
                />
                <text
                  x="250"
                  y="240"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#005A51"
                  className="text-xs font-black uppercase tracking-wider text-center"
                >
                  {primaryInterest.name.split(' ')[0]}
                </text>
              </g>

              {/* Sub-node 1 (top) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="250" cy="120" r="32" fill="#8AE2D5" stroke="white" strokeWidth="4.5" className="shadow-sm" />
                <text x="250" y="120" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[9px] font-black uppercase">
                  DSA
                </text>
              </g>

              {/* Sub-node 2 (top-right) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="360" cy="170" r="34" fill="#8AE2D5" stroke="white" strokeWidth="4.5" className="shadow-sm" />
                <text x="360" y="170" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[9px] font-black uppercase">
                  AI / ML
                </text>
              </g>

              {/* Sub-node 3 (bottom-right) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="350" cy="330" r="33" fill="#8AE2D5" stroke="white" strokeWidth="4.5" className="shadow-sm" />
                <text x="350" y="330" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[8px] font-black uppercase">
                  CLOUD
                </text>
              </g>

              {/* Sub-node 4 (bottom) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="250" cy="380" r="34" fill="#8AE2D5" stroke="white" strokeWidth="4.5" className="shadow-sm" />
                <text x="250" y="380" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[8px] font-black uppercase">
                  CYBER
                </text>
              </g>

              {/* Sub-node 5 (bottom-left) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="150" cy="330" r="32" fill="#8AE2D5" stroke="white" strokeWidth="4.5" className="shadow-sm" />
                <text x="150" y="330" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[9px] font-black uppercase">
                  CAREER
                </text>
              </g>

              {/* Sub-node 6 (left) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="140" cy="170" r="32" fill="#8AE2D5" stroke="white" strokeWidth="4.5" className="shadow-sm" />
                <text x="140" y="170" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[8px] font-black uppercase">
                  MEMES
                </text>
              </g>

              {/* Secondary Branch Node 7a (Planes) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="80" cy="100" r="22" fill="#9BF0E4" stroke="white" strokeWidth="3.5" className="shadow-sm" />
                <text x="80" y="100" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[7px] font-black uppercase">
                  SYNTAX
                </text>
              </g>

              {/* Secondary Branch Node 7b (Flying) */}
              <g className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <circle cx="160" cy="80" r="22" fill="#9BF0E4" stroke="white" strokeWidth="3.5" className="shadow-sm" />
                <text x="160" y="80" textAnchor="middle" alignmentBaseline="middle" fill="#005A51" className="text-[7px] font-black uppercase">
                  LAPTOPS
                </text>
              </g>

            </svg>

            {/* Footer brand mock */}
            <span className="absolute bottom-3 right-4 text-[9px] text-slate-500 font-extrabold tracking-wider">
              Brought to you by ScrollIQ
            </span>

          </div>

        </div>
      )}

    </section>
  );
};
export default InterestMap;
