import React, { useState } from 'react';
import {
  FileText,
  Download,
  Upload,
  Check,
  Eye,
  Printer,
  Sparkles
} from 'lucide-react';
import { Portfolio, ResumeData } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface ResumeTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const ResumeTab: React.FC<ResumeTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [resume, setResume] = useState<ResumeData>({ ...portfolio.resume });
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const handleToggleSection = (key: keyof ResumeData['includeSections']) => {
    const updated = {
      ...resume,
      includeSections: {
        ...resume.includeSections,
        [key]: !resume.includeSections[key]
      }
    };
    setResume(updated);
    onUpdatePortfolio({ ...portfolio, resume: updated });
    triggerSave();
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdatePortfolio({ ...portfolio, resume });
    triggerSave();
  };

  const triggerSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAIGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await AIService.generateContent({
        tool: 'resume_summary',
        inputs: {
          name: portfolio.profile.fullName,
          profession: portfolio.profile.title,
          details: portfolio.skills.map(s => s.name).join(', ')
        }
      });
      if (res.text) {
        setResume(prev => ({ ...prev, summary: res.text }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = {
        ...resume,
        fileName: file.name,
        pdfUrl: URL.createObjectURL(file)
      };
      setResume(updated);
      onUpdatePortfolio({ ...portfolio, resume: updated });
      triggerSave();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            <span>Resume & Curriculum Vitae (CV)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build a formatted CV directly on the platform, configure downloadable sections, or attach an existing PDF document.
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
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Summary with AI Generator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white">Executive Summary</label>
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleAIGenerateSummary}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={resume.summary}
          onChange={(e) => setResume({ ...resume, summary: e.target.value })}
          placeholder="High-density executive summary highlighting career milestones, leadership scope, and core competencies..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
        />
        <button
          type="button"
          onClick={() => handleSave()}
          className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Save Summary
        </button>
      </div>

      {/* Settings & Attached File */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Toggle sections in generated CV */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-xs font-bold text-white mb-2">Sections Included in CV Export</h3>
          <div className="space-y-2 text-xs text-slate-300">
            {[
              { id: 'experience', label: 'Work Experience History' },
              { id: 'education', label: 'Academic Degrees & Education' },
              { id: 'skills', label: 'Core Competencies & Skills' },
              { id: 'certifications', label: 'Verified Certifications' },
              { id: 'projects', label: 'Showcase Projects' }
            ].map((item) => (
              <label key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={(resume.includeSections as any)[item.id]}
                  onChange={() => handleToggleSection(item.id as any)}
                  className="rounded accent-indigo-600 h-4 w-4"
                />
              </label>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>Show Public Download Button on Portfolio</span>
              <input
                type="checkbox"
                checked={resume.showPublicDownload}
                onChange={(e) => {
                  const updated = { ...resume, showPublicDownload: e.target.checked };
                  setResume(updated);
                  onUpdatePortfolio({ ...portfolio, resume: updated });
                }}
                className="rounded accent-indigo-600 h-4 w-4"
              />
            </label>
          </div>
        </div>

        {/* Upload Custom PDF */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-1">Attach Custom PDF Document</h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Visitors will download this exact file when clicking "Download CV" on your site.
            </p>

            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
              <FileText className="mx-auto h-8 w-8 text-indigo-400 mb-2" />
              {resume.fileName ? (
                <div>
                  <div className="text-xs font-bold text-white truncate">{resume.fileName}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Attached & ready for download</div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">No PDF attached yet (using auto-generated CV)</div>
              )}

              <label className="mt-4 inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload PDF / DOCX</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {resume.pdfUrl && resume.pdfUrl !== '#' && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Current file active</span>
              <a href={resume.pdfUrl} download={resume.fileName || 'resume.pdf'} className="text-indigo-400 hover:underline flex items-center gap-1">
                <Download className="h-3 w-3" /> Test Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
