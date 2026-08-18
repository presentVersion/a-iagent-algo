import React, { useState, useMemo, useEffect } from 'react';
import { DEMO_REELS } from './data/demoReels';
import { Interaction, InteractionType, ImpactMetrics, RecommendationResult, UserRole, Reel } from './types';
import ReelFeed from './components/ReelFeed';
import Sidebar from './components/navigation/Sidebar';
import Explore from './components/feed/Explore';
import Saved from './components/feed/Saved';
import Analytics from './components/analytics/Analytics';
import AlgorithmSimulator from './components/analytics/AlgorithmSimulator';
import Profile from './components/profile/Profile';
import AskScrollIQ from './components/ai/AskScrollIQ';
import RecommendationCard from './components/RecommendationCard';
import ExplainabilityModal from './components/ExplainabilityModal';
import Login from './components/Login';
import MobilePhoneSimulator from './components/MobilePhoneSimulator';
import CreatorStudio from './components/CreatorStudio';
import InterestMap from './components/InterestMap';
import { calculateDecayedInterests, scoreReelScrollIQ } from './utils/scoring';
import { generateAIRecommendation } from './services/geminiService';
import { DEFAULT_RECOMMENDATION_CONFIG, FeedContentMode, ADJACENT_TOPICS_MAP } from './services/recommendationConfig';
import { DemoProvider } from './services/providers/provider';
import { Sparkles, Key, Zap, Info, Cpu, LayoutGrid, Smartphone, HelpCircle, Bot, RefreshCw, Sun, Moon } from 'lucide-react';

import { getCurrentUserSync, logoutWithFirebase, saveInteractionsFirebase, fetchInteractionsFirebase } from './services/firebase';

export const App: React.FC = () => {
  // Theme State (Dark / Light mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('scrolliq_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('scrolliq_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Session & Identity State with Firebase Synchronization
  const [role, setRole] = useState<UserRole>(() => {
    const user = getCurrentUserSync();
    return user ? (user.role || 'student') : 'login';
  });
  const [username, setUsername] = useState<string>(() => {
    const user = getCurrentUserSync();
    return user ? (user.displayName || user.email) : '';
  });
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [feedView, setFeedView] = useState<'phone' | 'grid'>('phone');
  
  // Custom Weights State (Simulator tweakable)
  const [weights, setWeights] = useState<Record<string, number>>(DEFAULT_RECOMMENDATION_CONFIG.weights);

  // Scrolled Feed Database State (persists Creator uploads)
  const [reels, setReels] = useState<Reel[]>(DEMO_REELS);

  // Interaction State
  const [interactionsList, setInteractionsList] = useState<Interaction[]>([]);
  const [interactionsMap, setInteractionsMap] = useState<Record<string, InteractionType[]>>({});
  
  // Follow State
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);

  // Sync historical user interactions from Firestore database
  useEffect(() => {
    const user = getCurrentUserSync();
    if (user && role !== 'login') {
      fetchInteractionsFirebase(user.uid).then(list => {
        if (list && list.length > 0) {
          setInteractionsList(list);
          const map: Record<string, InteractionType[]> = {};
          list.forEach(i => {
            if (!map[i.reelId]) map[i.reelId] = [];
            if (!map[i.reelId].includes(i.type)) {
              map[i.reelId].push(i.type);
            }
          });
          setInteractionsMap(map);
        }
      });
    }
  }, [role, username]);

  // Active platform settings
  const [learningMode, setLearningMode] = useState(false);
  const [careerMode, setCareerMode] = useState(false);
  const [makeUseful, setMakeUseful] = useState(false);

  // Gemini Key
  const [apiKey, setApiKey] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [recMode, setRecMode] = useState<'Gemini AI' | 'Demo Heuristics'>('Demo Heuristics');
  
  // Feedback Penalties & Boosts (InterestMap explicit feedback)
  const [topicPenalties, setTopicPenalties] = useState<Record<string, number>>({});
  const [topicBoosts, setTopicBoosts] = useState<Record<string, number>>({});
  
  // Modals
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [exploredRecs, setExploredRecs] = useState<Set<string>>(new Set());
  const [savedRecs, setSavedRecs] = useState<Set<string>>(new Set());

  // Three Content Modes & Algorithmic Refresh states
  const [feedMode, setFeedMode] = useState<FeedContentMode>('curated');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  const contentProvider = useMemo(() => new DemoProvider(reels), [reels]);
  const [feedReels, setFeedReels] = useState<Reel[]>([]);

  useEffect(() => {
    contentProvider.getFeed(feedMode).then(res => {
      setFeedReels(res);
    });
  }, [feedMode, reels, contentProvider]);

  const activeFeedReels = useMemo(() => {
    if (currentTab === 'following') {
      return feedReels.filter(reel => 
        followedCreators.includes(reel.creator) || followedTopics.includes(reel.topic)
      );
    }
    return feedReels;
  }, [feedReels, currentTab, followedCreators, followedTopics]);

  // Interest Evolution Log Timeline
  const [historyLogs, setHistoryLogs] = useState<Array<{ timestamp: string; action: string; topInterest: string; score: number }>>([]);

  const userFeedback = useMemo(() => ({ topicPenalties, topicBoosts }), [topicPenalties, topicBoosts]);

  // Compute Latent Interests
  const interests = useMemo(() => {
    return calculateDecayedInterests(interactionsList, userFeedback, DEFAULT_RECOMMENDATION_CONFIG.decayRate, weights);
  }, [interactionsList, userFeedback, weights]);

  // Log evolution shift
  useEffect(() => {
    if (interests.length > 0 && interactionsList.length > 0) {
      const top = interests[0];
      const lastAction = interactionsList[interactionsList.length - 1];
      
      // Only log if the user took an active scoring action
      setHistoryLogs(prev => {
        const lastEntry = prev[prev.length - 1];
        if (lastEntry?.topInterest === top.name && lastEntry?.score === top.score) {
          return prev;
        }
        return [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            action: lastAction.type.toUpperCase(),
            topInterest: top.name,
            score: top.score
          }
        ];
      });
    }
  }, [interests, interactionsList]);

  // Track Dynamic Impact Metrics
  const metrics: ImpactMetrics = useMemo(() => {
    // Unique reels watched or interacted
    const watchedIds = interactionsList
      .filter(i => i.type === 'watch_complete' || i.type === 'watch_partial')
      .map(i => i.reelId);
    const uniqueWatched = new Set(watchedIds);

    // Number of learning path steps reached
    const uniqueTopics = new Set(
      interactionsList
        .map(i => reels.find(r => r.id === i.reelId)?.topic)
        .filter(Boolean)
    );

    // Simulated study time conversion (Complete = 5 mins, partial = 2 mins)
    let studyMins = 0;
    interactionsList.forEach(i => {
      if (i.type === 'watch_complete') studyMins += 5;
      if (i.type === 'watch_partial') studyMins += 2;
    });

    return {
      reelsDiscovered: uniqueWatched.size,
      topicsExplored: uniqueTopics.size,
      careerTopicsFound: Math.max(0, uniqueTopics.size - 1),
      learningMinutes: studyMins,
      educationalRatio: Number(((uniqueWatched.size / reels.length) * 100).toFixed(0)) || 0
    };
  }, [interactionsList, reels]);

  // Interaction logger
  const handleInteract = (reelId: string, type: InteractionType) => {
    const newInteraction: Interaction = {
      reelId,
      type,
      timestamp: Date.now()
    };
    
    setInteractionsList(prev => {
      const next = [...prev, newInteraction];
      const user = getCurrentUserSync();
      if (user) {
        saveInteractionsFirebase(user.uid, next);
      }
      return next;
    });

    setInteractionsMap(prev => {
      const current = prev[reelId] || [];
      if (!current.includes(type)) {
        return { ...prev, [reelId]: [...current, type] };
      }
      return prev;
    });
  };

  const handleResetFeed = () => {
    setInteractionsList([]);
    setInteractionsMap({});
    setRecommendation(null);
    setTopicPenalties({});
    setTopicBoosts({});
    setExploredRecs(new Set());
    setSavedRecs(new Set());
    setHistoryLogs([]);
    setFeedMode('curated');
    setIsRefreshing(false);
    setRefreshStatus(null);
    const user = getCurrentUserSync();
    if (user) {
      saveInteractionsFirebase(user.uid, []);
    }
  };

  const handleRunTrapScenario = () => {
    // Seed standard Trap Scenario events:
    // NullPointerException (reel-1), Coding Interview (reel-2), Laptop Hardware (reel-18), day in lifestyle (reel-6)
    const trapEvents: Interaction[] = [
      { reelId: 'reel-1', type: 'watch_complete', timestamp: Date.now() - 4000 },
      { reelId: 'reel-6', type: 'watch_complete', timestamp: Date.now() - 3000 },
      { reelId: 'reel-2', type: 'watch_complete', timestamp: Date.now() - 2000 },
      { reelId: 'reel-18', type: 'watch_complete', timestamp: Date.now() - 1000 }
    ];

    setInteractionsList(trapEvents);
    setInteractionsMap({
      'reel-1': ['watch_complete'],
      'reel-6': ['watch_complete'],
      'reel-2': ['watch_complete'],
      'reel-18': ['watch_complete']
    });

    setFeedMode('demo'); // dynamically shift feed mode to Demo feed list
    setCurrentTab('analytics'); // Go to Simulator comparison dashboard
  };

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setRefreshStatus("ANALYZING RECENT ACTIVITY...");

    setTimeout(() => {
      setRefreshStatus("UPDATING INTEREST PROFILE...");
      setTimeout(() => {
        setRefreshStatus("FILTERING LOW-QUALITY CONTENT...");
        setTimeout(() => {
          setRefreshStatus("YOUR FEED IS PERSONALIZED!");
          setTimeout(() => {
            setIsRefreshing(false);
            setRefreshStatus(null);
            
            // Dynamic personalization re-ranking based on scoreReelScrollIQ
            setFeedReels(prev => {
              if (prev.length <= 1) return prev;
              const topInt = interests[0]?.name || "Software Engineering";
              const adj = ADJACENT_TOPICS_MAP[topInt] || [];
              const viewed = interactionsList.map(i => i.reelId);
              
              const scored = prev.map(reel => {
                const score = scoreReelScrollIQ(reel, topInt, adj, { learningMode, careerMode, makeUseful }, viewed);
                return { reel, score };
              });
              
              // Sort descending based on inferred personalization
              return scored.sort((a, b) => b.score - a.score).map(x => x.reel);
            });
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  // Triggers Recommendation analysis call
  const handleAnalyze = async () => {
    if (interactionsList.length === 0) {
      alert("Please interact with some reels on the feed before analyzing!");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Find the last video id watched or interacted with
      const lastItem = interactionsList[interactionsList.length - 1];
      const activeModes = { learningMode, careerMode, makeUseful };

      const { result, mode } = await generateAIRecommendation(
        interactionsList,
        lastItem.reelId,
        userFeedback,
        apiKey,
        activeModes
      );

      setRecommendation(result);
      setRecMode(mode);
    } catch (err) {
      console.error("AI inference issue", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExploreTopic = (_minutes: number) => {
    if (recommendation) {
      setExploredRecs(prev => {
        const next = new Set(prev);
        next.add(recommendation.recommendation.title);
        return next;
      });
    }
  };

  const handleSaveRecommendation = () => {
    if (recommendation) {
      setSavedRecs(prev => {
        const next = new Set(prev);
        const title = recommendation.recommendation.title;
        if (next.has(title)) {
          next.delete(title);
        } else {
          next.add(title);
        }
        return next;
      });
    }
  };

  const handleDislikeCategory = (category: string) => {
    setTopicPenalties(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + 3.0
    }));
  };

  const handleLikeInterest = (category: string) => {
    setTopicBoosts(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + 3.0
    }));
  };

  // Follow Actions
  const handleToggleTopic = (topic: string) => {
    setFollowedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleToggleCreator = (creator: string) => {
    setFollowedCreators(prev =>
      prev.includes(creator) ? prev.filter(c => c !== creator) : [...prev, creator]
    );
  };

  const handleLogout = async () => {
    await logoutWithFirebase();
    setRole('login');
    setUsername('');
    setInteractionsList([]);
    setInteractionsMap({});
    setRecommendation(null);
    setTopicPenalties({});
    setTopicBoosts({});
    setExploredRecs(new Set());
    setSavedRecs(new Set());
    setHistoryLogs([]);
  };

  // Render Login view initially
  if (role === 'login') {
    return <Login onLogin={(name, chosenRole) => { setUsername(name); setRole(chosenRole); }} />;
  }

  const roleLabels = {
    student: 'Student View',
    creator: 'Creator Mode'
  };


  return (
    <div className={`min-h-screen p-0 md:p-6 transition-colors duration-300 flex flex-col justify-center font-sans ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-gradient-to-br from-[#ECEFFE] via-[#F4F5FB] to-[#FCEEF5] text-slate-800'
    }`}>
      
      {/* Main Dashboard Card Wrapper Container */}
      <div className={`max-w-7xl mx-auto w-full rounded-[32px] transition-colors duration-300 min-h-[92vh] flex flex-col overflow-hidden ${
        theme === 'dark' 
          ? 'bg-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-slate-800' 
          : 'bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-white/80'
      }`}>
        
        {/* Top Header Navigation */}
        <header className={`sticky top-0 z-40 px-6 py-4 border-b transition-colors duration-300 ${
          theme === 'dark' ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-100 text-slate-900'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Logo Brand */}
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-success rounded-full border-2 border-white dark:border-slate-900 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                  <span>ScrollIQ</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${
                    role === 'student' 
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' 
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                  }`}>
                    {roleLabels[role]}
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">Hello, <span className="text-slate-700 dark:text-slate-200 font-semibold">@{username}</span></p>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Theme Changer Icon Button (Dark <-> Light Mode) */}
              <button
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none shadow-sm ${
                  theme === 'dark' 
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-indigo-700'
                }`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label={`Toggle theme, current is ${theme}`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* View Toggles for Students */}
              {role !== 'creator' && currentTab === 'home' && (
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 rounded-xl p-0.5">
                  <button
                    onClick={() => setFeedView('phone')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold transition-all focus:outline-none ${
                      feedView === 'phone' 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    title="Mobile View"
                    aria-label="Toggle Phone Feed View"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Phone View
                  </button>
                  <button
                    onClick={() => setFeedView('grid')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold transition-all focus:outline-none ${
                      feedView === 'grid' 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    title="Grid View"
                    aria-label="Toggle Grid Feed View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Grid View
                  </button>
                </div>
              )}

              {/* Gemini Live API Key field */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="password"
                  placeholder="Gemini API Key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none w-28"
                  aria-label="Gemini API Key input"
                />
                <span className={`w-2 h-2 rounded-full ${apiKey.trim() ? 'bg-accent-success animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
              </div>

              {/* Direct Trigger to simulation trap scenario for exploration */}
              {role === 'student' && (
                <button
                  onClick={handleRunTrapScenario}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all focus:outline-none"
                >
                  Trigger Tech Sandbox
                </button>
              )}

              {/* Analyze Scroll CTA */}
              {role !== 'creator' && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs font-extrabold text-white px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all focus:outline-none hover-scale disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Scroll'}
                </button>
              )}


          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto w-full flex flex-1">
        
        {/* Left Sidebar Layout */}
        {role === 'student' && (
          <Sidebar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            username={username}
            onLogout={handleLogout}
            learningMode={learningMode}
            setLearningMode={setLearningMode}
            careerMode={careerMode}
            setCareerMode={setCareerMode}
            makeUseful={makeUseful}
            setMakeUseful={setMakeUseful}
          />
        )}

        <main className="flex-1 px-8 py-6 overflow-hidden">
          
          {role === 'creator' ? (
            /* Content Creator View */
            <CreatorStudio
              creatorName={username}
              onPostReel={(newReel: Reel) => setReels(prev => [newReel, ...prev])}
              reels={reels}
            />
          ) : (
            /* Student Views sorted by tab routing */
            <div className="w-full">
              
              {/* TAB 1: HOME FEED */}
              {currentTab === 'home' && (
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
                  
                  {/* Scrolled Feed View */}
                  <div className="lg:col-span-7 flex flex-col gap-6 items-center lg:items-stretch">
                    
                    {/* Header: Controls & Refresh Feed */}
                    <div className="flex justify-between items-center w-full max-w-[340px] lg:max-w-none">
                      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                        <button
                          onClick={() => setFeedView('phone')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                            feedView === 'phone' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                          Phone
                        </button>
                        <button
                          onClick={() => setFeedView('grid')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                            feedView === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5 inline mr-1" />
                          Grid
                        </button>
                      </div>

                      {/* ↻ Refresh Feed button */}
                      <button
                        onClick={handleRefreshFeed}
                        disabled={isRefreshing}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-950/40 text-indigo-300 hover:text-white border border-indigo-900/50 hover:bg-indigo-950/70 transition-all flex items-center gap-1.5 focus:outline-none disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh Feed</span>
                      </button>
                    </div>

                    {isRefreshing ? (
                      /* Algorithmic refresh animated pipeline overlay */
                      <div className="w-full h-[580px] rounded-3xl border border-slate-900 bg-slate-950/80 flex flex-col items-center justify-center gap-4 text-center p-8">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-[10px] font-mono font-extrabold tracking-widest text-indigo-400 uppercase animate-pulse">
                            {refreshStatus}
                          </span>
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                            Reranking candidates via latent interest matrix
                          </span>
                        </div>
                      </div>
                    ) : feedView === 'phone' ? (
                      <div className="w-full flex justify-center py-2 bg-slate-950/20 rounded-3xl border border-slate-900/50 p-4">
                        <MobilePhoneSimulator
                          reels={activeFeedReels}
                          onInteract={handleInteract}
                          interactions={interactionsMap}
                          interactionsList={interactionsList}
                          userFeedback={userFeedback}
                          activeModes={{ learningMode, careerMode, makeUseful }}
                          feedMode={feedMode}
                          onChangeFeedMode={setFeedMode}
                        />
                      </div>
                    ) : (
                      <ReelFeed
                        reels={activeFeedReels}
                        interactions={interactionsMap}
                        onInteract={handleInteract}
                        onReset={handleResetFeed}
                        interests={interests}
                      />
                    )}
                  </div>

                  {/* Dynamic Recommendation Panel Right HUD */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Welcome scroller tooltip tips */}
                    {interactionsList.length === 0 && (
                      <div className="bg-indigo-950/25 border border-indigo-900/40 p-4.5 rounded-2xl text-xs flex gap-3 items-start animate-pulse">
                        <Info className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-200 block mb-0.5">Scroller Guide</span>
                          Scroll the mobile feed on the left, watch tech clips (or click Like/Save), then trigger **Analyze Scroll** to see your CS learning options!
                        </div>
                      </div>
                    )}

                    {/* AI Recommendation Output Target */}
                    {isAnalyzing ? (
                      <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center flex flex-col items-center justify-center gap-4 py-16 animate-pulse">
                        <div className="w-10 h-10 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <h3 className="font-bold text-slate-100 text-sm">Building Latent Interest Mapping...</h3>
                          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                            Reviewing interaction duration, skipping signals, and filtering clickbait claims...
                          </p>
                        </div>
                      </div>
                    ) : recommendation ? (
                      <div className="flex flex-col gap-4">
                        <RecommendationCard
                          rec={recommendation}
                          onExplore={handleExploreTopic}
                          onSave={handleSaveRecommendation}
                          onDislike={handleDislikeCategory}
                          onShowAnother={() => handleAnalyze()}
                          mode={recMode}
                          isSaved={savedRecs.has(recommendation.recommendation.title)}
                          hasExplored={exploredRecs.has(recommendation.recommendation.title)}
                        />
                        
                        {/* Trace details button */}
                        <button
                          onClick={() => setShowExplainModal(true)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-indigo-500/20 bg-indigo-950/10 hover:bg-indigo-950/20 transition-all focus:outline-none"
                        >
                          <Zap className="w-4 h-4 shrink-0" />
                          Why did AI recommend this? (Explainable Trace)
                        </button>
                      </div>
                    ) : (
                      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 text-center flex flex-col items-center justify-center gap-3 py-14">
                        <HelpCircle className="w-10 h-10 text-slate-700 animate-bounce" />
                        <div>
                          <h3 className="font-bold text-slate-200 text-sm">No recommendation generated yet</h3>
                          <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                            Interact with some reels on the left, then click <span className="font-semibold text-indigo-400">Analyze Scroll</span>.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 🧠 ScrollIQ Learning Map HUD */}
                    <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-350 flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
                          ScrollIQ Learning Engine
                        </h4>
                        <span className="text-[8px] bg-accent-success/20 text-accent-success px-1.5 py-0.5 rounded font-bold uppercase">
                          AI is learning from your feed
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {interests.slice(0, 5).map(interest => {
                          const totalScores = interests.reduce((acc, curr) => acc + Math.max(curr.score, 0), 0) || 1;
                          const percentage = Math.max(0, Math.min(100, Math.round((Math.max(interest.score, 0) / totalScores) * 100)));
                          return (
                            <div key={interest.name} className="flex flex-col gap-1 text-[10px]">
                              <div className="flex justify-between items-center text-slate-300">
                                <span className="font-bold">{interest.name}</span>
                                <span className="font-mono">{percentage}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                <div 
                                  className="bg-accent-primary h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                        {interests.length === 0 && (
                          <div className="text-center py-6 text-slate-500 text-[10px]">
                            No scroll interactions recorded yet. Start watching to build profile weights!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interest Graph & Radar Chart HUD */}
                    <div className="w-full">
                      <InterestMap
                        interests={interests}
                        onDislikeInterest={handleDislikeCategory}
                        onLikeInterest={handleLikeInterest}
                        topicPenalties={topicPenalties}
                        topicBoosts={topicBoosts}
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: EXPLORE PAGE */}
              {currentTab === 'explore' && (
                <Explore
                  onInteract={handleInteract}
                  interactions={interactionsMap}
                />
              )}

              {/* TAB 3: FOLLOWING PAGE */}
              {currentTab === 'following' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                      <span>Following Feed</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Clips from creators and topics you specifically follow.</p>
                  </div>
                  
                  {activeFeedReels.length === 0 ? (
                    <div className="glass-panel rounded-2xl p-12 text-center py-20 text-xs text-slate-500">
                      No reels found. Go to your <span className="font-bold text-indigo-400">Profile Settings</span> tab and follow some topics/creators first!
                    </div>
                  ) : (
                    <ReelFeed
                      reels={activeFeedReels}
                      interactions={interactionsMap}
                      onInteract={handleInteract}
                      onReset={handleResetFeed}
                      interests={interests}
                    />
                  )}
                </div>
              )}

              {/* TAB 4: SAVED PAGE */}
              {currentTab === 'saved' && (
                <Saved
                  onInteract={handleInteract}
                  interactions={interactionsMap}
                />
              )}

              {/* TAB 5: ANALYTICS & SIMULATOR */}
              {currentTab === 'analytics' && (
                <div className="flex flex-col gap-12">
                  <InterestMap
                    interests={interests}
                    onDislikeInterest={handleDislikeCategory}
                    onLikeInterest={handleLikeInterest}
                    topicPenalties={topicPenalties}
                    topicBoosts={topicBoosts}
                  />
                  <Analytics
                    interests={interests}
                    metrics={metrics}
                    historyLogs={historyLogs}
                  />
                  <AlgorithmSimulator
                    onRecalculateWeights={setWeights}
                    onRunTrapScenario={handleRunTrapScenario}
                  />
                </div>
              )}

              {/* TAB 6: PROFILE */}
              {currentTab === 'profile' && (
                <Profile
                  username={username}
                  followedTopics={followedTopics}
                  onToggleTopic={handleToggleTopic}
                  followedCreators={followedCreators}
                  onToggleCreator={handleToggleCreator}
                  onResetAlgorithm={handleResetFeed}
                />
              )}

            </div>
          )}

        </main>
      </div>


      </div> {/* closes main dashboard wrapper card */}

      {/* Floating AskScrollIQ Assistant Chat widget */}
      {role === 'student' && (
        <AskScrollIQ
          interests={interests}
          recommendation={recommendation}
          setLearningMode={setLearningMode}
        />
      )}

      {/* Footer Area */}
      <footer className="border-t border-slate-100 bg-white py-8 px-6 text-center mt-8 rounded-[24px] max-w-7xl mx-auto w-full shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Zap className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-xs text-slate-500 font-medium">
              ScrollIQ - Making scrollers more useful. Your feed. Your interests. Smarter scrolling.
            </p>
          </div>
          <p className="text-[10px] text-slate-400">
            Hackathon Submission • Google Antigravity • Premium AI Recommendation Engine compliant
          </p>
        </div>
      </footer>

      {/* Dialog Modals */}
      <ExplainabilityModal
        isOpen={showExplainModal}
        onClose={() => setShowExplainModal(false)}
        rec={recommendation!}
        interactions={interactionsList}
      />
    </div>
  );
};
export default App;
