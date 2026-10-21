import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Server,
  Sliders,
  Code2,
  HardDrive,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const WhyOpenAi: React.FC = () => {
  const comparisonData = [
    {
      feature: 'Data Ownership & Sovereignty',
      openGemma: 'Complete. Weights run on your hardware; zero outbound telemetry.',
      closedApi: 'Data traverses third-party servers; subject to terms of service & retention policies.',
    },
    {
      feature: 'Offline Operation Capability',
      openGemma: 'True offline execution when hosted locally via Ollama / llama.cpp.',
      closedApi: 'Impossible. Inoperative without constant active internet connection.',
    },
    {
      feature: 'Model Weights Accessibility',
      openGemma: 'Open weights released under permissive terms (Google Gemma license).',
      closedApi: 'Black box. Proprietary weights inaccessible to researchers or developers.',
    },
    {
      feature: 'Fine-Tuning & LoRA Customization',
      openGemma: 'Full control. Train custom LoRA adapters or quantized GGUF variants.',
      closedApi: 'Limited to restricted, vendor-controlled fine-tuning portals.',
    },
    {
      feature: 'Cost Structure',
      openGemma: 'Predictable fixed hardware amortized cost; $0 per token.',
      closedApi: 'Metered per-token pricing with recurring monthly invoices & rate limits.',
    },
    {
      feature: 'Vendor Lock-In Risk',
      openGemma: 'Zero lock-in. Compatible with standard open runtimes (vLLM, TGI, Ollama).',
      closedApi: 'High lock-in to proprietary SDKs, pricing shifts, and sudden deprecations.',
    },
  ];

  const pillars = [
    {
      title: '1. Model Choice & Portability',
      icon: <Sliders className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      desc: 'With open weights like Gemma 2B, 9B, and 27B, you are never held hostage by a single cloud provider. You can switch hardware, swap runtimes, or scale across edge devices and servers seamlessly.',
    },
    {
      title: '2. Self-Hosting Freedom',
      icon: <Server className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      desc: 'Deploy on your local MacBook, Linux homelab, private enterprise VPC, or air-gapped facility. You decide the RAM allocation, quantization level (Q4_K_M, Q8), and concurrency limits.',
    },
    {
      title: '3. Data Sovereignty & Confidentiality',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      desc: 'Confidential corporate strategy, medical summaries, personal finances, or private messages never leave your local physical boundary when deployed on-premise.',
    },
    {
      title: '4. The Privacy Reality Check',
      icon: <Info className="w-5 h-5 text-amber-700 dark:text-amber-400" />,
      desc: 'Actual privacy depends on your deployment architecture. Web browsers talking to remote cloud APIs still transmit data over the network. True zero-leakage privacy requires running Ollama locally on your machine.',
    },
    {
      title: '5. Experimentation & Research',
      icon: <Code2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      desc: 'Open weights allow researchers and builders to inspect attention layers, test mechanistic interpretability, evaluate safety guardrails, and train domain-specific fine-tunes without restrictions.',
    },
    {
      title: '6. Offline Edge Resilience',
      icon: <HardDrive className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      desc: 'Once weights are pulled locally, your assistant works on a cross-country flight, at a remote cabin, or during internet outages. You remain productive regardless of external network stability.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Why Open AI? The Gemma Open-Weight Revolution
          </h1>
          <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
            · Open Weights Showcase
          </span>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          How open models restore user autonomy, ensure data sovereignty, and challenge proprietary walled gardens.
        </p>
      </div>

      {/* Hero Quote Card */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>The Philosophy of Open Weights</span>
        </div>
        <blockquote className="font-display text-lg sm:text-xl font-medium text-stone-800 dark:text-stone-200 leading-relaxed">
          &ldquo;Artificial intelligence should not be an inaccessible black box controlled by three monopolistic APIs. Open-weight models empower individuals and organizations to own their intelligence, audit their tools, and run AI on their own terms.&rdquo;
        </blockquote>
        <div className="text-xs text-stone-500">
          — The Open AI & Decentralized Intelligence Movement
        </div>
      </div>

      {/* Six Pillars Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
          Six Core Advantages of Open-Weight Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-2.5"
            >
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 w-fit">
                {pillar.icon}
              </div>
              <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                {pillar.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive: The Privacy Reality Check Callout */}
      <div className="rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold text-sm">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Architectural Honesty: Where Does Your Data Actually Live?</span>
        </div>
        <div className="text-xs text-amber-900/80 dark:text-amber-200/80 space-y-2 leading-relaxed">
          <p>
            Many AI apps deceptively advertise &ldquo;100% Offline & Private AI&rdquo; while silently routing your confidential text to third-party cloud servers. At LazyMate AI, we uphold complete architectural transparency:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Local Mode (Ollama / Local Gemma):</strong> When you run Ollama on your machine (`localhost:11434`), your text stays 100% on your device. Zero internet packets leave your computer.
            </li>
            <li>
              <strong>Cloud Mode (Cloud Gemma Proxy):</strong> When local hardware is unavailable, the application can route through secure backend inference proxies. In this setup, data is transmitted over encrypted HTTPS, processed purely in memory, and immediately discarded with zero persistence.
            </li>
          </ul>
        </div>
      </div>

      {/* Detailed Comparison Matrix */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
            Open-Weight Models vs. Proprietary Cloud APIs
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare fundamental technical freedoms across deployment vectors.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 font-medium">
                <th className="py-2.5 pr-4 font-semibold text-stone-800 dark:text-stone-200 w-1/4">Criterion</th>
                <th className="py-2.5 px-4 font-semibold text-emerald-800 dark:text-emerald-400 w-3/8">Gemma Open Weights (LazyMate AI)</th>
                <th className="py-2.5 pl-4 font-semibold text-stone-600 dark:text-stone-400 w-3/8">Closed Proprietary APIs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="py-3 pr-4 font-medium text-stone-800 dark:text-stone-200 align-top">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-stone-700 dark:text-stone-300 align-top leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{row.openGemma}</span>
                    </div>
                  </td>
                  <td className="py-3 pl-4 text-stone-500 dark:text-stone-400 align-top leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{row.closedApi}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gemma Technical Family Specs */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4">
        <h2 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
          The Gemma Model Family Hierarchy
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-1.5">
            <div className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-400">Gemma 2B</div>
            <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">Ultra-Lightweight Edge</div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              Fits in ~1.5GB RAM. Perfect for real-time mobile, micro-laptops, and instant two-line summaries with minimal power consumption.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-1.5">
            <div className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-400">Gemma 9B (Recommended)</div>
            <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">Balanced Workhorse</div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              Superb reasoning and subtle nuance. Runs comfortably on modern laptops (M1/M2/M3 or 8GB VRAM) via 4-bit quantization.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-1.5">
            <div className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-400">Gemma 27B</div>
            <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">High-Precision Intelligence</div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              Competitive with much larger proprietary models. Ideal for workstation rigs and private enterprise server clusters.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
