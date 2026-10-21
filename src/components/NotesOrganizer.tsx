import React, { useState } from 'react';
import { ModelSettings, GenerationResult } from '../types';
import { generateContentWithGemma } from '../services/aiService';
import {
  FolderTree,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

interface NotesOrganizerProps {
  settings: ModelSettings;
  onRecordNotes: (notesCount: number) => void;
}

export const NotesOrganizer: React.FC<NotesOrganizerProps> = ({ settings, onRecordNotes }) => {
  const [messyNotes, setMessyNotes] = useState('');
  const [structureType, setStructureType] = useState<'meeting' | 'knowledge' | 'actionable'>('meeting');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleMessyNotes = `talked with Sarah about backend latency - database query for orders is slow af, need an index on user_id and created_at. Dave thinks we should also cache session tokens in memory instead of postgres query every 5 seconds. Sarah will check AWS bills because cloudwatch costs went up 20% last month unexpectedly, maybe due to debug logging left on. Remember to email client by Friday about API deprecation. Also need someone to review pull request 402 for login page redesign. Do we have a staging environment for testing? Ask Liam. Next sync next Tuesday 10am.`;

  const handleOrganizeNotes = async () => {
    if (!messyNotes.trim()) {
      setErrorMsg('Please paste messy notes or click the sample above.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const systemPrompt = `You are LazyMate AI's Text Organizer, powered by Gemma architecture.
Transform the user's messy, unstructured stream-of-consciousness text into cleanly organized, professional Markdown.

Selected Structure Mode: ${structureType}
Structure guidelines:
1. Executive Summary (1-2 sentences on primary context)
2. Categorized Bullet Points (Group related items under meaningful headings)
3. Action Items / To-Dos (Use checklist format "- [ ] Task (Owner/Context)")
4. Key Decisions & Blockers / Questions

Make it scannable, beautifully indented, and eliminate conversational filler. Keep all key technical details intact.`;

    try {
      const response = await generateContentWithGemma(
        messyNotes,
        systemPrompt,
        'organizer',
        settings
      );
      setResult(response);
      onRecordNotes(1);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to organize notes.');
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

  const downloadMarkdown = () => {
    if (!result?.text) return;
    const blob = new Blob([result.text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organized_notes_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
              Text & Notes Organizer
            </h1>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
              · Chaos to Structure
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Turn disorganized meeting scribbles and brainstorm dumps into structured categories, decisions, and checklists.
          </p>
        </div>

        <button
          onClick={() => {
            setMessyNotes(sampleMessyNotes);
            setErrorMsg(null);
          }}
          className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors border border-stone-200 dark:border-stone-700 whitespace-nowrap self-start sm:self-auto"
        >
          Load Messy Sync Notes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Raw Notes */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700 dark:text-stone-300">Raw Notes Input</span>
            <span>Any format welcome</span>
          </div>

          <textarea
            value={messyNotes}
            onChange={(e) => setMessyNotes(e.target.value)}
            placeholder="Type or paste messy notes here:
- scattered thoughts
- meeting notes with names
- half-formed sentences
- links, tasks, random remarks..."
            rows={12}
            className="w-full text-sm p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-body leading-relaxed"
          />

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500">Format:</span>
              <select
                value={structureType}
                onChange={(e) => setStructureType(e.target.value as any)}
                className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded px-2 py-1 text-xs"
              >
                <option value="meeting">Meeting Summary & Action Items</option>
                <option value="actionable">Action-First Checklist Matrix</option>
                <option value="knowledge">Structured Knowledge / Study Digest</option>
              </select>
            </div>

            <button
              onClick={handleOrganizeNotes}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Structuring with Gemma...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Organize Notes</span>
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

        {/* Right Column: Structured Output */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              Clean Structured Markdown
            </span>
            {result && (
              <span className="font-mono text-emerald-700 dark:text-emerald-400">
                {result.latencyMs}ms · {result.model}
              </span>
            )}
          </div>

          {result ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-lg bg-stone-50/60 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 max-h-[380px] overflow-y-auto">
                <div className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap font-body leading-relaxed">
                  {result.text}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={downloadMarkdown}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Markdown</span>
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
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg text-stone-400 dark:text-stone-600 space-y-2">
              <FolderTree className="w-8 h-8 stroke-1" />
              <div className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Awaiting your messy notes
              </div>
              <p className="text-xs max-w-xs text-stone-400 dark:text-stone-500">
                Paste any unstructured thoughts on the left, and Gemma will sort them into tidy sections and checklists.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
