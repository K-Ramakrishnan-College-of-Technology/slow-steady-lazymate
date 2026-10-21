import React, { useState } from 'react';
import { ModelSettings, GenerationResult } from '../types';
import { generateContentWithGemma } from '../services/aiService';
import {
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  Smile,
  ShieldBan,
  Briefcase,
  Moon,
} from 'lucide-react';

interface QuickRepliesProps {
  settings: ModelSettings;
  onRecordReply: (wordsGenerated: number) => void;
}

type ReplyTone = 'brief' | 'friendly' | 'decline' | 'diplomatic' | 'sloth';

export const QuickReplies: React.FC<QuickRepliesProps> = ({ settings, onRecordReply }) => {
  const [incomingMessage, setIncomingMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState<ReplyTone>('friendly');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleMessages = [
    {
      label: '5 PM Friday Meeting Request',
      text: 'Hey! Are you free for a quick 45-minute sync at 5:00 PM today? We need to review the slide deck for next Monday morning and align on the final KPIs.',
    },
    {
      label: 'Client Out-of-Scope Favor',
      text: 'Hi there, since you already built the landing page so well, could you quickly design 4 matching social media banner templates by tomorrow afternoon? It shouldn’t take more than an hour!',
    },
    {
      label: 'Casual Lunch / Coffee Invite',
      text: 'Hey friend! A few of us are grabbing lunch around 1 PM and maybe catching up on projects. Let us know if you want to join us downstairs!',
    },
  ];

  const tones: { id: ReplyTone; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'brief', label: 'Ultra-Brief', icon: <ThumbsUp className="w-3.5 h-3.5" />, desc: '1 sentence, direct & clear' },
    { id: 'friendly', label: 'Warm & Friendly', icon: <Smile className="w-3.5 h-3.5" />, desc: 'Kind, supportive & upbeat' },
    { id: 'decline', label: 'Polite Decline', icon: <ShieldBan className="w-3.5 h-3.5" />, desc: 'Saying no without guilt' },
    { id: 'diplomatic', label: 'Corporate Diplomatic', icon: <Briefcase className="w-3.5 h-3.5" />, desc: 'Professional & boundaried' },
    { id: 'sloth', label: 'Sloth Chill', icon: <Moon className="w-3.5 h-3.5" />, desc: 'Low stress, pacing expectations' },
  ];

  const handleGenerateReplies = async () => {
    if (!incomingMessage.trim()) {
      setErrorMsg('Please paste the message or email you received.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const systemPrompt = `You are LazyMate AI's Quick Reply Generator, powered by Gemma architecture.
The user pasted an incoming message. Your goal is to generate exactly THREE high-quality, ready-to-send reply variations in the selected tone: "${selectedTone}".
${customInstructions ? `Additional context: ${customInstructions}` : ''}

Formatting rules:
Format your answer with exactly:
Option 1: [Short, polished reply]
Option 2: [Slightly alternative phrasing]
Option 3: [More direct or concise phrasing]

Make each option ready to paste without editing. Keep responses natural, human, respectful, and zero-fluff. Never invent imaginary promises.`;

    try {
      const response = await generateContentWithGemma(
        incomingMessage,
        systemPrompt,
        'replies',
        settings
      );
      setResult(response);

      const words = response.text.trim().split(/\s+/).length;
      onRecordReply(words);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate replies.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to split response into 3 cards
  const parseOptions = (text: string) => {
    const parts = text.split(/Option \d+:\s*/i).filter((p) => p.trim());
    if (parts.length >= 2) {
      return parts.map((p) => p.trim());
    }
    // Fallback: split by double newlines or numbered lines
    const byNum = text.split(/\n(?=\d+[\.\)]\s*)/).filter((p) => p.trim());
    if (byNum.length >= 2) {
      return byNum.map((p) => p.replace(/^\d+[\.\)]\s*/, '').trim());
    }
    return [text];
  };

  const options = result ? parseOptions(result.text) : [];

  const copyOption = (text: string, index: number) => {
    // Strip quotes if wrapped
    const cleanText = text.replace(/^["']|["']$/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
              Quick Reply Generator
            </h1>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
              · Instant Boundaries & Courtesy
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Never struggle over how to answer a tricky email or message. Let Gemma craft 3 ready-to-send options.
          </p>
        </div>

        {/* Sample Messages */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-stone-400 whitespace-nowrap">Sample:</span>
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIncomingMessage(sample.text);
                setErrorMsg(null);
              }}
              className="px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0 border border-stone-200 dark:border-stone-700"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Input and Tone selector (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700 dark:text-stone-300">Received Message</span>
            <span>Paste below</span>
          </div>

          <textarea
            value={incomingMessage}
            onChange={(e) => setIncomingMessage(e.target.value)}
            placeholder="Paste the email or chat message you need to respond to..."
            rows={6}
            className="w-full text-sm p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-body leading-relaxed"
          />

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
              Desired Tone Style:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs text-left transition-all ${
                    selectedTone === t.id
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-950/40 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {t.icon}
                    <span>{t.label}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500 font-normal">
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional context */}
          <div className="space-y-1">
            <label className="text-xs text-stone-500">
              Optional Context (e.g. &ldquo;Busy till Tuesday&rdquo; or &ldquo;Offer alternative date&rdquo;):
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Suggest a 15-minute call on Monday instead"
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
            <button
              onClick={handleGenerateReplies}
              disabled={loading}
              className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting with Gemma...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate 3 Quick Replies</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}
        </div>

        {/* Right Column: 3 Reply Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              Ready-to-Copy Replies
            </span>
            {result && (
              <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                {result.latencyMs}ms · {result.model}
              </span>
            )}
          </div>

          {options.length > 0 ? (
            <div className="space-y-3.5 animate-fadeIn">
              {options.map((option, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs space-y-3 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">
                      Option {idx + 1}
                    </span>
                    <button
                      onClick={() => copyOption(option, idx)}
                      className="px-2.5 py-1 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 hover:text-emerald-900 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-stone-800 dark:text-stone-200 font-body leading-relaxed select-all">
                    {option.replace(/^["']|["']$/g, '')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg text-stone-400 dark:text-stone-600 space-y-2">
              <MessageSquare className="w-8 h-8 stroke-1" />
              <div className="text-sm font-medium text-stone-600 dark:text-stone-400">
                No replies drafted yet
              </div>
              <p className="text-xs max-w-xs text-stone-400 dark:text-stone-500">
                Paste any email or message on the left, pick a tone, and LazyMate AI will prepare 3 polished variations.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
