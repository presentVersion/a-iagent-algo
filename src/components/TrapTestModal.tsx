import React, { useState, useEffect } from 'react';
import { X, Play, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface TrapTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTrapScenario: () => void;
}

export const TrapTestModal: React.FC<TrapTestModalProps> = ({ isOpen, onClose, onRunTrapScenario }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setIsPlaying(false);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < 5) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 4000); // 4 seconds per step
    } else if (step === 5) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  if (!isOpen) return null;

  const handleStart = () => {
    setIsPlaying(true);
    setStep(1);
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    }
  };

  const handleApply = () => {
    onRunTrapScenario();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="trap-title">
      <div className="relative w-full max-w-2xl bg-surface border border-indigo-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Banner */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-danger to-indigo-600"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-secondary animate-pulse" />
            <h2 id="trap-title" className="text-base font-bold text-slate-100">
              Jury Demo: The Latent Interest Trap Test
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Steps Indicator */}
        <div className="px-6 pt-4 flex justify-between gap-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          <span className={step >= 1 ? 'text-indigo-400' : ''}>1. Inputs</span>
          <span className={step >= 2 ? 'text-indigo-400' : ''}>2. Analysis</span>
          <span className={step >= 3 ? 'text-indigo-400' : ''}>3. Keyword Trap</span>
          <span className={step >= 4 ? 'text-indigo-400' : ''}>4. Latent Inference</span>
          <span className={step >= 5 ? 'text-indigo-400' : ''}>5. Bridge Recommendation</span>
        </div>
        <div className="px-6 mt-1 flex gap-1 h-1.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div 
              key={idx} 
              className={`flex-1 rounded-full transition-all duration-300 ${
                step > idx ? 'bg-indigo-500' : 'bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        {/* Content Box */}
        <div className="p-6 min-h-[280px] flex flex-col justify-center">
          
          {/* Step 0: Welcome / Start */}
          {step === 0 && (
            <div className="text-center flex flex-col items-center gap-4 py-6">
              <Play className="w-12 h-12 text-accent-primary animate-pulse" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Welcome to the ScrollSense AI Trap Demo</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Observe how typical keyword recommendation models fall into the "Java Meme Trap" and how our Latent Interest Inference maps a student's scrolls to software engineering instead.
                </p>
              </div>
              <button
                onClick={handleStart}
                className="bg-accent-primary text-xs font-bold text-white px-5 py-2.5 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none flex items-center gap-1.5"
              >
                Start Walkthrough (60s)
              </button>
            </div>
          )}

          {/* Step 1: Inputs */}
          {step === 1 && (
            <div className="flex flex-col gap-3 animate-slide-up">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 1: Student Interaction History
              </div>
              <p className="text-xs text-slate-300">
                A student scrolls and interacts with these four reels. Individually they look unrelated:
              </p>
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-[11px]">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="font-bold text-amber-500">1. NullPointerException Meme</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Topic: Java • Intent: Humor</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="font-bold text-blue-400">2. Day in Life of Software Eng</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Topic: SWE • Intent: Lifestyle</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="font-bold text-purple-400">3. Coding Interview Expectations</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Topic: DSA • Intent: Humor</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="font-bold text-emerald-400">4. Laptop A vs Laptop B</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Topic: Hardware • Intent: Review</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: AI Loading */}
          {step === 2 && (
            <div className="flex flex-col gap-4 items-center text-center animate-slide-up">
              <div className="w-10 h-10 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm">Analyzing scroll history...</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
                  ScrollSense AI checks categories, parses intent metadata, weights the interaction logs, and forms semantic interest links.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Keyword Trap */}
          {step === 3 && (
            <div className="flex flex-col gap-3.5 animate-slide-up">
              <div className="text-xs font-bold text-accent-danger uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> The Keyword-only recommendation trap
              </div>
              <p className="text-xs text-slate-300">
                A shallow system only sees raw text keywords. Since the student watched a Java meme, it makes this recommendation:
              </p>
              
              <div className="p-4 rounded-xl border border-red-500/25 bg-red-950/10 flex items-center gap-3">
                <div className="text-2xl">❌</div>
                <div>
                  <div className="text-xs font-bold text-red-400">Shallow Keyword Inference: "Java"</div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">"Java Tutorial: Syntax error compilation #14"</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Critique: Fails to build career interest. Leads to repetitive meme scrolling.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Latent Inference */}
          {step === 4 && (
            <div className="flex flex-col gap-3.5 animate-slide-up">
              <div className="text-xs font-bold text-accent-success uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-accent-success" /> Context-Aware Latent Inference
              </div>
              <p className="text-xs text-slate-300">
                Our model aggregates semantic signals. The combination of Java, developer workflows, and programming interview topics points to:
              </p>
              
              <div className="p-4 rounded-xl border border-accent-success/30 bg-accent-success/10 flex items-center gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="text-xs font-bold text-accent-success">Latent Cluster Detected: Software Engineering / Technology</div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">Confidence: HIGH</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Reasoning: Matches syntax + lifestyle + interview signals across multiple content styles.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Final bridge recommendation */}
          {step === 5 && (
            <div className="flex flex-col gap-3 animate-slide-up">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Step 5: High-Quality Bridge Recommendation
              </div>
              <p className="text-xs text-slate-300">
                We generate a recommendation that matches the latent target and provides actual learning value:
              </p>

              <div className="bg-indigo-950/15 p-4 rounded-xl border border-indigo-900/30 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-indigo-400 uppercase">DSA / Intermediate</span>
                  <span className="font-medium text-slate-500">Hype risk: Low</span>
                </div>
                <div className="font-bold text-slate-100 text-xs">
                  "How DSA Patterns Actually Help in Coding Interviews"
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Connects the user's entertainment scrolls to algorithmic complexity and computer science career preparation.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center">
          <div className="text-[10px] text-slate-400 italic">
            {isPlaying ? 'Auto-playing demo...' : 'Step-by-step mode'}
          </div>

          <div className="flex gap-2">
            {step > 0 && step < 5 && (
              <button
                onClick={handleNext}
                className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700"
              >
                Next Step
              </button>
            )}

            {step === 5 ? (
              <button
                onClick={handleApply}
                className="bg-accent-primary text-xs font-bold text-white px-5 py-2.5 rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none"
              >
                Load Trap Test Results on Dashboard
              </button>
            ) : (
              step === 0 && (
                <button
                  onClick={handleApply}
                  className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-lg border border-slate-800"
                >
                  Skip Walkthrough & Load Data
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrapTestModal;
