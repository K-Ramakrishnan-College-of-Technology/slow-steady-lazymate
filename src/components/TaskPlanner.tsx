import React, { useState } from 'react';
import { ModelSettings, GenerationResult } from '../types';
import { generateContentWithGemma } from '../services/aiService';
import {
  CheckSquare,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Check,
  Coffee,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface TaskPlannerProps {
  settings: ModelSettings;
  onRecordTasks: (tasksPlanned: number) => void;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({ settings, onRecordTasks }) => {
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive task list parsed or manual
  const [activeTasks, setActiveTasks] = useState<
    { id: string; text: string; category: string; completed: boolean; effort: string }[]
  >([
    { id: '1', text: 'Review critical deployment blockers with team', category: 'High Impact', completed: false, effort: '15 min' },
    { id: '2', text: 'Approve vendor invoice for design system', category: 'High Impact', completed: true, effort: '5 min' },
    { id: '3', text: 'Reply to client check-in email using template', category: 'Low Energy', completed: false, effort: '10 min' },
    { id: '4', text: 'Color-code legacy Google Drive folders', category: 'Postpone/Drop', completed: false, effort: 'Postpone' },
  ]);

  const [newTaskText, setNewTaskText] = useState('');

  const sampleDump = `1. Finish quarterly budget deck
2. Reply to 18 non-urgent emails in inbox
3. Re-organize team Jira board
4. Fix blocking customer checkout bug
5. Book flights for conference next month
6. Deep clean office desktop
7. Send weekly 2-minute status update to manager
8. Attend optional 1-hour brainstorming call on future logos
9. Pay pending software subscription invoices`;

  const handlePlanTasks = async () => {
    if (!taskInput.trim()) {
      setErrorMsg('Please enter a list of tasks to prioritize.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const systemPrompt = `You are LazyMate AI's Lazy Task Planner, powered by Gemma architecture.
Your philosophy is the 80/20 Rule & Minimum Viable Effort. You help users achieve maximum outcome while expending the minimum physical and emotional energy.

Take the user's messy list of tasks and organize them into exactly three distinct sections:
1. High Impact / Minimal Drag (Top 2-3 items that truly move the needle today, with estimated minutes)
2. Low Energy / Chill Sprints (Quick tasks you can do while sipping coffee or when energy is low, <15 min each)
3. Safe to Postpone, Delegate, or Say No To (Non-essential busywork that can wait or be eliminated without catastrophe)

Format using clean markdown with clear bullet points. Add 1 gentle sloth tip at the end for resting without guilt.`;

    try {
      const response = await generateContentWithGemma(
        taskInput,
        systemPrompt,
        'planner',
        settings
      );
      setResult(response);

      // Parse tasks into interactive checkboxes if possible
      const lines = taskInput.split('\n').filter((l) => l.trim());
      onRecordTasks(lines.length || 5);

      // Populate interactive checklist
      const newItems = lines.slice(0, 6).map((line, idx) => ({
        id: String(Date.now() + idx),
        text: line.replace(/^\d+[\.\)]\s*/, '').trim(),
        category: idx < 2 ? 'High Impact' : idx < 4 ? 'Low Energy' : 'Postpone/Drop',
        completed: false,
        effort: idx < 2 ? '20 min' : idx < 4 ? '10 min' : 'Later',
      }));
      setActiveTasks(newItems);
    } catch (err: any) {
      setErrorMsg(err.message || 'Task planning failed.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    setActiveTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTask = (id: string) => {
    setActiveTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setActiveTasks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        text: newTaskText.trim(),
        category: 'Low Energy',
        completed: false,
        effort: '10 min',
      },
    ]);
    setNewTaskText('');
  };

  const copyPlan = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
              Lazy Task Planner
            </h1>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
              · 80/20 Minimum Effort Rule
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Turn an overwhelming to-do dump into a high-leverage, low-stress plan with built-in sloth rest pauses.
          </p>
        </div>

        <button
          onClick={() => {
            setTaskInput(sampleDump);
            setErrorMsg(null);
          }}
          className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors border border-stone-200 dark:border-stone-700 whitespace-nowrap self-start sm:self-auto"
        >
          Load Chaotic Monday Dump
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Input (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium text-stone-700 dark:text-stone-300">Unfiltered Task Dump</span>
            <span>Raw Brain Dump</span>
          </div>

          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Dump everything on your mind here...
e.g.
1. Write weekly update
2. Reorganize downloads folder
3. Call accountant
4. Prep client presentation"
            rows={10}
            className="w-full text-sm p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-body leading-relaxed"
          />

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-[11px] text-stone-500 flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-amber-700 dark:text-amber-500" />
              <span>Prioritizes lowest energy cost</span>
            </span>

            <button
              onClick={handlePlanTasks}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sorting with Gemma...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prioritize with AI</span>
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

        {/* Right Column: AI Prioritized Plan & Interactive Board (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* AI Structured Plan Response */}
          {result && (
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                  Gemma 2 Minimum Effort Plan
                </span>
                <button
                  onClick={copyPlan}
                  className="flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:text-emerald-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Plan'}</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap font-body leading-relaxed">
                {result.text}
              </div>
            </div>
          )}

          {/* Interactive Sloth Action Checklist */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                  Interactive Sloth Checklist
                </h3>
              </div>
              <span className="text-stone-500">
                {activeTasks.filter((t) => t.completed).length} of {activeTasks.length} done
              </span>
            </div>

            <div className="space-y-2">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-all text-xs ${
                    task.completed
                      ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 opacity-60'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-400/60'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="rounded text-emerald-700 focus:ring-emerald-500"
                    />
                    <span
                      className={`truncate ${
                        task.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {task.text}
                    </span>
                  </label>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        task.category === 'High Impact'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : task.category === 'Low Energy'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                      }`}
                    >
                      {task.effort}
                    </span>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Task */}
            <form onSubmit={addTask} className="flex gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add another single task..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sloth Pacing Rule: Complete ONE item, then take a calm 5-minute stretch. Never sprint through fatigue.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
