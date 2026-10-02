import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  Calendar,
  Building
} from 'lucide-react';
import { Portfolio, ExperienceItem } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface ExperienceTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([...portfolio.experiences]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [employmentType, setEmploymentType] = useState<ExperienceItem['employmentType']>('Full-time');
  const [location, setLocation] = useState('Remote');
  const [startDate, setStartDate] = useState('2023-01');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(true);
  const [description, setDescription] = useState('');
  const [achievementsInput, setAchievementsInput] = useState('');

  const startCreate = () => {
    setCompany('');
    setPosition(portfolio.profile.title || 'Senior Engineer');
    setEmploymentType('Full-time');
    setLocation('San Francisco, CA');
    setStartDate('2023-01');
    setEndDate('');
    setIsCurrent(true);
    setDescription('');
    setAchievementsInput('Reduced P99 latency by 45%, Scaled system to 500K DAU');
    setEditingExp(null);
    setIsCreating(true);
  };

  const startEdit = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setCompany(exp.company);
    setPosition(exp.position);
    setEmploymentType(exp.employmentType);
    setLocation(exp.location);
    setStartDate(exp.startDate);
    setEndDate(exp.endDate);
    setIsCurrent(exp.isCurrent);
    setDescription(exp.description);
    setAchievementsInput(exp.achievements.join('\n'));
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    const achievementsArray = achievementsInput
      .split('\n')
      .map(a => a.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    const expData: ExperienceItem = {
      id: editingExp ? editingExp.id : `exp-${Date.now()}`,
      company: company.trim(),
      position: position.trim(),
      employmentType,
      location: location.trim(),
      startDate: startDate.trim(),
      endDate: isCurrent ? '' : endDate.trim(),
      isCurrent,
      description: description.trim(),
      achievements: achievementsArray
    };

    let updated: ExperienceItem[];
    if (editingExp) {
      updated = experiences.map(e => e.id === editingExp.id ? expData : e);
    } else {
      updated = [expData, ...experiences];
    }

    setExperiences(updated);
    onUpdatePortfolio({ ...portfolio, experiences: updated });
    setIsCreating(false);
    setEditingExp(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = experiences.filter(e => e.id !== id);
    setExperiences(updated);
    onUpdatePortfolio({ ...portfolio, experiences: updated });
  };

  // AI Experience Generator
  const handleAIGenerateExp = async () => {
    if (!position.trim()) return;
    setIsGenerating(true);
    try {
      const res = await AIService.generateContent({
        tool: 'experience',
        inputs: {
          role: position,
          company: company || 'Enterprise Team',
          details: description || 'Led key cloud architecture and modern full-stack development initiatives.'
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-400" />
            <span>Work Experience & Milestones</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Document your career history, companies, leadership responsibilities, and quantified achievements.
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
              <span>Add Position</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Form */}
      {isCreating && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading text-sm font-bold text-white">
              {editingExp ? 'Edit Position' : 'Add Work Milestone'}
            </h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe or Vanguard Labs"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Position / Role *</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Lead Architect"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Hybrid)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="YYYY-MM (e.g. 2022-03)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">End Date</label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span>Present Role</span>
                </label>
              </div>
              <input
                type="text"
                disabled={isCurrent}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="YYYY-MM (or leave blank if present)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none disabled:opacity-40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Role Overview</label>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleAIGenerateExp}
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
              placeholder="Describe your scope of authority, team leadership, and core technical contributions..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Bullet Achievements (One per line)
            </label>
            <textarea
              rows={4}
              value={achievementsInput}
              onChange={(e) => setAchievementsInput(e.target.value)}
              placeholder="Architected event-driven streaming pipeline, cutting latency by 48%&#10;Spearheaded zero-downtime database sharding migration across 14M rows"
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
              {editingExp ? 'Save Position' : 'Add Position'}
            </button>
          </div>
        </form>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{exp.position}</h3>
                  <p className="text-xs font-medium text-indigo-400">
                    {exp.company} · <span className="text-slate-400">{exp.location}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                  {exp.isCurrent && (
                    <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-800/40">
                      Current
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {exp.description}
              </p>

              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="space-y-1 text-xs text-slate-400 pl-4 list-disc marker:text-indigo-400">
                  {exp.achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end gap-1">
              <button
                onClick={() => startEdit(exp)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Edit position"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                title="Delete position"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
