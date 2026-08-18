import React, { useState } from 'react';
import { Reel } from '../types';
import { UploadCloud, AlertTriangle, Check, ShieldCheck, Video } from 'lucide-react';

interface CreatorStudioProps {
  creatorName: string;
  onPostReel: (reel: Reel) => void;
  reels: Reel[];
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({ creatorName, onPostReel, reels }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI');
  const [topic, setTopic] = useState('Generative AI');
  const [youtubeId, setYoutubeId] = useState('2g811Eo7K8U');
  const [subtopics, setSubtopics] = useState('ai, learning, technology');
  const [domain, setDomain] = useState('ai');
  const [intent, setIntent] = useState('education');
  const [context, setContext] = useState('ai education');
  
  const [technicalDepth, setTechnicalDepth] = useState(2);
  const [educationalValue, setEducationalValue] = useState(0.8);
  const [entertainmentValue, setEntertainmentValue] = useState(0.5);
  const [careerRelevance, setCareerRelevance] = useState(0.8);
  const [hypeScore, setHypeScore] = useState(0.1); // clickbait

  const [postedSuccess, setPostedSuccess] = useState(false);

  const creatorReels = reels.filter(r => r.creator === `@${creatorName.toLowerCase().replace(/\s+/g, '_')}`);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a Reel Title");
      return;
    }

    const newReel: Reel = {
      id: `reel-user-${Date.now()}`,
      title: title.trim(),
      category,
      topic,
      creator: `@${creatorName.toLowerCase().replace(/\s+/g, '_')}`,
      description: `New content posted via Creator Studio by @${creatorName.toLowerCase().replace(/\s+/g, '_')}. #${category.toLowerCase()} #${topic.toLowerCase()}`,
      thumbnailColor: "from-indigo-600 to-purple-800",
      youtubeId: youtubeId.trim() || "2g811Eo7K8U",
      subtopics: subtopics.split(',').map(s => s.trim().toLowerCase()),
      domain: domain.trim().toLowerCase() || 'software engineering',
      intent,
      context,
      technicalDepth,
      educationalValue,
      entertainmentValue,
      careerRelevance,
      hypeScore,
      qualityScore: Number((educationalValue * 0.7 + (1 - hypeScore) * 0.3).toFixed(2))
    };

    onPostReel(newReel);
    setTitle('');
    setPostedSuccess(true);
    setTimeout(() => setPostedSuccess(false), 3000);
  };

  const handleSelectTemplate = (type: 'edu' | 'hype' | 'gaming') => {
    if (type === 'edu') {
      setTitle("Deep Dive into PostgreSQL Indexing");
      setCategory("Education");
      setTopic("DSA");
      setYoutubeId("V63G1qJbV1A");
      setSubtopics("databases, postgresql, indexing, scaling");
      setDomain("software engineering");
      setIntent("education");
      setContext("database indexing");
      setTechnicalDepth(4);
      setEducationalValue(0.95);
      setEntertainmentValue(0.3);
      setCareerRelevance(0.9);
      setHypeScore(0.02);
    } else if (type === 'hype') {
      setTitle("Learn Cybersecurity in 1 Hour and Get Hired Instantly!");
      setCategory("AI");
      setTopic("Generative AI");
      setYoutubeId("Hq4FWhS702U");
      setSubtopics("cybersecurity, hacking, easy-money, career-guarantee");
      setDomain("cybersecurity");
      setIntent("clickbait");
      setContext("career guarantees");
      setTechnicalDepth(1);
      setEducationalValue(0.15);
      setEntertainmentValue(0.85);
      setCareerRelevance(0.2);
      setHypeScore(0.95);
    } else {
      setTitle("Building a Game in React using Canvas API");
      setCategory("Web Development");
      setTopic("Web Development");
      setYoutubeId("2g811Eo7K8U");
      setSubtopics("javascript, react, canvas-api, game-dev");
      setDomain("software engineering");
      setIntent("education");
      setContext("game physics tutorial");
      setTechnicalDepth(3);
      setEducationalValue(0.85);
      setEntertainmentValue(0.7);
      setCareerRelevance(0.75);
      setHypeScore(0.15);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-300">
      
      {/* Creator Form - col 7 */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-4">
            <UploadCloud className="w-6 h-6 text-accent-purple" />
            <h2 className="text-lg font-bold text-slate-100">Creator Studio Studio Console</h2>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Post mock video reels to the feed database. Test how ScrollSense AI clusters your tags and filters clickbait levels in real-time.
          </p>

          {/* Quick templates */}
          <div className="mb-6 bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex items-center gap-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Quick Templates:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleSelectTemplate('edu')}
                className="text-[10px] font-bold text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-lg"
              >
                High Quality CS
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('hype')}
                className="text-[10px] font-bold text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 px-2.5 py-1 rounded-lg"
              >
                Hype Clickbait
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('gaming')}
                className="text-[10px] font-bold text-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/30 px-2.5 py-1 rounded-lg"
              >
                Practical Web CS
              </button>
            </div>
          </div>

          <form onSubmit={handlePost} className="flex flex-col gap-5 text-xs">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400">Reel Title</label>
              <input
                type="text"
                placeholder="e.g. Why Big-O notation is important..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 focus:border-accent-purple focus:outline-none rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 focus:border-accent-purple focus:outline-none rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="AI">AI</option>
                  <option value="Education">Education</option>
                  <option value="Career">Career</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Programming Meme">Programming Meme</option>
                  <option value="Technology News">Technology News</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Web Development">Web Development</option>
                </select>
              </div>

              {/* Topic */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Target Topic Cluster</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-slate-950 border border-slate-800 focus:border-accent-purple focus:outline-none rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Generative AI">Generative AI</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="DSA">DSA</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Developer Hardware">Developer Hardware</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
            </div>

            {/* Video Url */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400">YouTube Shorts Video ID</label>
              <input
                type="text"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                className="bg-slate-950 border border-slate-800 focus:border-accent-purple focus:outline-none rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 font-mono text-[10px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Domain */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Semantic Domain</label>
                <input
                  type="text"
                  placeholder="e.g. software engineering..."
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="bg-slate-950 border border-slate-800 focus:border-accent-purple focus:outline-none rounded-xl px-3 py-2.5 text-slate-200 placeholder-slate-600"
                />
              </div>

              {/* Subtopics */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Subtopics (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. postgresql, indexing, db..."
                  value={subtopics}
                  onChange={(e) => setSubtopics(e.target.value)}
                  className="bg-slate-950 border border-slate-800 focus:border-accent-purple focus:outline-none rounded-xl px-3 py-2.5 text-slate-200 placeholder-slate-600"
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Educational Value</span>
                  <span className="text-accent-purple">{educationalValue}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={educationalValue}
                  onChange={(e) => setEducationalValue(Number(e.target.value))}
                  className="accent-accent-purple"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Clickbait Hype Penalty</span>
                  <span className="text-accent-purple">{hypeScore}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={hypeScore}
                  onChange={(e) => setHypeScore(Number(e.target.value))}
                  className="accent-accent-purple"
                />
              </div>
            </div>

            {/* Warn creators about clickbait */}
            {hypeScore > 0.6 && (
              <div className="bg-red-950/30 border border-red-500/25 p-3 rounded-xl flex items-start gap-2 text-[10px] text-red-400 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>
                  <span className="font-bold">Hype Penalty Notice:</span> Posting a reel with a high hype score (&gt; 0.60) will trigger ScrollSense AI's anti-hype shields. It will flag high Hype Risk and downgrade recommendation scoring.
                </p>
              </div>
            )}

            {postedSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-900/30 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                <Check className="w-4 h-4" />
                <span>Reel posted successfully! Added to the scrolled feed database.</span>
              </div>
            )}

            {/* Post Reel Button */}
            <button
              type="submit"
              className="bg-accent-purple hover:bg-purple-600 text-xs font-bold text-white py-3 rounded-xl focus:outline-none transition-colors"
            >
              Post Reel to Scrolled Feed
            </button>

          </form>
        </div>
      </div>

      {/* Posted List - col 5 */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-accent-purple" />
            <h2 className="text-base font-bold text-slate-100">Posted Videos (Feed List)</h2>
          </div>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {creatorReels.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12 bg-slate-900/20 rounded-xl border border-slate-900">
                No videos posted yet by @{creatorName.toLowerCase().replace(/\s+/g, '_')}.
              </div>
            ) : (
              creatorReels.map(reel => (
                <div key={reel.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-slate-200 truncate max-w-[200px]" title={reel.title}>
                      {reel.title}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-accent-purple bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {reel.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      Edu: {Math.round(reel.educationalValue * 100)}%
                    </span>
                    <span className={`font-bold flex items-center gap-0.5 ${
                      reel.hypeScore > 0.8 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {reel.hypeScore > 0.8 ? (
                        <>
                          <AlertTriangle className="w-3 h-3" /> Hype
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3" /> Low Hype
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
export default CreatorStudio;
