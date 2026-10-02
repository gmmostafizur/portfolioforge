import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Rocket,
  Check,
  Eye
} from 'lucide-react';
import { Portfolio } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface AIPortfolioBuilderModalProps {
  isOpen: boolean;
  portfolio: Portfolio;
  onClose: () => void;
  onApplyPortfolio: (updatedPortfolio: Portfolio) => void;
}

export const AIPortfolioBuilderModal: React.FC<AIPortfolioBuilderModalProps> = ({
  isOpen,
  portfolio,
  onClose,
  onApplyPortfolio,
}) => {
  const [name, setName] = useState(portfolio.profile.fullName);
  const [profession, setProfession] = useState(portfolio.profile.title);
  const [experienceYears, setExperienceYears] = useState(7);
  const [skills, setSkills] = useState('TypeScript, React, Cloud Systems, Distributed Architecture');
  const [background, setBackground] = useState(portfolio.profile.shortBio || '');
  const [targetClients, setTargetClients] = useState('High-growth venture-backed startups and enterprise scaleups');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const result = await AIService.generateFullPortfolio({
        name,
        profession,
        experienceYears,
        skills,
        background,
        targetClients
      });
      setGeneratedResult(result);
    } catch (err) {
      console.error('Error generating full portfolio:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generatedResult) return;
    const updated = { ...portfolio };

    updated.profile.fullName = name;
    updated.profile.title = profession;
    if (generatedResult.shortBio) updated.profile.shortBio = generatedResult.shortBio;
    if (generatedResult.longBio) updated.profile.longBio = generatedResult.longBio;
    if (generatedResult.statusText) updated.profile.statusText = generatedResult.statusText;

    if (generatedResult.skills && Array.isArray(generatedResult.skills)) {
      updated.skills = generatedResult.skills.map((s: any, idx: number) => ({
        id: `sk-ai-${idx}-${Date.now()}`,
        name: s.name,
        category: s.category || 'Development',
        percentage: s.percentage || 90,
        level: s.level || 'Expert',
        years: s.years || 4,
        icon: 'sparkles'
      }));
    }

    if (generatedResult.projects && Array.isArray(generatedResult.projects)) {
      updated.projects = generatedResult.projects.map((p: any, idx: number) => ({
        id: `proj-ai-${idx}-${Date.now()}`,
        title: p.title,
        description: p.description,
        image: idx === 0
          ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        gallery: [],
        category: p.category || 'Core Work',
        date: '2025-2026',
        technologies: p.technologies || ['TypeScript', 'Cloud'],
        results: p.results || ['Accelerated velocity by 35%'],
        isFeatured: true
      }));
    }

    if (generatedResult.services && Array.isArray(generatedResult.services)) {
      updated.services = generatedResult.services.map((srv: any, idx: number) => ({
        id: `srv-ai-${idx}-${Date.now()}`,
        name: srv.name,
        description: srv.description,
        icon: 'sparkles',
        startingPrice: srv.startingPrice || '$2,500',
        ctaText: srv.ctaText || 'Get In Touch',
        features: srv.features || ['Complete Deliverable']
      }));
    }

    if (generatedResult.experiences && Array.isArray(generatedResult.experiences)) {
      updated.experiences = generatedResult.experiences.map((exp: any, idx: number) => ({
        id: `exp-ai-${idx}-${Date.now()}`,
        company: exp.company || 'Enterprise Leader',
        position: exp.position || profession,
        employmentType: exp.employmentType || 'Full-time',
        location: exp.location || 'Remote',
        startDate: exp.startDate || '2023-01',
        endDate: exp.endDate || '',
        isCurrent: exp.isCurrent ?? true,
        description: exp.description || 'Leading key technical and strategic streams.',
        achievements: exp.achievements || ['Delivered critical milestone ahead of schedule']
      }));
    }

    if (generatedResult.seoTitle) updated.seo.title = generatedResult.seoTitle;
    if (generatedResult.seoDescription) updated.seo.description = generatedResult.seoDescription;

    onApplyPortfolio(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Build My Portfolio with AI
              </h3>
              <p className="text-[11px] text-slate-400">
                End-to-end synthesis powered by Gemini 3.8-Flash
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!generatedResult ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Years of Industry Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Clients / Recruiters
                  </label>
                  <input
                    type="text"
                    value={targetClients}
                    onChange={(e) => setTargetClients(e.target.value)}
                    placeholder="e.g. High-growth tech scaleups"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Skills & Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. TypeScript, React, Go, Microservices, Cloud Architecture"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Background Highlights & Career Philosophy
                </label>
                <textarea
                  rows={3}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Share any notable achievements, favorite domains, and what makes your work exceptional..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{isGenerating ? 'Synthesizing Full Portfolio with Gemini AI...' : 'Generate Complete Portfolio Package'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>AI Synthesis Complete! Review the generated components below before applying.</span>
              </div>

              {/* Review sections */}
              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    Hero Value Proposition
                  </div>
                  <h4 className="font-bold text-white text-sm">{generatedResult.headline}</h4>
                  <p className="text-slate-400 mt-1">{generatedResult.subheadline}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    About Story
                  </div>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">{generatedResult.longBio}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    Featured Projects Generated ({generatedResult.projects?.length || 0})
                  </div>
                  <div className="space-y-2 mt-2">
                    {generatedResult.projects?.map((p: any, idx: number) => (
                      <div key={idx} className="border-t border-slate-800/80 pt-2">
                        <div className="font-bold text-white">{p.title}</div>
                        <div className="text-slate-400 text-[11px]">{p.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {generatedResult && (
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
            <button
              onClick={() => setGeneratedResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Regenerate
            </button>

            <button
              onClick={handleApply}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30"
            >
              <Check className="h-4 w-4" />
              <span>Apply to My Portfolio Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
