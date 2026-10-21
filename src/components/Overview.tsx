import React from 'react';
import { NavigationTab, SlothMetrics } from '../types';
import { calculateSlothSavings } from '../utils/slothScore';
import {
  FileText,
  CheckSquare,
  MessageSquare,
  FolderTree,
  Sparkles,
  ArrowRight,
  Shield,
  Cpu,
  Clock,
  Compass,
} from 'lucide-react';

interface OverviewProps {
  onNavigate: (tab: NavigationTab) => void;
  metrics: SlothMetrics;
  onOpenSettings: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate, metrics, onOpenSettings }) => {
  const savings = calculateSlothSavings(metrics);

  const tools = [
    {
      id: 'summarizer' as NavigationTab,
      title: 'Smart Text Summarizer',
      desc: 'Convert long emails, documents, and articles into clean two-line actionable summaries.',
      icon: <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      benefit: 'Saves ~4.5 mins per article',
      example: 'Condense dense updates instantly',
    },
    {
      id: 'planner' as NavigationTab,
      title: 'Lazy Task Planner',
      desc: 'Sort chaotic to-do lists by Minimum Viable Effort (80/20 rule) and low-energy sprints.',
      icon: <CheckSquare className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      benefit: 'Eliminates decision fatigue',
      example: 'Auto-prioritizes high leverage items',
    },
    {
      id: 'replies' as NavigationTab,
      title: 'Quick Reply Generator',
      desc: 'Draft friendly, ultra-brief, polite decline, or diplomatic replies with single-click copying.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      benefit: 'Saves ~3 mins per email',
      example: '5 customized conversational tones',
    },
    {
      id: 'organizer' as NavigationTab,
      title: 'Messy Notes Organizer',
      desc: 'Turn unformatted brainstorm dumps into structured Markdown sections, decisions, and tasks.',
      icon: <FolderTree className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      benefit: 'Turns chaos into clarity',
      example: 'Categorizes tags and action items',
    },
    {
      id: 'relax' as NavigationTab,
      title: 'Relax Mode & Stories',
      desc: 'Wind down with sleepy bedtime stories, 2-minute sloth breathing pacer, and calming thoughts.',
      icon: <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      benefit: 'Reduces cortisol & stress',
      example: 'Bedtime tales & breathing timer',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <span className="font-semibold">Barnaby</span>
                <span aria-hidden="true">·</span>
                <span>Your Sloth Productivity Guide</span>
                <span aria-hidden="true">·</span>
                <span>Powered by Gemma Open AI</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
                Work slower. Think clearer. <br className="hidden sm:inline" />
                <span className="text-emerald-700 dark:text-emerald-400">Do less repetitive work.</span>
              </h1>

              <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                LazyMate AI handles the tedious busywork: summarizing lengthy texts, sorting endless tasks, drafting quick replies, and untangling messy notes so you can preserve your energy for what truly matters.
              </p>
            </div>

            {/* Quick Actions & Privacy Note */}
            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('summarizer')}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <span>Summarize My First Text</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('planner')}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Plan Lazy Daily Tasks
                </button>
                <button
                  onClick={() => onNavigate('why-openai')}
                  className="px-4 py-2.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap"
                >
                  Why Gemma Open-Weight?
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zero text persistence: Your messages are never saved to disks or used for model training.</span>
              </div>
            </div>

          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/lazymate_hero_scene_1792590907127.jpg"
              alt="Serene workspace with Barnaby the Sloth"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover lg:absolute lg:inset-0 rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent lg:hidden" />
          </div>

        </div>
      </div>

      {/* Daily Sloth Score Strip */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/80 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <Clock className="w-6 h-6 text-emerald-800 dark:text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-stone-900 dark:text-stone-100">
                  Daily Sloth Score & Time Saved
                </h2>
                <span className="text-xs text-stone-500 dark:text-stone-400">· Transparent Math</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                Current status: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{savings.slothRating}</span> — {savings.slothMotto}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 divide-x divide-stone-200 dark:divide-stone-800 pt-2 sm:pt-0">
            <div className="text-left sm:text-right">
              <div className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {savings.totalMinutesSaved}m
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">Total Saved Today</div>
            </div>
            <div className="pl-6 text-left sm:text-right">
              <div className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {savings.energyConservedPercent}%
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">Energy Conserved</div>
            </div>
            <div className="pl-6">
              <button
                onClick={() => onNavigate('sloth-score')}
                className="text-xs font-medium text-emerald-800 dark:text-emerald-300 hover:underline whitespace-nowrap"
              >
                Inspect Formula →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Feature Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
              Your Slow and Steady Toolkit
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Each module is crafted with Gemma AI to eliminate repetitive manual friction.
            </p>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
          >
            <Cpu className="w-3.5 h-3.5 text-stone-500" />
            <span>Runner Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="group cursor-pointer rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 hover:border-emerald-600/40 dark:hover:border-emerald-500/40 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 transition-colors">
                    {tool.icon}
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                    {tool.benefit}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                  {tool.example}
                </span>
                <span className="font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Launch <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {/* 6th Slot: Open AI Educational Card */}
          <div
            onClick={() => onNavigate('why-openai')}
            className="group cursor-pointer rounded-xl border border-dashed border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  Open-Weight Architecture
                </span>
              </div>
              <h3 className="font-display font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Why Open AI & Gemma?
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Discover why running open weights (like Gemma 2B & 9B) gives you true data ownership, local execution freedom, and eliminates vendor lock-in.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs">
              <span className="text-emerald-800 dark:text-emerald-300 text-[11px]">
                Read the guide
              </span>
              <span className="font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
