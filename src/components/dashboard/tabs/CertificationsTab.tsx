import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Portfolio, CertificationItem, AchievementItem } from '../../../types/portfolio';

interface CertificationsTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const CertificationsTab: React.FC<CertificationsTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [certs, setCerts] = useState<CertificationItem[]>([...portfolio.certifications]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([...portfolio.achievements]);
  const [isSaved, setIsSaved] = useState(false);

  // New cert states
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('2024-05');
  const [certId, setCertId] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // New achievement states
  const [achTitle, setAchTitle] = useState('');
  const [achOrg, setAchOrg] = useState('');
  const [achYear, setAchYear] = useState('2025');
  const [achMetric, setAchMetric] = useState('');

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      issueDate: certDate.trim(),
      credentialId: certId.trim(),
      credentialUrl: certUrl.trim()
    };

    const updated = [...certs, newCert];
    setCerts(updated);
    setCertTitle('');
    setCertIssuer('');
    setCertId('');
    setCertUrl('');
    onUpdatePortfolio({ ...portfolio, certifications: updated });
    triggerSave();
  };

  const handleDeleteCert = (id: string) => {
    const updated = certs.filter(c => c.id !== id);
    setCerts(updated);
    onUpdatePortfolio({ ...portfolio, certifications: updated });
    triggerSave();
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim()) return;

    const newAch: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: achTitle.trim(),
      organization: achOrg.trim(),
      year: achYear.trim(),
      description: '',
      metric: achMetric.trim()
    };

    const updated = [...achievements, newAch];
    setAchievements(updated);
    setAchTitle('');
    setAchOrg('');
    setAchMetric('');
    onUpdatePortfolio({ ...portfolio, achievements: updated });
    triggerSave();
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = achievements.filter(a => a.id !== id);
    setAchievements(updated);
    onUpdatePortfolio({ ...portfolio, achievements: updated });
    triggerSave();
  };

  const triggerSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-400" />
            <span>Certifications, Achievements & Awards</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Display verified cloud/professional certifications, hackathon awards, and notable honors.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      {/* SECTION 1: CERTIFICATIONS */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
          <span>Professional Certifications</span>
        </h3>

        {/* Add Cert Form */}
        <form onSubmit={handleAddCert} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Certification Name *</label>
              <input
                type="text"
                required
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="e.g. Google Cloud Professional Architect"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Issuing Organization *</label>
              <input
                type="text"
                required
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="e.g. Google Cloud / AWS"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Issue Date</label>
              <input
                type="text"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                placeholder="YYYY-MM"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Credential ID (Optional)</label>
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. GCP-98241"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add Certification</span>
          </button>
        </form>

        {/* Certs List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certs.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-white">{c.title}</h4>
                <p className="text-[11px] text-indigo-400">{c.issuer} · {c.issueDate}</p>
                {c.credentialId && (
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {c.credentialId}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteCert(c.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: ACHIEVEMENTS & AWARDS */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <span>Honors, Hackathons & Key Achievements</span>
        </h3>

        {/* Add Achievement Form */}
        <form onSubmit={handleAddAchievement} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Achievement / Award Name *</label>
              <input
                type="text"
                required
                value={achTitle}
                onChange={(e) => setAchTitle(e.target.value)}
                placeholder="e.g. 1st Place - Global Cloud Hackathon"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Organization / Event</label>
              <input
                type="text"
                value={achOrg}
                onChange={(e) => setAchOrg(e.target.value)}
                placeholder="e.g. TechSummit 2025"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Metric or Badge (e.g. 1st out of 600)</label>
              <input
                type="text"
                value={achMetric}
                onChange={(e) => setAchMetric(e.target.value)}
                placeholder="e.g. 1st Place out of 620 Teams"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add Achievement</span>
          </button>
        </form>

        {/* Achievements List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-white">{a.title}</h4>
                <p className="text-[11px] text-slate-400">{a.organization} · {a.year}</p>
                {a.metric && (
                  <p className="text-[10px] text-emerald-400 font-medium mt-0.5">{a.metric}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteAchievement(a.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
