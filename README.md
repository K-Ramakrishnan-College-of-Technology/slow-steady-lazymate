# 🦥 LazyMate AI – Your Slow and Steady Productivity Assistant

> **Work slower. Think clearer. Do less repetitive work.**  
> Powered by Google Gemma open-weight AI models, local on-device inference via Ollama, and zero data persistence.

[![Gemma Open Weights](https://img.shields.io/badge/Model-Google%20Gemma%202-emerald.svg)](https://ai.google.dev/gemma)
[![Inference Runtime](https://img.shields.io/badge/Local%20Runtime-Ollama-blue.svg)](https://ollama.com)
[![Privacy Guarantee](https://img.shields.io/badge/Privacy-Zero%20Text%20Storage-green.svg)](#privacy--data-sovereignty)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest%202026-Slow%20%26%20Steady-orange.svg)](https://dev.to/challenges/hacktoberfest-week3-2026-10-19)

---

## 📖 Overview

Modern knowledge work is saturated with "productivity panic" — endless 800-word emails, runaway to-do lists, disorganized meeting scribbles, and constant context switching. 

**LazyMate AI** is designed around **Minimum Viable Effort (the 80/20 rule)**. Guided by our tranquil mascot, **Barnaby the Sloth**, LazyMate AI takes care of tedious busywork so you can preserve your energy, reduce cognitive overload, and enjoy real free time.

---

## ✨ Core Features

| Feature | Description | Lazy Payoff |
| :--- | :--- | :--- |
| **Smart Text Summarizer** | Condenses lengthy emails, articles, and whitepapers into an exact **two-line essential briefing** (Line 1: Core Reality, Line 2: Next Action/Impact). | Saves ~3.8 min per long document |
| **Lazy Task Planner** | Auto-prioritizes messy to-do dumps into *High-Impact / Minimal Drag*, *Low-Energy Sprints* (10 min over coffee), and *Safe to Postpone / Drop*. | Eliminates planning paralysis |
| **Quick Reply Generator** | Crafts 3 ready-to-send responses for messages across 5 distinct tones (*Ultra-Brief*, *Warm & Friendly*, *Polite Decline*, *Diplomatic*, *Sloth Chill*). | Saves ~3–5 min per tricky email |
| **Messy Notes Organizer** | Transforms raw stream-of-consciousness brainstorms into structured Markdown with Executive Summaries, Categorized Bullets, Decisions, and Checklists. | Instant order from chaos |
| **Relax & Decompress Mode** | Evening sleep story generator (cloud forests, mountain tea cabins), an interactive **2-minute sloth breathing pacer** (4s inhale / 4s hold / 6s exhale), and positive anti-hustle thoughts. | Lowers work-day cortisol |
| **Daily Sloth Score** | Transparent, audit-ready mathematical formula showing exact minutes and energy saved based on peer-reviewed reading and typing speed baselines. | 100% honest; zero fake scores |

---

## 🧮 The Daily Sloth Score Formula

LazyMate AI avoids arbitrary or hallucinated AI vanity scores. All metrics are calculated client-side using verifiable baselines:

$$\text{Time Saved} = \frac{\text{Words Summarized}}{220\,\text{WPM}} + \frac{\text{Words Drafted}}{40\,\text{WPM}} + (\text{Tasks Planned} \times 6\,\text{min}) + (\text{Notes Structured} \times 8\,\text{min})$$

- **Adult Reading Speed:** Standardized to **220 WPM**.
- **Typing & Editing Speed:** Standardized to **40 WPM**.
- **Cognitive Triage Overhead:** Estimated at **6 minutes per task batch** and **8 minutes per messy note**.

---

## 🔒 Privacy & Data Sovereignty

- **Zero-Storage Policy:** Inbound text is processed strictly in volatile RAM and is **never written to a database, stored on disk, or used for model training**.
- **100% Local Inference Support:** When paired with local Ollama, all inference runs on your own hardware without a single network packet leaving your computer.
- **Architectural Honesty:** We clearly distinguish between Local On-Device Mode, Cloud Proxy Acceleration, and Demo Simulation Mode.

---

## 🚀 Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Optional: [Ollama](https://ollama.com/) for 100% offline local inference

### 1. Clone & Install
```bash
git clone https://github.com/krithikgokuls02/lazymate-ai.git
cd lazymate-ai
npm install
```

### 2. Configure Environment (Optional for Cloud Acceleration)
```bash
cp .env.example .env
# Add GEMINI_API_KEY if using cloud fallback:
# GEMINI_API_KEY="your-api-key"
```
*(Note: LazyMate AI works completely out-of-the-box in **Demo Mode** or with **Local Ollama** without any API key!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🦙 Running Gemma Locally via Ollama (2 Minutes)

LazyMate AI is modular and connects directly to open-weight models running on your machine:

1. **Install Ollama:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```
2. **Pull & Run Gemma 2:**
   ```bash
   # Ultra-lightweight & fast (1.6GB VRAM, recommended for laptops)
   ollama run gemma2:2b

   # Or for balanced deep reasoning (5.4GB VRAM)
   ollama run gemma2:9b
   ```
3. **Start Ollama with Browser Access (CORS):**
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
4. In LazyMate AI, navigate to **Settings > Inference Provider** and select **Local Ollama**. Use the built-in **Test Ping** button to confirm connection!

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8, Lucide Icons, Motion
- **Styling:** Tailwind CSS v4 (Warm cream `#FBF9F5`, moss green, and bark brown palette)
- **Backend:** Node.js, Express, tsx
- **AI Runtimes:** Google Gemma 2 (2B, 9B, 27B) via Ollama REST API or `@google/genai`
- **Design Constitution:** Strict zero-pill typography, single-elevation depth, responsive top-bar contract, and accessible WCAG AA contrast

---

## 🤝 Open Innovation Showcase

Why do open-weight models like **Gemma** matter for personal productivity?
- **Model Choice:** Switch freely between 2B, 9B, or 27B checkpoints without rewriting code.
- **Self-Hosting Freedom:** Run on your MacBook, Linux homelab, or private air-gapped server.
- **No Vendor Lock-In:** No sudden pricing hikes, unexpected model deprecations, or rate limits.
- **Offline Resilience:** Your productivity tools work on an airplane, in a remote cabin, or during internet blackouts.

---

## 📜 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

---

*Built with slow, steady care for the [Hacktoberfest Open-Source AI Challenge Week 3](https://dev.to/challenges/hacktoberfest-week3-2026-10-19).*
