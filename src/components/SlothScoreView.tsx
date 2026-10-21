import React from 'react';
import { SlothMetrics } from '../types';
import { calculateSlothSavings } from '../utils/slothScore';
import {
  Award,
  Clock,
  BatteryCharging,
  FileText,
  MessageSquare,
  CheckSquare,
  Sparkles,
  Calculator,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface SlothScoreViewProps {
  metrics: SlothMetrics;
  onResetMetrics: () => void;
}

export const SlothScoreView: React.FC<SlothScoreViewProps> = ({ metrics, onResetMetrics }) => {
  const savings = calculateSlothSavings(metrics);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
              Daily Sloth Score & Transparency Dashboard
            </h1>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
              · Real Math, No Fake Scores
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            We avoid hallucinated AI novelty metrics. Here is an exact breakdown of time and repetitive labor saved through automation.
          </p>
        </div>

        <button
          onClick={onResetMetrics}
          className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session Metrics</span>
        </button>
      </div>

      {/* Main Score & Status Banner */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-400">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Current Mastery Level</span>
            </div>
            
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              {savings.slothRating}
            </h2>
            
            <p className="text-sm text-stone-600 dark:text-stone-300 italic max-w-md">
              &ldquo;{savings.slothMotto}&rdquo;
            </p>

            {/* Energy Conservation Bar */}
            <div className="pt-3 space-y-2 max-w-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 dark:text-stone-400 font-medium flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Energy Conserved Today:</span>
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {savings.energyConservedPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${savings.energyConservedPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 text-center space-y-1">
              <div className="font-mono text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {savings.totalMinutesSaved}m
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Total Saved</div>
            </div>
            <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 text-center space-y-1">
              <div className="font-mono text-3xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {metrics.wordsSummarized + metrics.wordsGenerated}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Words Processed</div>
            </div>
            <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 text-center space-y-1">
              <div className="font-mono text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {metrics.tasksPlanned}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Tasks Prioritized</div>
            </div>
            <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60 text-center space-y-1">
              <div className="font-mono text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                {metrics.relaxSessions}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Relax Sessions</div>
            </div>
          </div>

        </div>
      </div>

      {/* Transparent Math Breakdown Section */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="font-display font-bold text-base text-stone-900 dark:text-stone-100">
            The Mathematical Formula (Audit Ready)
          </h3>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          Unlike apps that display arbitrary AI novelty scores, LazyMate AI estimates savings based on verified human psychomotor and cognitive baselines:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>1. Reading Savings</span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono">
              Formula: Words Condensed ÷ 220 WPM
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Based on the peer-reviewed adult reading speed standard (200–240 words per minute).
            </p>
            <div className="pt-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Saved: {savings.readingMinutesSaved} minutes
            </div>
          </div>

          <div className="p-4 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>2. Drafting & Typing</span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono">
              Formula: Words Drafted ÷ 40 WPM
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Average keyboard composition and editing throughput for business emails and replies.
            </p>
            <div className="pt-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Saved: {savings.typingMinutesSaved} minutes
            </div>
          </div>

          <div className="p-4 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>3. Cognitive Triage</span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono">
              Formula: (Tasks × 6m) + (Notes × 8m)
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Cognitive overhead eliminated by auto-categorizing messy backlogs into 80/20 buckets.
            </p>
            <div className="pt-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Saved: {savings.organizationMinutesSaved} minutes
            </div>
          </div>

        </div>

        <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Privacy Guarantee: All metrics are calculated client-side in your current session. No personal logs or telemetry are uploaded to external trackers.
          </span>
        </div>

      </div>

    </div>
  );
};
