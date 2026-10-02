import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  DollarSign,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Portfolio, ServiceItem } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface ServicesTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [services, setServices] = useState<ServiceItem[]>([...portfolio.services]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSrv, setEditingSrv] = useState<ServiceItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('$3,500');
  const [ctaText, setCtaText] = useState('Inquire Now');
  const [featuresInput, setFeaturesInput] = useState('');

  const startCreate = () => {
    setName('');
    setDescription('');
    setStartingPrice('$2,500');
    setCtaText('Start a Project');
    setFeaturesInput('Architecture roadmap review\nFull-stack implementation\nDeployment & CI/CD setup\nPost-launch 30-day support');
    setEditingSrv(null);
    setIsCreating(true);
  };

  const startEdit = (srv: ServiceItem) => {
    setEditingSrv(srv);
    setName(srv.name);
    setDescription(srv.description);
    setStartingPrice(srv.startingPrice);
    setCtaText(srv.ctaText);
    setFeaturesInput(srv.features.join('\n'));
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const featureList = featuresInput
      .split('\n')
      .map(f => f.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    const srvData: ServiceItem = {
      id: editingSrv ? editingSrv.id : `srv-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon: 'sparkles',
      startingPrice: startingPrice.trim(),
      ctaText: ctaText.trim() || 'Inquire Now',
      features: featureList
    };

    let updated: ServiceItem[];
    if (editingSrv) {
      updated = services.map(s => s.id === editingSrv.id ? srvData : s);
    } else {
      updated = [...services, srvData];
    }

    setServices(updated);
    onUpdatePortfolio({ ...portfolio, services: updated });
    setIsCreating(false);
    setEditingSrv(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    onUpdatePortfolio({ ...portfolio, services: updated });
  };

  const handleAIGenerateService = async () => {
    if (!name.trim()) return;
    setIsGenerating(true);
    try {
      const res = await AIService.generateContent({
        tool: 'service',
        inputs: {
          serviceName: name,
          details: description || `Professional service for ${portfolio.profile.title}`
        }
      });
      if (res.text) {
        setDescription(res.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            <span>Services & Consulting Packages</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Offer client packages with clear pricing, deliverable checklists, and contact CTAs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {!isCreating && (
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service Offering</span>
            </button>
          )}
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading text-sm font-bold text-white">
              {editingSrv ? 'Edit Service Offering' : 'Create New Service Package'}
            </h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Service Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI System Architecture & LLM Pipelines"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Starting Price (or Custom)</label>
              <input
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g. $4,500 or Starting at $75/hr"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Book Advisory Session"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Service Description</label>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleAIGenerateService}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                <span>{isGenerating ? 'Generating...' : 'Enhance with AI'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Crisp overview of value provided, problems solved, and deliverables..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Deliverables & Feature Checklist (One per line)
            </label>
            <textarea
              rows={4}
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Initial technical constraints discovery&#10;Architecture blueprint documentation&#10;Sub-second streaming endpoints"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed font-mono text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
            >
              {editingSrv ? 'Save Package' : 'Add Service'}
            </button>
          </div>
        </form>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading text-xs font-bold text-indigo-400">
                  {srv.startingPrice}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(srv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-heading text-sm font-bold text-white mb-2">{srv.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.description}</p>

              {srv.features && srv.features.length > 0 && (
                <ul className="space-y-1.5 border-t border-slate-800 pt-3 text-[11px] text-slate-300">
                  {srv.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">CTA: "{srv.ctaText}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
