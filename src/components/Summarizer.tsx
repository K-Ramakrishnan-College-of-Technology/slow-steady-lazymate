import React, { useState } from 'react';
import { ModelSettings, GenerationResult } from '../types';
import { generateContentWithGemma } from '../services/aiService';
import {
  FileText,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
} from 'lucide-react';

interface SummarizerProps {
  settings: ModelSettings;
  onRecordWords: (wordsSummarized: number) => void;
}

export const Summarizer: React.FC<SummarizerProps> = ({ settings, onRecordWords }) => {
  const [inputText, setInputText] = useState('');
  const [includeBullets, setIncludeBullets] = useState(true);
  const [tone, setTone] = useState<'crisp' | 'executive' | 'casual'>('crisp');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleTexts = [
    {
      title: 'Quarterly Team Memo',
      text: `Team, over the past twelve weeks we observed a notable spike in infrastructure latency caused by redundant serialization in our notification microservices. While our core SLA remains at 99.85%, user feedback indicates subtle friction during peak European business hours. In response, engineering proposed migrating the cache layers to Redis 7 with automatic cluster sharding, which is projected to reduce p99 response times from 340ms to 42ms. However, this migration requires two scheduled 15-minute maintenance windows on consecutive Saturdays at 03:00 UTC. In the interim, marketing and customer success must prepare user announcements by Wednesday noon, and DevOps must finalize staging test suites before Friday. Non-essential product feature rollouts will be briefly deferred until next sprint to guarantee zero disruptions to core checkout operations.`,
    },
    {
      title: 'Customer Feedback Thread',
      text: `Hello Support Team. I have been using your productivity tier for 6 months across our 14-person remote marketing agency. Overall the interface is clean, but over the last two updates we noticed the export to CSV button frequently fails when files exceed 500 rows. In addition, when we try to assign recurring deadlines on alternate Wednesdays, the date selector skips the first week of next month. Two of our client campaigns were delayed because of this confusion. We would love to remain on the yearly plan if this bug can be patched this week, but if not we will be forced to look at alternative workflow managers by the end of the current billing cycle.`,
    },
    {
      title: 'Technical Whitepaper Excerpt',
      text: `Large language models require significant computational resources for standard inference, primarily driven by memory bandwidth saturation during the autoregressive decoding phase. Google Gemma represents an open-weight family of lightweight, high-performance models engineered using the same research and technology that created the Gemini models. By employing multi-query attention (MQA), GeGLU activations, and rotary position embeddings, Gemma achieves competitive reasoning and summarization benchmarks while remaining compact enough to run on local workstation GPUs or even high-end laptop processors without sending sensitive organizational data to third-party cloud infrastructure.`,
    },
  ];

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please enter or paste text to summarize.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const systemPrompt = `You are LazyMate AI's Smart Text Summarizer, powered by Gemma architecture.
Your core goal is to save the reader's mental energy by eliminating fluff.
Format your output EXACTLY as follows:

Line 1: [Main takeaway / core reality in 1 concise sentence]
Line 2: [Action item, consequence, or next step in 1 concise sentence]

${includeBullets ? 'Then list 2 to 3 bullet points highlighting critical context or constraints.' : 'Do not include bullet points.'}
Tone style: ${tone}. Be clear, direct, and zero-fluff. Never invent facts not in the source text.`;

    try {
      const response = await generateContentWithGemma(
        inputText,
        systemPrompt,
        'summarize',
        settings
      );
      setResult(response);
      
      const wordCount = inputText.trim().split(/\s+/).length;
      onRecordWords(wordCount);
    } catch (err: any) {
      setErrorMsg(err.message || 'Summarization failed. Please check your model runner or toggle Demo Mode.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummary = () => {
    if (!result?.text) return;
    const blob = new Blob([result.text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lazymate_summary_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const inputWordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const estimatedReadTimeMin = Math.round((inputWordCount / 220) * 10) / 10;
  const outputWordCount = result ? result.text.trim().split(/\s+/).length : 0;
  const summaryReadTimeMin = Math.round((outputWordCount / 220) * 10) / 10;
  const minutesSaved = Math.max(0, Math.round((estimatedReadTimeMin - summaryReadTimeMin) * 10) / 10);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
              Smart Text Summarizer
            </h1>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
              · Two-Line Clarity
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Condenses lengthy documents, emails, and articles into a 2-line essential briefing using Gemma.
          </p>
        </div>

        {/* Sample text buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-stone-400 dark:text-stone-500 whitespace-nowrap">Sample text:</span>
          {sampleTexts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                setErrorMsg(null);
              }}
              className="px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0 border border-stone-200 dark:border-stone-700"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Input Panel */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium text-stone-700 dark:text-stone-300">Source Content</span>
            <div className="flex items-center gap-3">
              <span className="font-mono tabular-nums">{inputWordCount} words</span>
              <span>·</span>
              <span className="font-mono tabular-nums">~{estimatedReadTimeMin} min read</span>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your lengthy email, article, meeting transcript, or notes here..."
            rows={11}
            className="w-full text-sm p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:focus:ring-emerald-400/30 transition-all font-body leading-relaxed resize-y"
          />

          {/* Controls Bar */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={includeBullets}
                  onChange={(e) => setIncludeBullets(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span>Include Key Bullets</span>
              </label>

              <div className="flex items-center gap-1">
                <span className="text-stone-400">Tone:</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded px-2 py-0.5"
                >
                  <option value="crisp">Crisp & Direct</option>
                  <option value="executive">Executive Brief</option>
                  <option value="casual">Casual & Relaxed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {inputText && (
                <button
                  onClick={() => {
                    setInputText('');
                    setResult(null);
                  }}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleSummarize}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Condensing with Gemma...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Summarize Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}
        </div>

        {/* Right Column: Output Panel */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium text-stone-700 dark:text-stone-300">Two-Line Digest</span>
            {result && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                  ~{minutesSaved}m saved
                </span>
                <span>·</span>
                <span className="text-[11px]">{result.latencyMs}ms</span>
              </div>
            )}
          </div>

          {result ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
                <div className="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap font-body leading-relaxed">
                  {result.text}
                </div>
              </div>

              {/* Runner Details & Transparent Time Saved Info */}
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Time Calculation:</span>
                  </span>
                  <span className="font-mono tabular-nums">
                    ({inputWordCount} words ÷ 220 wpm) - ({outputWordCount} words ÷ 220 wpm)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Inference Engine: {result.model}</span>
                  <span className="font-mono">{result.isLocal ? '100% Local Run' : 'Cloud Acceleration'}</span>
                </div>
                {result.fallbackReason && (
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                    Note: {result.fallbackReason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={downloadSummary}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg text-stone-400 dark:text-stone-600 space-y-2">
              <FileText className="w-8 h-8 stroke-1" />
              <div className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Awaiting your text
              </div>
              <p className="text-xs max-w-xs text-stone-400 dark:text-stone-500">
                Paste any article or pick a sample above, then click &ldquo;Summarize Text&rdquo; to test Gemma&apos;s two-line synthesis.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
