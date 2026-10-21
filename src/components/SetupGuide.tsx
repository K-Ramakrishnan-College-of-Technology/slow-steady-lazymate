import React, { useState } from 'react';
import { ModelSettings, AIProvider } from '../types';
import {
  Terminal,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Zap,
  Globe,
  Sliders,
} from 'lucide-react';

interface SetupGuideProps {
  settings: ModelSettings;
  onUpdateSettings: (newSettings: Partial<ModelSettings>) => void;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ settings, onUpdateSettings }) => {
  const [testUrl, setTestUrl] = useState(settings.localOllamaUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    models?: any[];
    error?: string;
    message?: string;
  } | null>(null);

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-local-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          models: data.models || [],
          message: 'Connected successfully to local Ollama runner!',
        });
        onUpdateSettings({ localOllamaUrl: testUrl });
      } else {
        setTestResult({
          success: false,
          error: data.error || 'Failed to connect to local server.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: `Network error: ${err.message}. Make sure Ollama is running and OLLAMA_ORIGINS="*" is set.`,
      });
    } finally {
      setTesting(false);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Gemma Model Setup & Runner Configuration
          </h1>
          <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
            · Modular Architecture
          </span>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Configure how LazyMate AI executes Gemma open-weight inference: locally on your machine via Ollama, via Cloud Gemma acceleration, or in Demo mode.
        </p>
      </div>

      {/* Runner Preferences Card */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-display text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Inference Provider Mode</span>
            </h2>
            <p className="text-xs text-stone-500">
              Select your preferred inference pathway for text generation and summarization.
            </p>
          </div>

          {/* Demo Mode Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700">
            <Zap className={`w-3.5 h-3.5 ${settings.demoMode ? 'text-amber-500' : 'text-stone-400'}`} />
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Demo Mode
            </span>
            <input
              type="checkbox"
              checked={settings.demoMode}
              onChange={(e) => onUpdateSettings({ demoMode: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </label>
        </div>

        {settings.demoMode && (
          <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Zap className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <strong>Demo Mode Active:</strong> LazyMate AI is using simulated Gemma 2 heuristic responses. This allows you to explore the interface, task planner, and summarizer without running a local Ollama server or configuring an API key.
            </div>
          </div>
        )}

        {/* 4 Provider Radio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'auto' as AIProvider,
              title: 'Auto (Recommended)',
              badge: 'Smart Route',
              desc: 'Tries local Ollama first for 100% offline privacy; smoothly falls back to Cloud Gemma if local runner is not running.',
            },
            {
              id: 'ollama' as AIProvider,
              title: 'Ollama (Strictly Local)',
              badge: '100% Offline',
              desc: 'Enforces pure on-device execution. Never transmits data across the internet. Fails if local Ollama is offline.',
            },
            {
              id: 'cloud' as AIProvider,
              title: 'Cloud Acceleration',
              badge: 'Fast & Always-On',
              desc: 'Routes through secure server-side Gemma runner. In-memory zero-storage processing.',
            },
          ].map((prov) => {
            const isSelected = settings.provider === prov.id;
            return (
              <div
                key={prov.id}
                onClick={() => onUpdateSettings({ provider: prov.id, demoMode: false })}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600/50'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-950/30 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                    {prov.title}
                  </span>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono">
                    {prov.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {prov.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Local Endpoint Tester */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                Local Ollama Endpoint & Model Target
              </h3>
              <p className="text-[11px] text-stone-500">
                Point to your local or homelab Ollama runner (default: http://127.0.0.1:11434).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="http://127.0.0.1:11434"
                className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 font-mono w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={testConnection}
                disabled={testing}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1 border border-stone-200 dark:border-stone-700 disabled:opacity-50"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Terminal className="w-3.5 h-3.5" />}
                <span>Test Ping</span>
              </button>
            </div>
          </div>

          {/* Model selection */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-stone-500">Target Model Tag:</span>
            <select
              value={settings.selectedModel}
              onChange={(e) => onUpdateSettings({ selectedModel: e.target.value })}
              className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded px-2.5 py-1 font-mono text-xs"
            >
              <option value="gemma2:2b">gemma2:2b (Fast, 1.6GB)</option>
              <option value="gemma2:9b">gemma2:9b (Balanced, 5.4GB)</option>
              <option value="gemma2:27b">gemma2:27b (High precision)</option>
              <option value="gemma:2b">gemma:2b (v1)</option>
            </select>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div>{testResult.message || testResult.error}</div>
                {testResult.models && testResult.models.length > 0 && (
                  <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                    Detected Installed Models: {testResult.models.map((m: any) => m.name).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Local Setup Guide */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="font-display text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>How to Run Gemma Locally via Ollama (3 Steps)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Follow this 2-minute walkthrough to run LazyMate AI with 100% offline privacy on your Mac, Windows, or Linux system.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Step 1: Install Ollama
              </span>
              <span className="text-[11px] text-stone-400">macOS, Windows, Linux</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Download Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-medium">ollama.com</a> or run the terminal command:
            </p>
            <div className="flex items-center justify-between bg-stone-900 text-stone-100 p-2.5 rounded-lg font-mono text-xs">
              <code>curl -fsSL https://ollama.com/install.sh | sh</code>
              <button
                onClick={() => copyCommand('curl -fsSL https://ollama.com/install.sh | sh')}
                className="text-stone-400 hover:text-stone-200"
              >
                {copiedCmd === 'curl -fsSL https://ollama.com/install.sh | sh' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Step 2: Pull the Gemma 2 Model
              </span>
              <span className="text-[11px] text-stone-400">Lightweight & Fast</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              In your terminal, pull and start Gemma 2B (recommended for instant responsiveness):
            </p>
            <div className="flex items-center justify-between bg-stone-900 text-stone-100 p-2.5 rounded-lg font-mono text-xs">
              <code>ollama run gemma2:2b</code>
              <button
                onClick={() => copyCommand('ollama run gemma2:2b')}
                className="text-stone-400 hover:text-stone-200"
              >
                {copiedCmd === 'ollama run gemma2:2b' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              For higher reasoning capability, you can alternatively run <code>ollama run gemma2:9b</code>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Step 3: Enable Browser Origin Access (CORS)
              </span>
              <span className="text-[11px] text-stone-400">Allows Web Connectivity</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              To allow browser-based apps to communicate with your local Ollama port, launch Ollama with CORS origins enabled:
            </p>
            <div className="flex items-center justify-between bg-stone-900 text-stone-100 p-2.5 rounded-lg font-mono text-xs">
              <code>OLLAMA_ORIGINS=&quot;*&quot; ollama serve</code>
              <button
                onClick={() => copyCommand('OLLAMA_ORIGINS="*" ollama serve')}
                className="text-stone-400 hover:text-stone-200"
              >
                {copiedCmd === 'OLLAMA_ORIGINS="*" ollama serve' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

        </div>

        <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            With this configuration active, LazyMate AI routes directly to your local hardware. No tokens or inputs ever leave your machine.
          </span>
        </div>
      </div>

    </div>
  );
};
