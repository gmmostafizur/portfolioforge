import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  Check,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Instagram,
  Youtube
} from 'lucide-react';
import { Portfolio, SocialLink } from '../../../types/portfolio';

interface SocialLinksTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const SocialLinksTab: React.FC<SocialLinksTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [links, setLinks] = useState<SocialLink[]>([...portfolio.socialLinks]);
  const [platform, setPlatform] = useState<SocialLink['platform']>('github');
  const [url, setUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const availablePlatforms: { id: SocialLink['platform']; label: string }[] = [
    { id: 'github', label: 'GitHub' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'X (Twitter)' },
    { id: 'dribbble', label: 'Dribbble' },
    { id: 'behance', label: 'Behance' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'website', label: 'Personal Website' }
  ];

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const newLink: SocialLink = {
      platform,
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
    };

    const updated = [...links, newLink];
    setLinks(updated);
    setUrl('');
    onUpdatePortfolio({ ...portfolio, socialLinks: updated });
    triggerSave();
  };

  const handleDelete = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    onUpdatePortfolio({ ...portfolio, socialLinks: updated });
    triggerSave();
  };

  const triggerSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-400" />
            <span>Social Media & Public Profiles</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect your code repositories, design portfolios, professional networks, and direct messengers.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      {/* Add Link Form */}
      <form onSubmit={handleAddLink} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <h3 className="text-xs font-bold text-white">Add Social Channel</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {availablePlatforms.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Profile URL</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>Add Channel</span>
        </button>
      </form>

      {/* Current Links List */}
      <div className="space-y-2.5">
        {links.map((link, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-slate-800 text-indigo-400 uppercase font-mono text-[10px]">
                {link.platform}
              </span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-200 hover:text-white hover:underline truncate max-w-md font-mono"
              >
                {link.url}
              </a>
            </div>

            <button
              onClick={() => handleDelete(idx)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
