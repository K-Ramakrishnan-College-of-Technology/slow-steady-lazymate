import React from 'react';
import { ModelSettings, NavigationTab, AIProvider } from '../types';
import {
  X,
  Sliders,
  Zap,
  Cpu,
  ShieldCheck,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ModelSettings;
  onUpdateSettings: (newSettings: Partial<ModelSettings>) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h2 className="font-display font-bold text-base text-stone-900 dark:text-stone-100">
              Gemma Model Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs">
          
          {/* Demo Mode Toggle */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Simulation Mode</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Use built-in Gemma 2 heuristics without local Ollama or cloud credentials.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.demoMode}
              onChange={(e) => onUpdateSettings({ demoMode: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer h-4 w-4"
            />
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="font-semibold text-stone-700 dark:text-stone-300">
              Inference Provider
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'auto' as AIProvider, title: 'Automatic Route (Local Ollama first, then Cloud)' },
                { id: 'ollama' as AIProvider, title: 'Local Ollama Only (100% On-Device Offline)' },
                { id: 'cloud' as AIProvider, title: 'Cloud Gemma Acceleration' },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    settings.provider === p.id && !settings.demoMode
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    checked={settings.provider === p.id && !settings.demoMode}
                    onChange={() => onUpdateSettings({ provider: p.id, demoMode: false })}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>{p.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">
              Gemma Model Checkpoint
            </label>
            <select
              value={settings.selectedModel}
              onChange={(e) => onUpdateSettings({ selectedModel: e.target.value })}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200 font-mono"
            >
              <option value="gemma2:2b">gemma2:2b (Recommended, 1.6GB VRAM)</option>
              <option value="gemma2:9b">gemma2:9b (Rich reasoning, 5.4GB VRAM)</option>
              <option value="gemma2:27b">gemma2:27b (Workstation grade)</option>
              <option value="gemma:2b">gemma:2b (Legacy Gemma v1)</option>
            </select>
          </div>

          {/* Local Ollama URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">
              Ollama Server Address
            </label>
            <input
              type="text"
              value={settings.localOllamaUrl}
              onChange={(e) => onUpdateSettings({ localOllamaUrl: e.target.value })}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200 font-mono"
              placeholder="http://127.0.0.1:11434"
            />
          </div>

          {/* Full Setup Guide Link */}
          <button
            onClick={() => {
              onClose();
              onNavigate('setup');
            }}
            className="w-full py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open Full Setup & Connection Guide</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
