import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Eye,
  Rocket,
  Palette,
  Layers,
  FileText,
  TrendingUp,
  Users,
  Briefcase,
  Code2,
  ArrowRight
} from 'lucide-react';
import { Portfolio, User } from '../../../types/portfolio';
import { StorageService } from '../../../services/storage';

interface OverviewTabProps {
  portfolio: Portfolio;
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onPublish: () => void;
  onOpenPreview: () => void;
  onOpenAIBuilder: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  portfolio,
  currentUser,
  onNavigateTab,
  onPublish,
  onOpenPreview,
  onOpenAIBuilder,
}) => {
  const [copied, setCopied] = useState(false);
  const completeness = StorageService.calculateCompleteness(portfolio);
  const analytics = StorageService.getAnalytics(portfolio.username);
  const publicUrl = `https://portfolioforge.ai/u/${portfolio.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Public URL & Publish Status */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                portfolio.status === 'published'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                  : 'bg-amber-950 text-amber-400 border border-amber-800/40'
              }`}
            >
              {portfolio.status === 'published' ? '● Published & Live' : '● Draft Mode'}
            </span>
            <span className="text-xs text-slate-400">
              Theme: <span className="font-semibold text-white">{portfolio.themeSettings.name}</span>
            </span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
            {portfolio.profile.fullName}'s Portfolio
          </h2>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-1.5 text-xs text-indigo-400 font-mono">
              <span>{publicUrl}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Right CTA cluster */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={onOpenPreview}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-md"
          >
            <Eye className="h-4 w-4 text-indigo-400" />
            <span>Preview Website</span>
          </button>

          {portfolio.status === 'published' ? (
            <a
              href={`/u/${portfolio.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <span>Open Public Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <button
              onClick={onPublish}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 transition-all"
            >
              <Rocket className="h-4 w-4" />
              <span>Publish Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Score & AI Assistant Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Gauge Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Portfolio Completeness
              </span>
              <span className="font-heading text-lg font-bold text-indigo-400">
                {completeness.percentage}%
              </span>
            </div>

            {/* Visual Bar */}
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${completeness.percentage}%` }}
              />
            </div>

            {completeness.missing.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-300">
                  Recommended additions for 100%:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {completeness.missing.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Outstanding! Your portfolio is fully detailed and ready for clients.</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('profile')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Complete Missing Profile Fields</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* AI Portfolio Builder Callout */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-violet-950/30 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-heading text-xs font-bold uppercase tracking-wider">
                Automated AI Generator
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Build My Portfolio with AI
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have Gemini AI draft your headline, bio story, skills breakdown, project case studies, and services in 10 seconds.
            </p>
          </div>

          <div className="mt-6 pt-4">
            <button
              onClick={onOpenAIBuilder}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Portfolio Wizard</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Live Performance Metrics
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                <span>Page Views</span>
              </div>
              <div className="font-heading text-xl font-bold text-white">
                {analytics.pageViews}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span>Unique Visitors</span>
              </div>
              <div className="font-heading text-xl font-bold text-white">
                {analytics.uniqueVisitors}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Briefcase className="h-3.5 w-3.5 text-sky-400" />
                <span>Projects</span>
              </div>
              <div className="font-heading text-xl font-bold text-white">
                {portfolio.projects.length}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Code2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Skills</span>
              </div>
              <div className="font-heading text-xl font-bold text-white">
                {portfolio.skills.length}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-right">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            title: 'Manage Projects',
            desc: `${portfolio.projects.length} case studies loaded`,
            tab: 'projects',
            icon: Briefcase
          },
          {
            title: 'Theme Marketplace',
            desc: '13+ styles & colors',
            tab: 'themes',
            icon: Palette
          },
          {
            title: '17 AI Copy Tools',
            desc: 'Bios, headlines, case studies',
            tab: 'ai-tools',
            icon: Sparkles
          },
          {
            title: 'Drag & Drop Layout',
            desc: 'Reorder sections & projects',
            tab: 'sections',
            icon: Layers
          }
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={() => onNavigateTab(action.tab)}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950 border border-indigo-800/40 text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
              <action.icon className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-white">{action.title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{action.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
