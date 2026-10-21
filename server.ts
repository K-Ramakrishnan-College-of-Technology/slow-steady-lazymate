import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI SDK with required telemetry User-Agent
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  let ollamaStatus = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const check = await fetch('http://127.0.0.1:11434/api/tags', {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    ollamaStatus = check.ok;
  } catch {
    ollamaStatus = false;
  }

  res.json({
    status: 'ok',
    hasGeminiApiKey: Boolean(geminiApiKey),
    localOllamaReachable: ollamaStatus,
    activeRuntime: ollamaStatus ? 'Local Ollama (Gemma)' : (geminiApiKey ? 'Cloud Gemma / Gemini Runtime' : 'Demo / Standby'),
    privacyNotice: 'Zero-storage policy: Inbound texts are processed strictly in RAM and never stored or indexed.',
  });
});

// Test custom Ollama or local inference endpoint
app.post('/api/test-local-endpoint', async (req: Request, res: Response) => {
  const { url = 'http://127.0.0.1:11434' } = req.body;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const sanitizedUrl = url.replace(/\/+$/, '');
    const check = await fetch(`${sanitizedUrl}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!check.ok) {
      return res.status(400).json({
        success: false,
        error: `Host responded with status ${check.status} ${check.statusText}`,
      });
    }
    const data = await check.json();
    return res.json({
      success: true,
      models: data.models || [],
      message: 'Local runner verified successfully.',
    });
  } catch (err: any) {
    return res.status(502).json({
      success: false,
      error: `Could not connect to ${url}. Make sure Ollama or compatible server is running with OLLAMA_ORIGINS="*"`,
      details: err.message,
    });
  }
});

// Modular Text Generation API (Supports Ollama local Gemma, Cloud Gemma/Gemini, and Heuristic fallback)
app.post('/api/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const {
    prompt,
    systemInstruction = '',
    feature = 'general',
    provider = 'auto', // 'ollama' | 'cloud' | 'auto' | 'demo'
    localOllamaUrl = 'http://127.0.0.1:11434',
    model = 'gemma2:2b',
  } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt text cannot be empty.' });
  }

  // Helper: Try Ollama
  const tryOllama = async () => {
    const sanitizedUrl = localOllamaUrl.replace(/\/+$/, '');
    // Standard Gemma 2 chat formatting tokens
    const formattedPrompt = `<start_of_turn>user\n${systemInstruction ? `${systemInstruction}\n\n` : ''}${prompt}<end_of_turn>\n<start_of_turn>model\n`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const ollamaRes = await fetch(`${sanitizedUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'gemma2:2b',
        prompt: formattedPrompt,
        stream: false,
        options: {
          temperature: 0.7,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!ollamaRes.ok) {
      throw new Error(`Ollama returned status ${ollamaRes.status}: ${ollamaRes.statusText}`);
    }

    const data = await ollamaRes.json();
    return data.response as string;
  };

  // Helper: Try Cloud Gemini / Gemma
  const tryCloud = async () => {
    if (!aiClient) {
      throw new Error('Cloud API key is not configured in environment (GEMINI_API_KEY is missing).');
    }
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are LazyMate AI, an ultra-helpful, serene productivity assistant powered by Gemma open-weight architecture. Help users do less repetitive work, eliminate mental clutter, and organize their day with calm clarity.',
        temperature: 0.6,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received empty response from AI model.');
    }
    return text;
  };

  // Execution flow based on provider preference
  if (provider === 'ollama') {
    try {
      const resultText = await tryOllama();
      return res.json({
        text: resultText,
        providerUsed: 'ollama',
        model: model || 'gemma2:2b (local)',
        latencyMs: Date.now() - startTime,
        isLocal: true,
      });
    } catch (err: any) {
      return res.status(503).json({
        error: `Local Ollama inference failed: ${err.message}`,
        suggestion: 'Ensure Ollama is running (`ollama serve`), or switch provider to Cloud or Demo Mode in Settings.',
      });
    }
  }

  if (provider === 'cloud') {
    try {
      const resultText = await tryCloud();
      return res.json({
        text: resultText,
        providerUsed: 'cloud',
        model: 'Gemma 2 / Cloud Runtime (gemini-3.8-flash)',
        latencyMs: Date.now() - startTime,
        isLocal: false,
      });
    } catch (err: any) {
      return res.status(500).json({
        error: `Cloud model inference failed: ${err.message}`,
        suggestion: 'Verify GEMINI_API_KEY or use Local Ollama / Demo Mode.',
      });
    }
  }

  // Provider === 'auto' (Try local Ollama first, then cloud, else helpful fallback error)
  try {
    const resultText = await tryOllama();
    return res.json({
      text: resultText,
      providerUsed: 'ollama',
      model: `${model || 'gemma2:2b'} (local)`,
      latencyMs: Date.now() - startTime,
      isLocal: true,
    });
  } catch (_ollamaErr) {
    // If Ollama is unavailable, fallback to Cloud if key exists
    if (aiClient) {
      try {
        const cloudText = await tryCloud();
        return res.json({
          text: cloudText,
          providerUsed: 'cloud',
          model: 'Gemma 2 / Cloud Acceleration (gemini-3.8-flash)',
          latencyMs: Date.now() - startTime,
          isLocal: false,
          fallbackReason: 'Local Ollama was unreachable; gracefully routed to cloud runner.',
        });
      } catch (cloudErr: any) {
        return res.status(500).json({
          error: `Model request failed on both local and cloud runners: ${cloudErr.message}`,
        });
      }
    }

    // Neither is available: Return informative status for UI to prompt demo mode or local connection
    return res.status(503).json({
      error: 'No active local or cloud AI runner detected.',
      suggestion: 'Local Ollama was not detected on port 11434 and no GEMINI_API_KEY was provided. You can turn on Demo Mode to test the app interface immediately, or view the Setup Guide to connect your local Gemma model.',
      canUseDemo: true,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LazyMate AI server listening on http://0.0.0.0:${port} [${isDev ? 'development' : 'production'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
