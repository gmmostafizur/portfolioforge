import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';
import { Portfolio, EducationItem } from '../../../types/portfolio';

interface EducationTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [educations, setEducations] = useState<EducationItem[]>([...portfolio.educations]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('Bachelor of Science');
  const [field, setField] = useState('Computer Science');
  const [startYear, setStartYear] = useState('2016');
  const [endYear, setEndYear] = useState('2020');
  const [grade, setGrade] = useState('First Class Honors');
  const [description, setDescription] = useState('');

  const startCreate = () => {
    setInstitution('');
    setDegree('Bachelor of Science');
    setField('Computer Science');
    setStartYear('2016');
    setEndYear('2020');
    setGrade('');
    setDescription('');
    setEditingEdu(null);
    setIsCreating(true);
  };

  const startEdit = (edu: EducationItem) => {
    setEditingEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setField(edu.field);
    setStartYear(edu.startYear);
    setEndYear(edu.endYear);
    setGrade(edu.grade || '');
    setDescription(edu.description);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) return;

    const eduData: EducationItem = {
      id: editingEdu ? editingEdu.id : `edu-${Date.now()}`,
      institution: institution.trim(),
      degree: degree.trim(),
      field: field.trim(),
      startYear: startYear.trim(),
      endYear: endYear.trim(),
      grade: grade.trim(),
      description: description.trim()
    };

    let updated: EducationItem[];
    if (editingEdu) {
      updated = educations.map(e => e.id === editingEdu.id ? eduData : e);
    } else {
      updated = [eduData, ...educations];
    }

    setEducations(updated);
    onUpdatePortfolio({ ...portfolio, educations: updated });
    setIsCreating(false);
    setEditingEdu(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = educations.filter(e => e.id !== id);
    setEducations(updated);
    onUpdatePortfolio({ ...portfolio, educations: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            <span>Education & Academic Credentials</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Highlight your degrees, institutions, GPA honors, and specialized academic studies.
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
              <span>Add Education</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Form */}
      {isCreating && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading text-sm font-bold text-white">
              {editingEdu ? 'Edit Degree' : 'Add Degree or Certificate'}
            </h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Institution / University *</label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. National University or MIT"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Degree *</label>
              <input
                type="text"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Bachelor of Science"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Field of Study</label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="e.g. Computer Science & Software Engineering"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Grade / Honors (Optional)</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. First Class Honors (3.9 GPA)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Start Year</label>
              <input
                type="text"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="YYYY (e.g. 2016)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">End Year (or Expected)</label>
              <input
                type="text"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                placeholder="YYYY (e.g. 2020)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description / Focus Areas</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specialized coursework, thesis topics, campus leadership..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
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
              {editingEdu ? 'Save Education' : 'Add Education'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white">{edu.institution}</h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {edu.startYear} — {edu.endYear}
                </span>
              </div>
              <p className="text-xs font-medium text-indigo-400">
                {edu.degree} in {edu.field}
              </p>
              {edu.grade && (
                <p className="text-[11px] text-emerald-400 mt-1">Honors: {edu.grade}</p>
              )}
              {edu.description && (
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{edu.description}</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-1">
              <button
                onClick={() => startEdit(edu)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Edit education"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                title="Delete education"
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
