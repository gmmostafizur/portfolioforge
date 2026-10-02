import React, { useState } from 'react';
import {
  Code2,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  Layers,
  Percent
} from 'lucide-react';
import { Portfolio, SkillItem } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface SkillsTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [skills, setSkills] = useState<SkillItem[]>([...portfolio.skills]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState<SkillItem['category']>('Development');
  const [newPercentage, setNewPercentage] = useState(90);
  const [newLevel, setNewLevel] = useState<SkillItem['level']>('Advanced');
  const [newYears, setNewYears] = useState(4);
  const [isSaved, setIsSaved] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const categories: SkillItem['category'][] = ['Development', 'Design', 'Marketing', 'Business', 'Writing', 'Other'];
  const levels: SkillItem['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newCategory,
      percentage: Number(newPercentage),
      level: newLevel,
      years: Number(newYears),
      icon: 'code'
    };

    const updated = [...skills, newSkill];
    setSkills(updated);
    setNewSkillName('');
    onUpdatePortfolio({ ...portfolio, skills: updated });
    triggerSave();
  };

  const handleDeleteSkill = (id: string) => {
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    onUpdatePortfolio({ ...portfolio, skills: updated });
    triggerSave();
  };

  const handleUpdateSkill = (id: string, partial: Partial<SkillItem>) => {
    const updated = skills.map(s => s.id === id ? { ...s, ...partial } : s);
    setSkills(updated);
    onUpdatePortfolio({ ...portfolio, skills: updated });
    triggerSave();
  };

  const triggerSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // AI Skill Suggestions
  const handleAISkillSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const res = await AIService.generateContent({
        tool: 'skill',
        inputs: {
          name: portfolio.profile.fullName,
          profession: portfolio.profile.title,
          details: skills.map(s => s.name).join(', ')
        }
      });
      // Add a couple suggested modern skills
      const defaultAdds = ['Cloud Architecture & Scaling', 'Distributed Microservices', 'Next.js & React 19'];
      const filtered = defaultAdds.filter(item => !skills.some(s => s.name.toLowerCase() === item.toLowerCase()));
      if (filtered.length > 0) {
        const addedItems: SkillItem[] = filtered.map((name, i) => ({
          id: `sk-sugg-${Date.now()}-${i}`,
          name,
          category: 'Development',
          percentage: 92,
          level: 'Expert',
          years: 5
        }));
        const updated = [...skills, ...addedItems];
        setSkills(updated);
        onUpdatePortfolio({ ...portfolio, skills: updated });
        triggerSave();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-400" />
            <span>Skills & Competencies</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Display your technical proficiencies, percentage mastery, and years of experience.
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
            disabled={isSuggesting}
            onClick={handleAISkillSuggestions}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isSuggesting ? 'Suggesting...' : 'AI Skill Recommendations'}</span>
          </button>
        </div>
      </div>

      {/* Add New Skill Form */}
      <form onSubmit={handleAddSkill} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="text-xs font-bold text-white">Add New Competency</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              required
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. TypeScript or UX Architecture"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as SkillItem['category'])}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Proficiency ({newPercentage}%)
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={newPercentage}
              onChange={(e) => setNewPercentage(Number(e.target.value))}
              className="w-full accent-indigo-500 mt-2"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Experience Level
            </label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as SkillItem['level'])}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </form>

      {/* Existing Skills List */}
      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 transition-all"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs font-bold text-white">{skill.name}</span>
                <span className="rounded bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-800/40">
                  {skill.category}
                </span>
                <span className="text-[11px] text-slate-400">{skill.level} · {skill.years} yrs</span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-indigo-400 w-9 text-right">
                  {skill.percentage}%
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                min="10"
                max="100"
                value={skill.percentage}
                onChange={(e) => handleUpdateSkill(skill.id, { percentage: Number(e.target.value) })}
                className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white text-center"
                title="Update percentage"
              />
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete skill"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
