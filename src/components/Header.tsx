import React from 'react';
import { NavigationTab, ModelSettings } from '../types';
import { Moon, Sun, Settings, Zap, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  settings: ModelSettings;
  onOpenSettings: () => void;
  minutesSaved: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  settings,
  onOpenSettings,
  minutesSaved,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800 bg-[#FBF9F5]/90 dark:bg-stone-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark with Mascot */}
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg whitespace-nowrap shrink-0"
        >
          <img
            src="/src/assets/images/lazymate_sloth_mascot_1792590905087.jpg"
            alt="Barnaby the LazyMate Sloth"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-stone-300 dark:border-stone-700 shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight leading-none">
              LazyMate <span className="text-emerald-700 dark:text-emerald-400 font-normal">AI</span>
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-tight">
              Slow & Steady Productivity
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => onNavigate('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'overview'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('summarizer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'summarizer'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Summarize
          </button>
          <button
            onClick={() => onNavigate('planner')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'planner'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Task Planner
          </button>
          <button
            onClick={() => onNavigate('replies')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'replies'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Quick Replies
          </button>
          <button
            onClick={() => onNavigate('organizer')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'organizer'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Organize Notes
          </button>
          <button
            onClick={() => onNavigate('relax')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'relax'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Relax Mode
          </button>
          <button
            onClick={() => onNavigate('why-openai')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'why-openai'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Why Open AI?
          </button>
        </nav>

        {/* Zone 3: Actions & Status */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Active Model Indicator Tag (Clean typography) */}
          <button
            onClick={onOpenSettings}
            title="Configure Gemma Model & Inference Runner"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 rounded-md border border-stone-200 dark:border-stone-700 transition-colors"
          >
            {settings.demoMode ? (
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Demo Mode</span>
              </span>
            ) : settings.provider === 'ollama' ? (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <Cpu className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Gemma 2 (Local)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Gemma AI Engine</span>
              </span>
            )}
          </button>

          {/* Time Saved Badge */}
          <button
            onClick={() => onNavigate('sloth-score')}
            title="View Daily Sloth Score & Time Saved"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-950/60 hover:bg-emerald-200/70 dark:hover:bg-emerald-900/60 rounded-md border border-emerald-300/60 dark:border-emerald-800 transition-colors"
          >
            <span className="font-mono tabular-nums">{minutesSaved}m</span>
            <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-300">saved</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-md transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Model Setup & Settings"
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-md transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
