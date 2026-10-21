import React from 'react';
import { NavigationTab } from '../types';
import {
  FileText,
  CheckSquare,
  MessageSquare,
  FolderTree,
  Sparkles,
  Award,
  BookOpen,
  Terminal,
} from 'lucide-react';

interface NavigationTabsProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ currentTab, onNavigate }) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'summarizer', label: 'Summarizer', icon: <FileText className="w-4 h-4" /> },
    { id: 'planner', label: 'Lazy Task Planner', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'replies', label: 'Quick Replies', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'organizer', label: 'Organize Notes', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'relax', label: 'Relax Mode', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'sloth-score', label: 'Daily Sloth Score', icon: <Award className="w-4 h-4" /> },
    { id: 'why-openai', label: 'Why Open AI?', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'setup', label: 'Gemma Setup', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-200/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 rounded-xl min-w-max">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-700/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 ml-0.5">
                  · {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
