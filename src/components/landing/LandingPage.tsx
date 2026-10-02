import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Palette,
  Bot,
  Zap,
  Shield,
  Layers,
  FileText,
  MessageSquare,
  Search,
  ExternalLink,
  ChevronDown,
  Layout,
  Code2,
  Smartphone,
  Eye,
  Rocket
} from 'lucide-react';
import { THEME_PRESETS } from '../../data/themes';
import { DEMO_PORTFOLIOS } from '../../data/demoPortfolios';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onExploreExample: (username: string) => void;
  onSelectThemePreview: (themeId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreExample,
  onSelectThemePreview,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [previewTab, setPreviewTab] = useState<'mostafizur' | 'sarah'>('mostafizur');

  const demoData = DEMO_PORTFOLIOS[previewTab];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/15 via-violet-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Anti-slop clean announcement kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs text-indigo-300 mb-8 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-medium">PortfolioForge AI 2.0</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">Gemini 3.8-Powered Generation</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Build Your Personal Portfolio Website{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            in Minutes
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Create, customize and publish a professional portfolio with AI-powered tools — no coding required.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 hover:scale-[1.03] transition-all animate-shimmer"
          >
            <Sparkles className="h-4 w-4 text-indigo-200 animate-spin-slow" />
            <span>Create My Portfolio</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onExploreExample('mostafizur')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-850 hover:text-white hover:scale-[1.02] transition-all backdrop-blur-sm"
          >
            <Eye className="h-4 w-4 text-indigo-400" />
            <span>Explore Examples</span>
          </button>
        </div>

        {/* Social Proof Line */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Unique Public URL (/u/yourname)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>100% Responsive Themes</span>
          </div>
        </div>

        {/* Interactive Hero Mockup View with Floating Animated Badges */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-900/60 p-2 sm:p-4 shadow-2xl backdrop-blur-xl group">
          {/* Floating animated badge 1: Top-Left */}
          <div className="absolute -top-5 -left-4 sm:-left-6 hidden sm:flex items-center gap-2 rounded-full border border-indigo-500/40 bg-slate-900/95 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-float z-10">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400">⚡ Instant Deployment</span>
          </div>

          {/* Floating animated badge 2: Top-Right */}
          <div className="absolute -top-5 -right-4 sm:-right-6 hidden sm:flex items-center gap-2 rounded-full border border-purple-500/40 bg-slate-900/95 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-float-reverse z-10">
            <span className="text-sm">🤖</span>
            <span className="text-purple-300">Gemini 3 AI Writer</span>
          </div>

          {/* Floating animated badge 3: Bottom-Left */}
          <div className="absolute -bottom-4 left-6 hidden sm:flex items-center gap-2 rounded-full border border-amber-500/40 bg-slate-900/95 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-bounce-subtle z-10">
            <span className="text-sm">🔥</span>
            <span className="text-amber-300">2,400+ Portfolios Live</span>
          </div>

          {/* Glowing ambient backdrop behind browser mockup */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          {/* Browser Mockup Chrome */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* URL bar */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-1 text-xs text-slate-300 font-mono">
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span>https://portfolioforge.ai/u/{previewTab}</span>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setPreviewTab('mostafizur')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  previewTab === 'mostafizur' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Developer
              </button>
              <button
                onClick={() => setPreviewTab('sarah')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  previewTab === 'sarah' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Designer
              </button>
            </div>
          </div>

          {/* Mini Portfolio Preview Canvas */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/90 p-6 sm:p-8 text-left overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-4">
                <img
                  src={demoData.profile.avatar}
                  alt={demoData.profile.fullName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg"
                />
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {demoData.profile.fullName}
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium">
                    {demoData.profile.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    📍 {demoData.profile.location} · <span className="text-emerald-400">● {demoData.profile.statusText}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onExploreExample(previewTab)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600/90 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md transition-colors"
              >
                <span>View Full Live Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bio snippet */}
            <div className="py-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {demoData.profile.shortBio}
              </p>
            </div>

            {/* Skills & Projects preview pills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Core Competencies
                </div>
                <div className="flex flex-wrap gap-2">
                  {demoData.skills.slice(0, 4).map((sk) => (
                    <div
                      key={sk.id}
                      className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {sk.name} <span className="text-indigo-400 text-[10px]">({sk.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Featured Project
                </div>
                <div className="text-xs font-bold text-white mb-1">
                  {demoData.projects[0]?.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {demoData.projects[0]?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/60 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Simple 3-Step Process
          </h2>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From Blank Canvas to Live URL in 5 Minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Create Your Account & Claim URL',
              desc: 'Choose your unique username (e.g. /u/john). Set up your profile and choose your profession.',
              icon: Globe
            },
            {
              step: '02',
              title: 'Let AI Draft or Customize Sections',
              desc: 'Use Gemini AI tools to craft high-impact bios, project case studies, and skills with tailored tones.',
              icon: Bot
            },
            {
              step: '03',
              title: 'Pick Theme & Publish Worldwide',
              desc: 'Select from 13+ distinct themes. Hit Publish and share your verified portfolio with clients and recruiters.',
              icon: Rocket
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 hover:border-indigo-500/40 transition-all group"
            >
              <div className="font-mono text-3xl font-bold text-slate-700 group-hover:text-indigo-400 transition-colors mb-4">
                {item.step}
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI FEATURES SHOWCASE */}
      <section id="ai-features" className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/30 text-xs text-indigo-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>17 Built-In AI Generation Tools</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Supercharge Your Portfolio with Gemini AI
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Never struggle with writer's block again. Generate captivating copy, rewrite bullet points with quantifiable impact, and generate complete case studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Bio & Headline Generator',
              desc: 'Creates magnetic 1-liners and executive bios with customizable tones from Professional to Creative.',
              icon: Sparkles
            },
            {
              title: 'AI Project Case Study Writer',
              desc: 'Translates technical commits and repositories into compelling problem-solution-result stories.',
              icon: FileText
            },
            {
              title: 'AI Resume Summary & Bullet Improver',
              desc: 'Infuses quantifiable metrics and powerful action verbs into your experience history.',
              icon: Zap
            },
            {
              title: 'AI Service Package Generator',
              desc: 'Structures consulting offerings with clear deliverables, feature checklists, and pricing.',
              icon: Layers
            },
            {
              title: 'AI SEO Title & Meta Generator',
              desc: 'Generates search-engine optimized tags and structured data to rank higher on Google search.',
              icon: Search
            },
            {
              title: 'One-Click AI Portfolio Builder',
              desc: 'Answer 5 quick questions and watch our Gemini pipeline generate a complete portfolio layout in 10 seconds.',
              icon: Bot
            }
          ].map((tool, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 hover:border-indigo-500/50 hover:bg-slate-850 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-800/50 text-indigo-400 mb-4">
                <tool.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-white mb-2">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* THEME SHOWCASE */}
      <section id="themes-showcase" className="py-20 border-t border-slate-900 bg-slate-950/60 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Theme Marketplace
            </h2>
            <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Distinctive Themes Designed for Taste
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Content is 100% decoupled from design. Switch styles anytime without losing a single character.
            </p>
          </div>
          <button
            onClick={() => onOpenAuth('register')}
            className="mt-4 md:mt-0 flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Explore all 13+ themes in Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {THEME_PRESETS.slice(0, 4).map((theme) => (
            <div
              key={theme.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl transition-all flex flex-col"
            >
              <div className={`h-36 w-full bg-gradient-to-br ${theme.previewGradient} p-4 flex flex-col justify-between`}>
                <span className="self-end rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                  {theme.badge}
                </span>
                <span className="font-heading font-bold text-sm text-white drop-shadow">
                  {theme.name}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5">
                    <span>{theme.category}</span>
                    <span className="text-slate-500 capitalize">{theme.fontFamily} font</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onSelectThemePreview(theme.id)}
                    className="text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    Preview Demo
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Use Theme
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO EXAMPLES */}
      <section className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="font-heading text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Real Public Websites
        </h2>
        <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Created with PortfolioForge AI
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          {/* Example 1: Mostafizur */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={DEMO_PORTFOLIOS.mostafizur.profile.avatar}
                  alt="Mostafizur Rahman"
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">Mostafizur Rahman</h4>
                  <p className="text-xs text-indigo-400">AI & Full-Stack Solutions Architect</p>
                  <p className="text-[11px] text-slate-500 font-mono">/u/mostafizur</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Features distributed microservices, LLM architecture case studies, downloadable executive CV, and working client inquiry booking.
              </p>
            </div>
            <button
              onClick={() => onExploreExample('mostafizur')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
            >
              <span>Explore Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Example 2: Sarah */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={DEMO_PORTFOLIOS.sarah.profile.avatar}
                  alt="Sarah Jenkins"
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">Sarah Jenkins</h4>
                  <p className="text-xs text-indigo-400">Principal Product & Interaction Designer</p>
                  <p className="text-[11px] text-slate-500 font-mono">/u/sarah</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Features Figma design tokens showcase, editorial typography, interactive testimonials, and UX design essays.
              </p>
            </div>
            <button
              onClick={() => onExploreExample('sarah')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
            >
              <span>Explore Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-20 border-t border-slate-900 bg-slate-950/60 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Transparent SaaS Pricing
          </h2>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Free. Upgrade As You Scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* FREE PLAN */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Starter
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="font-heading text-4xl font-extrabold">$0</span>
                <span className="text-xs text-slate-400">/ forever free</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 mb-6">
                Perfect for launching your first online portfolio.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>1 Published Portfolio</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Unique Subdomain (/u/username)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>5 Standard Themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>10 AI Copy Generations / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Basic Analytics & Contact Form</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-slate-750 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="relative rounded-2xl border-2 border-indigo-500 bg-slate-900 p-6 flex flex-col justify-between shadow-2xl shadow-indigo-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                Professional
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="font-heading text-4xl font-extrabold">$19</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 mb-6">
                For freelancers, senior engineers, and growth consultants.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">Custom Domain Support (e.g. john.com)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>All 13+ Premium Themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Remove PortfolioForge Badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>100 AI Generations / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Full Visitor Analytics & SEO Tools</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Executive & Agency
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="font-heading text-4xl font-extrabold">$39</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 mb-6">
                Unlimited capabilities for top-tier creators & agencies.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Unlimited Gemini AI Generations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Multiple Portfolios & Sub-pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Custom CSS & Code Injections</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Priority 24/7 Support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-slate-750 transition-colors"
            >
              Get Premium
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-white">
            Everything You Need to Know
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Can I connect my own custom domain (e.g. john.com)?',
              a: 'Yes! Pro and Premium plans allow you to point any custom domain to your portfolio via standard A and CNAME DNS records with automated SSL encryption.'
            },
            {
              q: 'Will changing my theme erase my projects or text?',
              a: 'Never. In PortfolioForge AI, your portfolio content is strictly separated from presentation themes. You can change themes, fonts, colors, and layout anytime without losing a single character.'
            },
            {
              q: 'How does the Gemini AI integration work?',
              a: 'Our server-side Gemini 3.8-Flash pipeline handles 17 distinct content tools — from generating punchy professional headlines and executive summaries to drafting full case study narratives based on your bullet points.'
            },
            {
              q: 'Where do contact inquiries go when visitors submit the form?',
              a: 'Inquiries are saved directly to your dashboard inbox with sender details, timestamp, and unread badges. You also receive an in-app alert immediately.'
            },
            {
              q: 'Can I download or export my resume/CV?',
              a: 'Yes, visitors can view and download your CV directly from your public website, and you can also print/download formatted PDF copies from your admin dashboard.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-20 border-t border-slate-900 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-violet-950/40 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Publish Your Professional Portfolio?
            </h2>
            <p className="mt-4 text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join architects, designers, marketers, and developers building their personal brand with PortfolioForge AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-indigo-500/30 hover:from-indigo-600 hover:to-violet-700 hover:scale-105 transition-all"
              >
                <span>Get Started Now — It's Free</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onExploreExample('mostafizur')}
                className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-750 hover:text-white transition-all"
              >
                View Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-heading font-bold text-slate-300">PortfolioForge AI</span>
            <span>— Create Your Professional Portfolio. Powered by AI.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onOpenAuth('login')} className="hover:text-slate-300">Sign In</button>
            <button onClick={() => onOpenAuth('register')} className="hover:text-slate-300">Register</button>
            <button onClick={() => onExploreExample('mostafizur')} className="hover:text-slate-300">Live Demo</button>
            <a href="#pricing" className="hover:text-slate-300">Pricing</a>
          </div>
        </div>
        <div className="mt-8 text-center sm:text-left text-[11px] text-slate-600">
          © {new Date().getFullYear()} PortfolioForge AI SaaS Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
