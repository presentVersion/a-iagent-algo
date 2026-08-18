import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { LatentCluster, RecommendationResult } from '../../types';

interface AskScrollIQProps {
  interests: LatentCluster[];
  recommendation: RecommendationResult | null;
  setLearningMode: (val: boolean) => void;
}

export const AskScrollIQ: React.FC<AskScrollIQProps> = ({
  interests,
  recommendation,
  setLearningMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am your ScrollIQ recommendation assistant. Ask me why you see certain reels or how to improve your feed!' }
  ]);
  const [inputText, setInputText] = useState('');

  const topInterest = interests[0]?.name || "Software Engineering";

  const presetPrompts = [
    { label: 'Why this feed?', query: 'Why am I seeing these reels?' },
    { label: 'Study next?', query: 'What technology topic should I study next?' },
    { label: 'Filter clickbait!', query: 'Enable anti-hype filter' }
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const updatedMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(updatedMessages);
    setInputText('');

    // Generate context-aware bot reply
    setTimeout(() => {
      let replyText = "";
      const q = textToSend.toLowerCase();

      if (q.includes('why') || q.includes('reason') || q.includes('feed')) {
        if (recommendation) {
          replyText = `We detected a strong latent interest in ${topInterest} (relevance score: ${interests[0]?.score || 0} pts) based on your interactions. The current recommended reel, "${recommendation.recommendation.title}", was chosen because: "${recommendation.recommendation.why}".`;
        } else {
          replyText = `Based on your scroll signals, your primary interest cluster is ${topInterest}. Interact with more reels (like, save, view) and click "Analyze Scroll" to see details.`;
        }
      } else if (q.includes('next') || q.includes('study') || q.includes('learn')) {
        replyText = `Given your interest profile mapping, we suggest diving into the ${topInterest} pathway. You can toggle "Learning Path Mode" in the sidebar to trace structured concepts step-by-step!`;
      } else if (q.includes('clickbait') || q.includes('anti-hype') || q.includes('filter')) {
        setLearningMode(true);
        replyText = `Done! I have activated "Learning Path Mode" in your settings. This adds a severe weight penalty to sensationalized clickbait reels (e.g. "guaranteed job" schemes) and prioritizes raw technical depth.`;
      } else {
        replyText = `Your current primary interest is ${topInterest}. You can modify this by liking or saving topics (e.g. Cloud, DSA, AI) or skipping hardware videos to tell the scoring engine to adjust!`;
      }

      setMessages([...updatedMessages, { sender: 'bot' as const, text: replyText }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Chat Window container */}
      {isOpen && (
        <div className="w-80 h-96 rounded-2xl border border-slate-800 bg-surface shadow-2xl flex flex-col mb-4 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-accent-primary" />
              <span className="text-xs font-bold text-slate-200">Ask ScrollIQ</span>
              <Sparkles className="w-3.5 h-3.5 text-accent-secondary animate-pulse" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-500 hover:text-slate-200 focus:outline-none"
              aria-label="Close chat assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-[11px] leading-relaxed">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-xl ${
                  m.sender === 'user'
                    ? 'self-end bg-accent-primary text-white rounded-br-none'
                    : 'self-start bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Preset queries */}
          <div className="px-4 py-2 border-t border-slate-800/40 bg-slate-950/20 flex flex-wrap gap-1.5">
            {presetPrompts.map(p => (
              <button
                key={p.label}
                onClick={() => handleSend(p.query)}
                className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input field Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about your profile..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-accent-primary focus:outline-none rounded-lg px-3 py-2 text-[10px] text-slate-250 placeholder-slate-600"
            />
            <button
              onClick={() => handleSend(inputText)}
              className="p-2 bg-accent-primary hover:bg-indigo-600 text-white rounded-lg transition-colors focus:outline-none"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-accent-primary hover:bg-indigo-600 text-white flex items-center justify-center shadow-xl border border-indigo-500/20 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-primary"
        aria-label="Open Ask ScrollIQ assistant"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

    </div>
  );
};
export default AskScrollIQ;
