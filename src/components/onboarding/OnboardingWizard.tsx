import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Layers,
  Palette,
  Eye,
  Rocket,
  User as UserIcon,
  Plus,
  Trash2
} from 'lucide-react';
import { Portfolio, User } from '../../types/portfolio';
import { THEME_PRESETS } from '../../data/themes';
import { AIService } from '../../services/ai';
import { StorageService } from '../../services/storage';

interface OnboardingWizardProps {
  user: User;
  portfolio: Portfolio;
  onComplete: (updatedPortfolio: Portfolio) => void;
  onSkip: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  user,
  portfolio,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(1);
  const [workingPortfolio, setWorkingPortfolio] = useState<Portfolio>(JSON.parse(JSON.stringify(portfolio)));
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState(workingPortfolio.themeId || THEME_PRESETS[0].id);

  // Form states
  const [fullName, setFullName] = useState(user.fullName);
  const [title, setTitle] = useState(user.profession);
  const [shortBio, setShortBio] = useState(workingPortfolio.profile.shortBio || '');
  const [location, setLocation] = useState(workingPortfolio.profile.location || 'San Francisco, CA');
  const [portfolioType, setPortfolioType] = useState('Full-Stack Engineering & Architecture');
  const [skillsList, setSkillsList] = useState<string[]>([
    'TypeScript', 'React', 'Cloud Architecture', 'System Design'
  ]);
  const [recentCompany, setRecentCompany] = useState('Tech Solutions Lab');
  const [recentRole, setRecentRole] = useState(user.profession);

  const totalSteps = 8;
  const progressPercent = Math.round((step / totalSteps) * 100);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skillsList.includes(skillInput.trim())) {
      setSkillsList([...skillsList, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter(s => s !== skill));
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    const theme = THEME_PRESETS.find(t => t.id === themeId);
    if (theme) {
      setWorkingPortfolio(prev => ({
        ...prev,
        themeId,
        themeSettings: { ...theme }
      }));
    }
  };

  // Step 7: Trigger AI Portfolio Generation
  const handleGeneratePortfolioWithAI = async () => {
    setIsGeneratingAI(true);
    try {
      const generated = await AIService.generateFullPortfolio({
        name: fullName,
        profession: title,
        experienceYears: 5,
        skills: skillsList.join(', '),
        background: shortBio,
        targetClients: 'High-growth startups, enterprise engineering teams'
      });

      if (generated) {
        setWorkingPortfolio(prev => {
          const updated = { ...prev };
          updated.profile.fullName = fullName;
          updated.profile.title = title;
          updated.profile.location = location;
          if (generated.shortBio) updated.profile.shortBio = generated.shortBio;
          if (generated.longBio) updated.profile.longBio = generated.longBio;
          if (generated.statusText) updated.profile.statusText = generated.statusText;

          if (generated.skills && Array.isArray(generated.skills)) {
            updated.skills = generated.skills.map((s: any, idx: number) => ({
              id: `sk-ai-${idx}`,
              name: s.name,
              category: s.category || 'Development',
              percentage: s.percentage || 90,
              level: s.level || 'Expert',
              years: s.years || 4,
              icon: 'sparkles'
            }));
          }

          if (generated.projects && Array.isArray(generated.projects)) {
            updated.projects = generated.projects.map((p: any, idx: number) => ({
              id: `proj-ai-${idx}`,
              title: p.title,
              description: p.description,
              image: idx === 0
                ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
                : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
              gallery: [],
              category: p.category || 'Featured Work',
              date: '2025-2026',
              technologies: p.technologies || ['Modern Stack'],
              results: p.results || ['Delivered on target'],
              isFeatured: true
            }));
          }

          if (generated.services && Array.isArray(generated.services)) {
            updated.services = generated.services.map((s: any, idx: number) => ({
              id: `srv-ai-${idx}`,
              name: s.name,
              description: s.description,
              icon: 'sparkles',
              startingPrice: s.startingPrice || '$2,500',
              ctaText: s.ctaText || 'Get in Touch',
              features: s.features || ['Complete Deliverable']
            }));
          }

          if (generated.experiences && Array.isArray(generated.experiences)) {
            updated.experiences = generated.experiences.map((e: any, idx: number) => ({
              id: `exp-ai-${idx}`,
              company: e.company || recentCompany,
              position: e.position || recentRole,
              employmentType: 'Full-time',
              location: e.location || 'Remote',
              startDate: '2023-01',
              endDate: '',
              isCurrent: true,
              description: e.description || 'Leading high-impact initiatives.',
              achievements: e.achievements || ['Boosted project velocity by 35%']
            }));
          }

          if (generated.seoTitle) updated.seo.title = generated.seoTitle;
          if (generated.seoDescription) updated.seo.description = generated.seoDescription;

          return updated;
        });
      }
    } catch (err) {
      console.error('Error generating AI portfolio in wizard:', err);
    } finally {
      setIsGeneratingAI(false);
      setStep(8);
    }
  };

  const handleFinish = (publishNow = false) => {
    const finalPortfolio = { ...workingPortfolio };
    finalPortfolio.profile.fullName = fullName;
    finalPortfolio.profile.title = title;
    finalPortfolio.profile.location = location;
    if (shortBio) finalPortfolio.profile.shortBio = shortBio;

    if (publishNow) {
      finalPortfolio.status = 'published';
      finalPortfolio.publishedAt = new Date().toISOString();
    }

    StorageService.savePortfolio(user.username, finalPortfolio);
    onComplete(finalPortfolio);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Progress bar top */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400">
              {step}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Step {step} of {totalSteps}
            </span>
          </div>
          <button
            onClick={onSkip}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Skip to Dashboard
          </button>
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* STEP 1: Tell us about yourself */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Step 1: Tell us about yourself
                </h3>
                <p className="text-xs text-slate-400">
                  Let's start with your foundational identity and where you are located.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Location / Timezone
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  One-Sentence Elevator Pitch / Bio
                </label>
                <textarea
                  rows={3}
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  placeholder="Briefly describe what you do best and the value you bring to teams."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Choose profession */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Step 2: Choose your professional title
                </h3>
                <p className="text-xs text-slate-400">
                  Select your primary domain so we can tailor themes, copy, and section layouts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  'Full-Stack Solutions Architect',
                  'Staff Product Designer',
                  'AI & Machine Learning Engineer',
                  'Growth & Digital Marketer',
                  'Creative Director & Brand Lead',
                  'Technical Consultant & Advisor',
                  'Freelance Web Developer',
                  'Student & Emerging Researcher'
                ].map((prof) => (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => setTitle(prof)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                      title === prof
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <Briefcase className={`h-4 w-4 shrink-0 ${title === prof ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium">{prof}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Custom Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Choose portfolio type */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Step 3: What is the primary purpose of your portfolio?
                </h3>
                <p className="text-xs text-slate-400">
                  This helps AI highlight either client services, employment history, or project case studies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'freelance',
                    title: 'Freelance & Consulting',
                    desc: 'Prioritizes service offerings, starting rates, client reviews, and direct inquiries.'
                  },
                  {
                    id: 'career',
                    title: 'Full-Time Job Search',
                    desc: 'Spotlights verifiable career milestones, downloadable resume CV, and project outcomes.'
                  },
                  {
                    id: 'creator',
                    title: 'Thought Leadership',
                    desc: 'Focuses on essays, open-source projects, achievements, and social media reach.'
                  }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPortfolioType(type.title)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      portfolioType === type.title
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 border border-indigo-800/50 mb-3 text-indigo-400">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="font-semibold text-xs text-white mb-1">{type.title}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Add skills */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Step 4: Add your core skills & competencies
                </h3>
                <p className="text-xs text-slate-400">
                  Add at least 3-4 skills. You can refine levels and percentages later in the dashboard.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Type a skill (e.g. Next.js, Figma, Cloud SQL)..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skillsList.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-xs text-slate-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-500">Quick add suggestions: </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['TypeScript', 'PostgreSQL', 'UI/UX Design', 'API Architecture', 'Kubernetes', 'Product Strategy', 'Growth Marketing'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        if (!skillsList.includes(s)) setSkillsList([...skillsList, s]);
                      }}
                      className="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Add experience */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Step 5: Tell us about your recent work experience
                </h3>
                <p className="text-xs text-slate-400">
                  Add your primary position. You can add unlimited previous roles and educations anytime.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company or Client Studio
                </label>
                <input
                  type="text"
                  value={recentCompany}
                  onChange={(e) => setRecentCompany(e.target.value)}
                  placeholder="e.g. Acme Tech or Independent Consultant"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Role / Position
                </label>
                <input
                  type="text"
                  value={recentRole}
                  onChange={(e) => setRecentRole(e.target.value)}
                  placeholder="e.g. Senior Software Architect"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Choose theme */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Step 6: Choose your starting theme
                </h3>
                <p className="text-xs text-slate-400">
                  Select a design personality. Remember: your content is 100% independent and can switch themes anytime without data loss!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTheme(t.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      selectedThemeId === t.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`h-12 w-full rounded-lg bg-gradient-to-r ${t.previewGradient} mb-2.5 flex items-center justify-center`}>
                      <span className="text-[10px] font-bold text-white/90 drop-shadow">{t.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{t.name}</span>
                      <span className="text-[9px] uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-1 rounded">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: AI generates initial portfolio */}
          {step === 7 && (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">
                <Sparkles className="h-7 w-7 text-white animate-pulse" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Step 7: Synthesize Portfolio with AI
              </h3>
              <p className="mx-auto max-w-md text-xs text-slate-400 leading-relaxed">
                Our Gemini AI engine will now generate an executive headline, compelling bio, project case studies, services, and SEO tags based on your inputs.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  disabled={isGeneratingAI}
                  onClick={handleGeneratePortfolioWithAI}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isGeneratingAI ? 'Generating with Gemini AI...' : 'Generate My AI Portfolio Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Preview & Publish */}
          {step === 8 && (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Step 8: Your portfolio is ready!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                AI has generated your initial portfolio structure, skills, and projects. You can publish right now or enter the dashboard to customize every detail.
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-left max-w-md mx-auto">
                <div className="text-[11px] text-slate-400 font-medium">Public URL:</div>
                <div className="text-xs font-mono font-bold text-indigo-400 truncate mt-0.5">
                  https://portfolioforge.ai/u/{user.username}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => handleFinish(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all"
                >
                  <Rocket className="h-4 w-4" />
                  <span>Publish Website Live</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFinish(false)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                  <span>Save as Draft & Enter Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {step < 8 && step !== 7 && (
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/40 px-6 py-4">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
