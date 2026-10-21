export type NavigationTab =
  | 'overview'
  | 'summarizer'
  | 'planner'
  | 'replies'
  | 'organizer'
  | 'relax'
  | 'sloth-score'
  | 'why-openai'
  | 'setup';

export type AIProvider = 'auto' | 'ollama' | 'cloud' | 'demo';

export interface ModelSettings {
  provider: AIProvider;
  localOllamaUrl: string;
  selectedModel: string;
  demoMode: boolean;
}

export interface GenerationResult {
  text: string;
  providerUsed: 'ollama' | 'cloud' | 'heuristic' | 'demo';
  model: string;
  latencyMs: number;
  isLocal: boolean;
  fallbackReason?: string;
}

export interface SlothMetrics {
  wordsSummarized: number;
  wordsGenerated: number;
  tasksPlanned: number;
  repliesSent: number;
  notesStructured: number;
  relaxSessions: number;
}

export interface TaskItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'micro' | 'moderate' | 'chill';
  estimatedMinutes: number;
  completed: boolean;
  category?: string;
}

export interface OrganizedTaskGroup {
  groupTitle: string;
  tagline: string;
  tasks: TaskItem[];
}
