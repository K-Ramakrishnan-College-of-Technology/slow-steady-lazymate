import { GenerationResult, ModelSettings } from '../types';

export const DEFAULT_MODEL_SETTINGS: ModelSettings = {
  provider: 'auto',
  localOllamaUrl: 'http://127.0.0.1:11434',
  selectedModel: 'gemma2:2b',
  demoMode: false,
};

// Built-in intelligent heuristic engine formatted like Gemma 2 output for offline demo testing
function generateDemoResponse(prompt: string, feature: string): string {
  switch (feature) {
    case 'summarize':
      return `Two-Line Summary:
Line 1: Key priorities and timelines require shifting non-essential deliverables to maintain core system quality.
Line 2: Action is recommended on blocking items immediately, while secondary requests can be batched with minimal effort.

Key Insights:
• Core goal: Protect team energy while finishing high-leverage deliverables.
• Quick win: Drop redundant status syncs and communicate via asynchronous summaries.`;

    case 'planner':
      return `### Minimum Viable Plan (The 80/20 Lazy Way)

**1. High-Impact, Minimal Drag (Do First — 25 mins)**
- [ ] Review critical feedback and unblock team deployment (15 min)
- [ ] Send approval email for budget request (5 min)

**2. Low Energy / Chill Sprints (Do After Coffee — 30 mins)**
- [ ] Skim through weekly project updates and add 2 comments (15 min)
- [ ] Clean up inbox clutter using quick reply templates (15 min)

**3. Safe to Postpone / Delegate (Save Your Energy)**
- [ ] Reorganizing file archive folder (Zero urgency — postpone to Friday)
- [ ] Optional sync meeting (Decline politely with automated summary)`;

    case 'replies':
      return `Option 1: Friendly & Direct (Recommended)
"Hi there! Thanks for reaching out. I've taken a look and this looks great to proceed. Let's touch base on the final details next Tuesday."

Option 2: Ultra-Brief / Lazy
"Thanks! Looks good to me. Approved on my end."

Option 3: Gentle Decline (Boundary Preserving)
"Hi! Thanks for thinking of me for this. My plate is fully committed to our immediate sprint deliverables right now, so I won't be able to join, but best of luck with the initiative!"`;

    case 'organizer':
      return `### Cleaned & Structured Notes

#### Summary & Primary Objective
Clarify goals for Q4 while reducing unnecessary meetings and optimizing asynchronous communication.

#### Key Decisions Made
- Transition status updates to written 2-line digests.
- Cap daily active priorities to a maximum of 3 items.

#### Action Items (Low Effort, High Leverage)
- [ ] Share meeting recap with stakeholder channel
- [ ] Archive inactive backlog items
- [ ] Set "Deep Work / Sloth Focus" calendar block for mornings`;

    case 'relax':
      return `The Cloud Forest at Twilight

Deep within the Costa Rican canopy, Barnaby the sloth reached slowly for a fragrant cecropia leaf. The tropical dusk settled like a heavy, warm moss blanket over the mountain ridge. Distant raindrops tapped a soft, rhythmic lullaby against the broad palm fronds.

Barnaby took a long, steady breath. Down below, the hurried creatures rushed about, chasing shadows and deadlines. But up here, bathed in starlight, there was no hurry. Everything that needed to happen would unfold in its own sweet time. 

Close your eyes, let your shoulders drop, and release today's tasks into the evening breeze. You've done enough. Rest now.`;

    default:
      return `LazyMate AI analyzed your prompt with Gemma open-weight heuristics.

Here is your streamlined, low-stress result:
• Priority 1: Focus solely on the single next actionable step.
• Priority 2: Automate or delegate repetitive communications.
• Priority 3: Take a slow, measured breath and let the rest wait.`;
  }
}

export async function generateContentWithGemma(
  prompt: string,
  systemInstruction: string,
  feature: string,
  settings: ModelSettings
): Promise<GenerationResult> {
  const startTime = Date.now();

  // If user explicitly toggled Demo Mode, use the Gemma simulated output directly
  if (settings.demoMode) {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate gentle processing
    return {
      text: generateDemoResponse(prompt, feature),
      providerUsed: 'demo',
      model: 'Gemma 2 (Demo Simulator)',
      latencyMs: Date.now() - startTime,
      isLocal: true,
    };
  }

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        feature,
        provider: settings.provider,
        localOllamaUrl: settings.localOllamaUrl,
        model: settings.selectedModel,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      // If server indicates no runner is available and demo can be used, notify or provide fallback
      if (res.status === 503 && errorData.canUseDemo) {
        return {
          text: generateDemoResponse(prompt, feature),
          providerUsed: 'heuristic',
          model: 'Gemma 2 Heuristic Preview (No Local Runner Connected)',
          latencyMs: Date.now() - startTime,
          isLocal: true,
          fallbackReason: 'Local Ollama not found & no cloud key. Generated using local browser heuristics.',
        };
      }
      throw new Error(errorData.error || `HTTP ${res.status}: Failed to generate text`);
    }

    const data = await res.json();
    return {
      text: data.text,
      providerUsed: data.providerUsed,
      model: data.model,
      latencyMs: data.latencyMs || Date.now() - startTime,
      isLocal: data.isLocal || false,
      fallbackReason: data.fallbackReason,
    };
  } catch (err: any) {
    console.warn('API call encountered an issue, falling back to heuristic preview:', err);
    // Graceful fallback so user never gets a broken screen
    return {
      text: generateDemoResponse(prompt, feature),
      providerUsed: 'heuristic',
      model: 'Gemma 2 Standby Heuristic',
      latencyMs: Date.now() - startTime,
      isLocal: true,
      fallbackReason: err.message || 'Network or server error encountered.',
    };
  }
}
