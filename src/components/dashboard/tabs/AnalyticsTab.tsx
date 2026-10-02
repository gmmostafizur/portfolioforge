import React from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Globe,
  Smartphone,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { StorageService } from '../../../services/storage';

interface AnalyticsTabProps {
  username: string;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ username }) => {
  const analytics = StorageService.getAnalytics(username);

  const maxViews = Math.max(...analytics.viewsOverTime.map(v => v.views), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <span>Traffic & Visitor Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time insights on your portfolio visitors, device breakdown, and referral channels.
          </p>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span>Total Page Views</span>
            <Eye className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="font-heading text-2xl font-bold text-white">
            {analytics.pageViews}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span>Unique Visitors</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-heading text-2xl font-bold text-white">
            {analytics.uniqueVisitors}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+12.1% new reach</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span>Avg. Session Depth</span>
            <Layers className="h-4 w-4 text-sky-400" />
          </div>
          <div className="font-heading text-2xl font-bold text-white">
            3.8 Sections
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Projects & About are most visited
          </div>
        </div>
      </div>

      {/* Chart: Views Over Time */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-white">
            Daily Visitor Trends (Last 7 Days)
          </h3>
          <span className="text-[11px] text-slate-400">Aggregated views</span>
        </div>

        <div className="h-48 flex items-end gap-3 pt-6 pb-2">
          {analytics.viewsOverTime.map((item, idx) => {
            const heightPercent = Math.round((item.views / maxViews) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {item.views}
                </div>
                <div
                  className="w-full rounded-t-lg bg-indigo-600/70 group-hover:bg-indigo-500 transition-all"
                  style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                />
                <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Referral Channels */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h4 className="text-xs font-bold text-white">Top Traffic Referrers</h4>
          <div className="space-y-2.5 text-xs">
            {analytics.topReferrers.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-slate-300">{r.source}</span>
                <span className="font-mono text-slate-400 font-medium">{r.count} visits</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h4 className="text-xs font-bold text-white">Device Breakdown</h4>
          <div className="space-y-3 text-xs">
            {analytics.topDevices.map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{d.device}</span>
                  <span className="font-mono font-medium">{d.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sections */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h4 className="text-xs font-bold text-white">Most Viewed Sections</h4>
          <div className="space-y-2.5 text-xs">
            {analytics.topSections.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-slate-300">{s.section}</span>
                <span className="font-mono text-slate-400 font-medium">{s.views} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
