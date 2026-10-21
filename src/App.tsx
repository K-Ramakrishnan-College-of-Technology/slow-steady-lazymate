/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, ModelSettings, SlothMetrics } from './types';
import { DEFAULT_MODEL_SETTINGS } from './services/aiService';
import { calculateSlothSavings } from './utils/slothScore';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { Overview } from './components/Overview';
import { Summarizer } from './components/Summarizer';
import { TaskPlanner } from './components/TaskPlanner';
import { QuickReplies } from './components/QuickReplies';
import { NotesOrganizer } from './components/NotesOrganizer';
import { RelaxMode } from './components/RelaxMode';
import { SlothScoreView } from './components/SlothScoreView';
import { WhyOpenAi } from './components/WhyOpenAi';
import { SetupGuide } from './components/SetupGuide';
import { SettingsModal } from './components/SettingsModal';
import { Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lazymate_dark_mode') === 'true';
    }
    return false;
  });

  const [settings, setSettings] = useState<ModelSettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lazymate_settings');
      if (stored) {
        try {
          return { ...DEFAULT_MODEL_SETTINGS, ...JSON.parse(stored) };
        } catch {
          return DEFAULT_MODEL_SETTINGS;
        }
      }
    }
    return DEFAULT_MODEL_SETTINGS;
  });

  const [metrics, setMetrics] = useState<SlothMetrics>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lazymate_metrics');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    // Initial sample stats so user immediately sees a populated, working dashboard
    return {
      wordsSummarized: 1420,
      wordsGenerated: 380,
      tasksPlanned: 8,
      repliesSent: 4,
      notesStructured: 3,
      relaxSessions: 2,
    };
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync dark mode class on html/body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lazymate_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lazymate_dark_mode', 'false');
    }
  }, [darkMode]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('lazymate_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist metrics
  useEffect(() => {
    localStorage.setItem('lazymate_metrics', JSON.stringify(metrics));
  }, [metrics]);

  const updateSettings = (newSettings: Partial<ModelSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleRecordWordsSummarized = (words: number) => {
    setMetrics((prev) => ({
      ...prev,
      wordsSummarized: prev.wordsSummarized + words,
    }));
  };

  const handleRecordTasksPlanned = (count: number) => {
    setMetrics((prev) => ({
      ...prev,
      tasksPlanned: prev.tasksPlanned + count,
    }));
  };

  const handleRecordReply = (words: number) => {
    setMetrics((prev) => ({
      ...prev,
      repliesSent: prev.repliesSent + 1,
      wordsGenerated: prev.wordsGenerated + words,
    }));
  };

  const handleRecordNotes = (count: number) => {
    setMetrics((prev) => ({
      ...prev,
      notesStructured: prev.notesStructured + count,
    }));
  };

  const handleRecordRelax = () => {
    setMetrics((prev) => ({
      ...prev,
      relaxSessions: prev.relaxSessions + 1,
    }));
  };

  const handleResetMetrics = () => {
    const emptyMetrics: SlothMetrics = {
      wordsSummarized: 0,
      wordsGenerated: 0,
      tasksPlanned: 0,
      repliesSent: 0,
      notesStructured: 0,
      relaxSessions: 0,
    };
    setMetrics(emptyMetrics);
  };

  const savings = calculateSlothSavings(metrics);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      
      {/* Top Bar Contract (3 Zones) */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        settings={settings}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        minutesSaved={savings.totalMinutesSaved}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Horizontal Navigation Segmented Tabs for easy switching */}
        <NavigationTabs currentTab={currentTab} onNavigate={setCurrentTab} />

        {/* View Router */}
        {currentTab === 'overview' && (
          <Overview
            onNavigate={setCurrentTab}
            metrics={metrics}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
        )}

        {currentTab === 'summarizer' && (
          <Summarizer
            settings={settings}
            onRecordWords={handleRecordWordsSummarized}
          />
        )}

        {currentTab === 'planner' && (
          <TaskPlanner
            settings={settings}
            onRecordTasks={handleRecordTasksPlanned}
          />
        )}

        {currentTab === 'replies' && (
          <QuickReplies
            settings={settings}
            onRecordReply={handleRecordReply}
          />
        )}

        {currentTab === 'organizer' && (
          <NotesOrganizer
            settings={settings}
            onRecordNotes={handleRecordNotes}
          />
        )}

        {currentTab === 'relax' && (
          <RelaxMode
            settings={settings}
            onRecordRelax={handleRecordRelax}
          />
        )}

        {currentTab === 'sloth-score' && (
          <SlothScoreView
            metrics={metrics}
            onResetMetrics={handleResetMetrics}
          />
        )}

        {currentTab === 'why-openai' && (
          <WhyOpenAi />
        )}

        {currentTab === 'setup' && (
          <SetupGuide
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onNavigate={setCurrentTab}
      />

      {/* Quiet, Human-Designed Footer */}
      <footer className="w-full border-t border-stone-200/80 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              LazyMate AI
            </span>
            <span>·</span>
            <span>Slow and Steady Productivity with Gemma Open Weights</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setCurrentTab('why-openai')}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              Why Open AI?
            </button>
            <button
              onClick={() => setCurrentTab('setup')}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              Setup Guide
            </button>
            <button
              onClick={() => setCurrentTab('sloth-score')}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              Sloth Math
            </button>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <Shield className="w-3 h-3" />
              <span>Zero Text Storage</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
