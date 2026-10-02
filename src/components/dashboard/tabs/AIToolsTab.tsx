import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Copy,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Send,
  Zap,
  Check,
  FileText,
  Search,
  BookOpen,
  Briefcase,
  Layers,
  Code2
} from 'lucide-react';
import { Portfolio } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface AIToolsTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
  onOpenFullBuilder: () => void;
}

interface ToolDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  inputPlaceholder: string;
  targetField: string;
}

export const AI_TOOLS: ToolDefinition[] = [
  { id: 'bio', name: 'AI Bio Generator', category: 'Profile', description: 'Creates magnetic 2-3 sentence elevator pitches for your hero and social profiles.', inputPlaceholder: 'Key skills, years of experience, core value proposition...', targetField: 'shortBio' },
  { id: 'about', name: 'AI About Me Generator', category: 'Profile', description: 'Generates structured 2-3 paragraph career journeys detailing philosophy and execution.', inputPlaceholder: 'How you started, technical philosophy, achievements, what drives your work...', targetField: 'longBio' },
  { id: 'headline', name: 'AI Professional Headline Generator', category: 'Profile', description: 'Generates 5 high-impact title variations tailored to your seniority and niche.', inputPlaceholder: 'Primary domain, specialization, notable past clients...', targetField: 'title' },
  { id: 'resume_summary', name: 'AI Resume Summary Generator', category: 'Resume', description: 'Crafts dense executive summaries for resume headers and recruiter scanning.', inputPlaceholder: 'Years in industry, core stack, leadership milestones...', targetField: 'resumeSummary' },
  { id: 'experience', name: 'AI Experience Description Generator', category: 'Career', description: 'Generates role overviews with quantifiable metric bullet points.', inputPlaceholder: 'Position, company name, primary initiatives shipped...', targetField: 'experience' },
  { id: 'project', name: 'AI Project Description Generator', category: 'Projects', description: 'Turns rough bullet points into polished problem-solution-impact narratives.', inputPlaceholder: 'Project name, tech stack, challenge solved, measurable results...', targetField: 'project' },
  { id: 'case_study', name: 'AI Project Case Study Generator', category: 'Projects', description: 'Generates an end-to-end case study: Context, Constraint, Approach, Outcome.', inputPlaceholder: 'Architecture challenge, scaling constraints, design tradeoffs...', targetField: 'caseStudy' },
  { id: 'service', name: 'AI Service Description Generator', category: 'Services', description: 'Drafts client service packages with deliverable checklists and value props.', inputPlaceholder: 'Service type, target client, key deliverables...', targetField: 'service' },
  { id: 'skill', name: 'AI Skill Description Generator', category: 'Skills', description: 'Explains your practical domain mastery and hands-on depth in any tool.', inputPlaceholder: 'Skill name (e.g. Distributed Consensus or Figma Design Tokens)...', targetField: 'skill' },
  { id: 'linkedin_bio', name: 'AI LinkedIn Bio Generator', category: 'Social', description: 'Crafts viral, engaging LinkedIn About sections with strong hook and CTA.', inputPlaceholder: 'Career journey, proudest moments, invitation to connect...', targetField: 'social' },
  { id: 'cover_letter', name: 'AI Cover Letter Generator', category: 'Career', description: 'Generates tailored, high-converting cover letters for target companies.', inputPlaceholder: 'Target role, target company, key alignment reasons...', targetField: 'coverLetter' },
  { id: 'content_improver', name: 'AI Portfolio Content Improver', category: 'Polishing', description: 'Eliminates passive voice, weak adverbs, and strengthens technical verbs.', inputPlaceholder: 'Paste any existing paragraph you want to elevate...', targetField: 'generic' },
  { id: 'grammar_fix', name: 'AI Grammar & Syntax Polish', category: 'Polishing', description: 'Corrects grammar, cadence, and syntax while preserving authentic voice.', inputPlaceholder: 'Paste draft text to proofread and correct...', targetField: 'generic' },
  { id: 'professional_rewriter', name: 'AI Professional Rewriter', category: 'Polishing', description: 'Elevates casual drafts into authoritative, executive-grade prose.', inputPlaceholder: 'Paste informal draft text...', targetField: 'generic' },
  { id: 'seo_title', name: 'AI SEO Title Generator', category: 'SEO', description: 'Generates 4 high-CTR title tags under 60 characters for search rankings.', inputPlaceholder: 'Full name, title, geographic or remote market...', targetField: 'seoTitle' },
  { id: 'seo_meta', name: 'AI Meta Description Generator', category: 'SEO', description: 'Creates search engine snippets (140-155 characters) that compel clicks.', inputPlaceholder: 'Key offerings, credentials, and call to action...', targetField: 'seoMeta' },
  { id: 'blog', name: 'AI Blog Essay Generator', category: 'Content', description: 'Generates complete technical articles with Markdown headers and takeaways.', inputPlaceholder: 'Topic or title, target audience, core points to argue...', targetField: 'blog' },
];

export const AIToolsTab: React.FC<AIToolsTabProps> = ({
  portfolio,
  onUpdatePortfolio,
  onOpenFullBuilder,
}) => {
  const [selectedToolId, setSelectedToolId] = useState<string>('bio');
  const [inputDetails, setInputDetails] = useState('');
  const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Creative' | 'Corporate' | 'Minimal'>('Professional');
  const [length, setLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);

  const activeTool = AI_TOOLS.find(t => t.id === selectedToolId) || AI_TOOLS[0];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setInserted(false);
    try {
      const res = await AIService.generateContent({
        tool: activeTool.id,
        inputs: {
          name: portfolio.profile.fullName,
          profession: portfolio.profile.title,
          details: inputDetails || `${portfolio.profile.title} with focus on modern systems.`
        },
        tone,
        length
      });
      setGeneratedText(res.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertIntoPortfolio = () => {
    if (!generatedText) return;
    const updated = { ...portfolio };

    if (activeTool.id === 'bio') {
      updated.profile.shortBio = generatedText;
    } else if (activeTool.id === 'about') {
      updated.profile.longBio = generatedText;
    } else if (activeTool.id === 'headline') {
      const firstLine = generatedText.split('\n')[0].replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
      if (firstLine) updated.profile.title = firstLine;
    } else if (activeTool.id === 'resume_summary') {
      updated.resume.summary = generatedText;
    } else if (activeTool.id === 'seo_title') {
      const firstOpt = generatedText.split('\n')[0].replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
      if (firstOpt) updated.seo.title = firstOpt;
    } else if (activeTool.id === 'seo_meta') {
      const firstOpt = generatedText.split('\n')[0].replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
      if (firstOpt) updated.seo.description = firstOpt;
    }

    onUpdatePortfolio(updated);
    setInserted(true);
    setTimeout(() => setInserted(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: One-Click AI Builder */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span className="font-heading text-xs font-bold uppercase tracking-wider">
              Flagship Assistant
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white">
            Build My Entire Portfolio with AI
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Answer 5 quick prompts to automatically generate your hero headline, about narrative, skill breakdowns, services, and project case studies.
          </p>
        </div>
        <button
          onClick={onOpenFullBuilder}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all shrink-0"
        >
          <Bot className="h-4 w-4" />
          <span>Launch AI Builder Wizard</span>
        </button>
      </div>

      {/* Main Tools Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of 17 AI Tools */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-1 max-h-[700px] overflow-y-auto">
          <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Select Tool ({AI_TOOLS.length})
          </div>
          {AI_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedToolId(tool.id);
                setGeneratedText('');
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                selectedToolId === tool.id
                  ? 'border border-indigo-500/80 bg-indigo-950/60 font-bold text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span className="truncate">{tool.name}</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-400 ml-2 shrink-0">
                {tool.category}
              </span>
            </button>
          ))}
        </div>

        {/* Right Column: Active Tool Workspace */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span>{activeTool.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeTool.description}
            </p>
          </div>

          {/* Tone & Length Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Tone of Voice
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(['Professional', 'Friendly', 'Creative', 'Corporate', 'Minimal'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-lg py-1.5 text-[10px] font-medium transition-all ${
                      tone === t
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Length
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Short', 'Medium', 'Long'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`rounded-lg py-1.5 text-[10px] font-medium transition-all ${
                      length === l
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
              Specific Context / Background Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={inputDetails}
              onChange={(e) => setInputDetails(e.target.value)}
              placeholder={activeTool.inputPlaceholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Generate Button */}
          <div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{isGenerating ? 'Synthesizing with Gemini 3.8...' : 'Generate with AI'}</span>
            </button>
          </div>

          {/* Output Area */}
          {generatedText && (
            <div className="rounded-xl border border-indigo-500/40 bg-slate-950 p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Generated AI Output</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleInsertIntoPortfolio}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500"
                  >
                    {inserted ? <Check className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                    <span>{inserted ? 'Inserted into Portfolio!' : 'Use This Content'}</span>
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed border-t border-slate-800 pt-3">
                {generatedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
