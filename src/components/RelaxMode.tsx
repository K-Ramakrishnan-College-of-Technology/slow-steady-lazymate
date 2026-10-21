import React, { useState, useEffect } from 'react';
import { ModelSettings, GenerationResult } from '../types';
import { generateContentWithGemma } from '../services/aiService';
import {
  Sparkles,
  Moon,
  Heart,
  Wind,
  RefreshCw,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface RelaxModeProps {
  settings: ModelSettings;
  onRecordRelax: () => void;
}

type RelaxSubTab = 'story' | 'breathing' | 'thoughts';

export const RelaxMode: React.FC<RelaxModeProps> = ({ settings, onRecordRelax }) => {
  const [subTab, setSubTab] = useState<RelaxSubTab>('story');
  const [storyTheme, setStoryTheme] = useState('cloud_forest');
  const [loading, setLoading] = useState(false);
  const [storyResult, setStoryResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Breathing pacer state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes

  // Positive thoughts state
  const [positiveThoughts, setPositiveThoughts] = useState<string[]>([
    'Resting is not a reward you earn after burning out; it is fundamental living.',
    'A tree does not rush its branches to blossom before the season is ready.',
    'Doing one thing slowly with your full attention is greater than ten things half-finished in panic.',
    'The urgent emails of today are almost always the forgotten dust of next month.',
  ]);

  // Breathing timer loop
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsBreathingActive(false);
            onRecordRelax();
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, onRecordRelax]);

  // Phase animator for breathing (Inhale 4s -> Hold 4s -> Exhale 6s = 14s cycle)
  useEffect(() => {
    let phaseInterval: any = null;
    if (isBreathingActive) {
      let elapsed = 0;
      phaseInterval = setInterval(() => {
        elapsed = (elapsed + 1) % 14;
        if (elapsed < 4) {
          setBreathPhase('Inhale');
        } else if (elapsed < 8) {
          setBreathPhase('Hold');
        } else {
          setBreathPhase('Exhale');
        }
      }, 1000);
    }
    return () => clearInterval(phaseInterval);
  }, [isBreathingActive]);

  const handleGenerateStory = async () => {
    setLoading(true);

    const promptsByTheme: Record<string, string> = {
      cloud_forest: 'Write a peaceful, slow-paced bedtime story about Barnaby the wise sloth drifting to sleep in a warm Costa Rican cloud forest under soft rain.',
      mountain_tea: 'Write a calm, sensory bedtime story about a quiet mountain tea hut where loose tea leaves gently brew on a wood fire while stars emerge.',
      starry_lake: 'Write a tranquil, deeply soothing story about a silent mirrored lake reflecting the silver crescent moon, gentle reeds swaying in the cool night breeze.',
    };

    const systemPrompt = `You are LazyMate AI's Relax Mode storyteller, powered by Gemma architecture.
Write a slow, tranquil, deeply calming sleep meditation story in about 200-250 words.
Use warm, gentle sensory language (soft rain, warm wood, steady breathing, heavy eyelids, cool night breezes).
Conclude with a peaceful permission to let go of today's worries and rest deeply.`;

    try {
      const response = await generateContentWithGemma(
        promptsByTheme[storyTheme] || promptsByTheme.cloud_forest,
        systemPrompt,
        'relax',
        settings
      );
      setStoryResult(response);
      onRecordRelax();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThoughts = async () => {
    setLoading(true);
    const systemPrompt = `You are LazyMate AI's Zen Sloth philosopher. Generate 4 reassuring, gently humorous, and deeply comforting truths about slowing down, rejecting hustle culture guilt, and pacing life like a wise sloth. Output each thought on a new line starting with •.`;

    try {
      const response = await generateContentWithGemma(
        'Generate four gentle affirmations for easing anxiety about not working constantly.',
        systemPrompt,
        'relax',
        settings
      );
      const lines = response.text
        .split('\n')
        .map((l) => l.replace(/^[•\-\*\d\.]+\s*/, '').trim())
        .filter((l) => l.length > 10);
      if (lines.length >= 2) {
        setPositiveThoughts(lines);
      }
      onRecordRelax();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyStory = () => {
    if (!storyResult?.text) return;
    navigator.clipboard.writeText(storyResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
              Relax & Decompress Mode
            </h1>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
              · Unwind Mind & Body
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Productivity without rest is just exhaustion. Let Barnaby guide your evening wind-down.
          </p>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setSubTab('story')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              subTab === 'story'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Bedtime Story</span>
          </button>
          <button
            onClick={() => setSubTab('breathing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              subTab === 'breathing'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-emerald-600" />
            <span>2-Min Breathing</span>
          </button>
          <button
            onClick={() => setSubTab('thoughts')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              subTab === 'thoughts'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Positive Thoughts</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Card for Relax Mode */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 h-44 sm:h-52 shadow-xs">
        <img
          src="/src/assets/images/lazymate_relax_sloth_1792590905638.jpg"
          alt="Tranquil sloth sleeping under starry sky"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-transparent flex items-center p-6 sm:p-8">
          <div className="max-w-md space-y-2 text-stone-100">
            <span className="text-[11px] font-medium tracking-wide uppercase text-emerald-400">
              The Sloth Sanctuary
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold">
              Slow down. Your nervous system will thank you.
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              True efficiency requires intentional recharge. Give yourself permission to pause.
            </p>
          </div>
        </div>
      </div>

      {/* Tab 1: Bedtime Story */}
      {subTab === 'story' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              Pick Story Setting
            </h3>
            
            <div className="space-y-2">
              {[
                { id: 'cloud_forest', title: 'The Cloud Forest Canopy', desc: 'Warm moss, gentle raindrops & slow evening stretches' },
                { id: 'mountain_tea', title: 'Mountain Wood Cabin', desc: 'Crackling hearth, steaming herbal tea & cozy quiet' },
                { id: 'starry_lake', title: 'The Mirrored Starlight Lake', desc: 'Ripples of cool water, silver moon & silent reeds' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setStoryTheme(theme.id)}
                  className={`w-full p-3 rounded-lg border text-left text-xs transition-all ${
                    storyTheme === theme.id
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-stone-900 dark:text-stone-100'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <div className="font-semibold text-stone-900 dark:text-stone-100">{theme.title}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{theme.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={loading}
              className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Weaving Bedtime Story with Gemma...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Soothing Tale</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                Evening Story Sanctuary
              </span>
              {storyResult && (
                <button
                  onClick={copyStory}
                  className="flex items-center gap-1 text-stone-600 hover:text-emerald-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {storyResult ? (
              <div className="p-4 rounded-lg bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
                <p className="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap font-body leading-relaxed italic">
                  {storyResult.text}
                </p>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg text-stone-400 dark:text-stone-600 space-y-2">
                <Moon className="w-8 h-8 stroke-1 text-indigo-400" />
                <div className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Ready for a peaceful story
                </div>
                <p className="text-xs max-w-xs text-stone-400 dark:text-stone-500">
                  Select a setting on the left and click &ldquo;Generate Soothing Tale&rdquo; to unwind.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: 2-Minute Sloth Breathing Pacer */}
      {subTab === 'breathing' && (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 shadow-xs text-center space-y-6">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
              The 2-Minute Sloth Breathing Pacer
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Follow the expanding and contracting rhythm. Inhale for 4s, gently hold for 4s, and release for 6s.
            </p>
          </div>

          {/* Circular Breathing Visualizer */}
          <div className="flex flex-col items-center justify-center py-6">
            <div
              className={`w-44 h-44 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-1000 ${
                !isBreathingActive
                  ? 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 scale-95'
                  : breathPhase === 'Inhale'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 scale-110 shadow-lg shadow-emerald-500/20'
                  : breathPhase === 'Hold'
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/50 scale-110 shadow-lg shadow-amber-400/20'
                  : 'border-blue-400 bg-blue-50 dark:bg-blue-950/50 scale-90'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {isBreathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="font-mono text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums mt-1">
                {Math.floor(secondsRemaining / 60)}:
                {String(secondsRemaining % 60).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-stone-400 mt-1">
                {isBreathingActive ? 'Relax your jaw' : 'Click Play'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start 2-Minute Breathing</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsBreathingActive(false);
                setSecondsRemaining(120);
              }}
              className="px-3.5 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Positive Lazy Thoughts */}
      {subTab === 'thoughts' && (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-stone-900 dark:text-stone-100">
                Positive Anti-Hustle Thoughts
              </h3>
              <p className="text-xs text-stone-500">
                Gentle reminders that your worth is not measured by relentless busyness.
              </p>
            </div>
            <button
              onClick={handleGenerateThoughts}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>New Affirmations with Gemma</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positiveThoughts.map((thought, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/40 space-y-2 hover:border-emerald-400/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    Gentle Reminder #{idx + 1}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-body leading-relaxed">
                  &ldquo;{thought}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
