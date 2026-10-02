import React, { useState } from 'react';
import {
  Search,
  Check,
  Sparkles,
  Globe,
  Share2,
  Code2,
  FileCode,
  Copy
} from 'lucide-react';
import { Portfolio, SEOSettings } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface SEOTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const SEOTab: React.FC<SEOTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [seo, setSeo] = useState<SEOSettings>({ ...portfolio.seo });
  const [keywordsInput, setKeywordsInput] = useState(portfolio.seo.keywords.join(', '));
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const kwArray = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);
    const updatedSeo = { ...seo, keywords: kwArray };
    setSeo(updatedSeo);
    onUpdatePortfolio({ ...portfolio, seo: updatedSeo });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAISeo = async () => {
    setIsGenerating(true);
    try {
      const titleRes = await AIService.generateContent({
        tool: 'seo_title',
        inputs: {
          name: portfolio.profile.fullName,
          profession: portfolio.profile.title,
          details: portfolio.profile.location
        }
      });
      const metaRes = await AIService.generateContent({
        tool: 'seo_meta',
        inputs: {
          name: portfolio.profile.fullName,
          profession: portfolio.profile.title,
          details: portfolio.profile.shortBio
        }
      });

      if (titleRes.text) {
        const cleanTitle = titleRes.text.split('\n')[0].replace(/^[-•*\d.]+\s*/, '');
        setSeo(prev => ({ ...prev, title: cleanTitle }));
      }
      if (metaRes.text) {
        const cleanMeta = metaRes.text.split('\n')[0].replace(/^[-•*\d.]+\s*/, '');
        setSeo(prev => ({ ...prev, description: cleanMeta }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": portfolio.profile.fullName,
    "jobTitle": portfolio.profile.title,
    "url": `https://portfolioforge.ai/u/${portfolio.username}`,
    "description": seo.description,
    "image": portfolio.profile.avatar,
    "sameAs": portfolio.socialLinks.map(s => s.url)
  };

  const copyJsonLd = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLd, null, 2));
    setCopiedJsonLd(true);
    setTimeout(() => setCopiedJsonLd(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-400" />
            <span>Search Engine Optimization (SEO) & Social Cards</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure Google search titles, OpenGraph social share previews, and Schema.org structured data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleAISeo}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isGenerating ? 'Optimizing...' : 'AI Auto-Generate SEO'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Meta Form */}
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="font-heading text-sm font-bold text-white mb-2">Meta Tags</h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">SEO Page Title</label>
              <span className={`text-[10px] font-mono ${seo.title.length > 60 ? 'text-amber-400' : 'text-slate-400'}`}>
                {seo.title.length} / 60 chars
              </span>
            </div>
            <input
              type="text"
              required
              value={seo.title}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Meta Description</label>
              <span className={`text-[10px] font-mono ${seo.description.length > 160 ? 'text-amber-400' : 'text-slate-400'}`}>
                {seo.description.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={seo.description}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Keywords (Comma-separated)</label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">OpenGraph Social Share Image URL</label>
            <input
              type="url"
              value={seo.ogImage}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
            >
              Save SEO Settings
            </button>
          </div>
        </form>

        {/* Live Search Engine & Social Card Previews */}
        <div className="space-y-4">
          {/* Google Search Result Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span>Google Search Result Snippet</span>
            </div>
            <div className="rounded-xl bg-white p-4 text-left shadow-sm">
              <div className="text-[11px] text-slate-600 truncate">https://portfolioforge.ai/u/{portfolio.username}</div>
              <div className="text-sm font-medium text-blue-700 hover:underline cursor-pointer truncate mt-0.5">
                {seo.title || `${portfolio.profile.fullName} | Portfolio`}
              </div>
              <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed">
                {seo.description || portfolio.profile.shortBio}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Social Share Card (LinkedIn & Twitter)</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
              <div className="h-28 bg-slate-900 overflow-hidden relative">
                <img
                  src={seo.ogImage || portfolio.profile.coverImage || portfolio.profile.avatar}
                  alt="OG"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-500 font-mono uppercase">portfolioforge.ai</div>
                <div className="text-xs font-bold text-white truncate mt-0.5">{seo.title}</div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{seo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Schema.org Structured Data */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <FileCode className="h-4 w-4 text-indigo-400" />
            <span>Structured Data (JSON-LD / Schema.org)</span>
          </div>
          <button
            onClick={copyJsonLd}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
          >
            {copiedJsonLd ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedJsonLd ? 'Copied' : 'Copy JSON-LD'}</span>
          </button>
        </div>
        <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-indigo-300 overflow-x-auto">
          {JSON.stringify(jsonLd, null, 2)}
        </pre>
      </div>
    </div>
  );
};
