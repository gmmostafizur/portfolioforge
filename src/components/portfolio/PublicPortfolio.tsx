import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Download,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Star,
  BookOpen,
  Award,
  Layers,
  ArrowUp,
  X,
  Clock,
  Tag,
  ShieldCheck,
  Eye,
  Sun,
  Moon,
  Video,
  FileText,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portfolio, BlogPost, ProjectItem } from '../../types/portfolio';
import { StorageService } from '../../services/storage';

interface PublicPortfolioProps {
  portfolio: Portfolio;
  isDashboardPreview?: boolean;
  onBackToDashboard?: () => void;
}

export const PublicPortfolio: React.FC<PublicPortfolioProps> = ({
  portfolio,
  isDashboardPreview = false,
  onBackToDashboard,
}) => {
  const { profile, sections, skills, experiences, educations, projects, services, certifications, achievements, testimonials, resume, blogPosts, socialLinks, themeSettings } = portfolio;

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Modal states for Project Case Study & Blog Post Reader
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Active category filter for projects
  const [projectFilter, setProjectFilter] = useState('All');

  // Theme visual mapping & Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [reactionCount, setReactionCount] = useState(142);
  const [hasReacted, setHasReacted] = useState(false);

  const currentBg = isDarkMode ? (themeSettings.backgroundColor || '#020617') : '#f8fafc';
  const currentTextColor = isDarkMode ? (themeSettings.textColor || '#f8fafc') : '#0f172a';
  const currentCardBg = isDarkMode ? (themeSettings.cardBackground || '#0f172a') : '#ffffff';
  const currentBorderColor = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const currentSubtext = isDarkMode ? '#94a3b8' : '#64748b';

  const fontClass =
    themeSettings.fontFamily === 'serif'
      ? 'font-serif'
      : themeSettings.fontFamily === 'mono'
      ? 'font-mono'
      : themeSettings.fontFamily === 'heading'
      ? 'font-heading'
      : 'font-sans';

  const radiusClass =
    themeSettings.borderRadius === 'none'
      ? 'rounded-none'
      : themeSettings.borderRadius === 'sm'
      ? 'rounded-md'
      : themeSettings.borderRadius === 'md'
      ? 'rounded-xl'
      : themeSettings.borderRadius === 'xl'
      ? 'rounded-3xl'
      : 'rounded-2xl';

  const buttonRadius =
    themeSettings.borderRadius === 'none'
      ? 'rounded-none'
      : themeSettings.borderRadius === 'sm'
      ? 'rounded-md'
      : themeSettings.borderRadius === 'full'
      ? 'rounded-full'
      : 'rounded-xl';

  // Contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setIsSending(true);
    const sent = StorageService.sendContactMessage(portfolio.username, {
      name: contactName,
      email: contactEmail,
      subject: contactSubject || 'Portfolio Contact Inquiry',
      message: contactMessage
    });

    setIsSending(false);
    if (sent) {
      setContactSent(true);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setTimeout(() => setContactSent(false), 5000);
    }
  };

  // Section check helper
  const isSectionEnabled = (secId: string) => {
    const sec = sections.find(s => s.sectionId === secId);
    return sec ? sec.isEnabled : true;
  };

  const getSectionTitle = (secId: string, fallback: string) => {
    const sec = sections.find(s => s.sectionId === secId);
    return sec?.title || fallback;
  };

  // Project categories
  const projectCategories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
  const filteredProjects = projectFilter === 'All' ? projects : projects.filter(p => p.category === projectFilter);
  const sortedContentSections = [...sections].filter(s => s.sectionId !== 'hero' && s.isEnabled).sort((a, b) => a.order - b.order);

  return (
    <div
      className={`min-h-screen ${fontClass} transition-colors duration-200 selection:bg-indigo-500/20`}
      style={{
        backgroundColor: currentBg,
        color: currentTextColor,
      }}
    >
      {/* Dashboard Preview Banner if inside preview mode */}
      {isDashboardPreview && onBackToDashboard && (
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-indigo-500/30 bg-indigo-950/90 px-4 py-2.5 text-xs text-white backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">Live Preview Mode</span>
            <span className="text-indigo-300">({themeSettings.name} Theme)</span>
          </div>
          <button
            onClick={onBackToDashboard}
            className="rounded-lg bg-indigo-600 px-3 py-1 font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Floating Public Navigation Bar with Dark Mode Toggle & Quick Anchors */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: isDarkMode ? 'rgba(9, 13, 22, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: currentBorderColor,
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-heading font-bold text-sm">
            {profile.avatar && (
              <img src={profile.avatar} alt={profile.fullName} className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20" />
            )}
            <span className="truncate max-w-[150px] sm:max-w-none">{profile.fullName}</span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium" style={{ color: currentSubtext }}>
            {isSectionEnabled('about') && <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>}
            {isSectionEnabled('skills') && <a href="#skills" className="hover:text-indigo-400 transition-colors">Skills</a>}
            {isSectionEnabled('services') && <a href="#services" className="hover:text-indigo-400 transition-colors">Services</a>}
            {isSectionEnabled('projects') && <a href="#projects" className="hover:text-indigo-400 transition-colors">Projects</a>}
            {isSectionEnabled('experience') && <a href="#experience" className="hover:text-indigo-400 transition-colors">Experience</a>}
            {isSectionEnabled('blog') && <a href="#blog" className="hover:text-indigo-400 transition-colors">Blog</a>}
            {isSectionEnabled('contact') && <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>}
          </nav>

          {/* Right actions: Dark Mode + Emoji Clap + Get In Touch */}
          <div className="flex items-center gap-2.5">
            {/* Interactive Emoji Reaction Button with Confetti */}
            <button
              onClick={() => {
                setReactionCount(prev => prev + 1);
                setHasReacted(true);
                try {
                  confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.12 }
                  });
                } catch {}
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                hasReacted
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 scale-105 shadow-md shadow-indigo-500/20'
                  : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:scale-105'
              }`}
              title="Give an applause reaction!"
            >
              <span className="text-sm animate-bounce-subtle">✨</span>
              <span>{reactionCount}</span>
            </button>

            {/* Dark Mode / Light Mode Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:text-white transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>

            <a
              href="#contact"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all hover:scale-105 hidden sm:inline-block shadow-md shadow-indigo-600/30"
            >
              Hire Me
            </a>
          </div>
        </div>
      </header>

      {/* Cover Banner with Floating Ambient Light */}
      {profile.coverImage && (
        <div className="relative h-48 sm:h-64 lg:h-80 w-full overflow-hidden">
          <img
            src={profile.coverImage}
            alt="Cover"
            className="h-full w-full object-cover scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"
            style={{ backgroundColor: `${themeSettings.backgroundColor}80` }}
          />
          <div className="absolute top-1/4 left-1/3 h-48 w-48 rounded-full bg-indigo-500/30 blur-3xl animate-pulse-glow" />
        </div>
      )}

      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        {/* HERO SECTION WITH ANIMATIONS */}
        {isSectionEnabled('hero') && (
          <section className="relative -mt-16 sm:-mt-24 mb-16 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative group">
                  {/* Animated Glowing Aura behind profile photo */}
                  <div
                    className="absolute -inset-1.5 rounded-full blur-md opacity-75 animate-pulse-glow"
                    style={{ background: `radial-gradient(circle, ${themeSettings.primaryColor}, transparent)` }}
                  />

                  <img
                    src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={profile.fullName}
                    className={`relative h-28 w-28 sm:h-36 sm:w-36 object-cover shadow-2xl ring-4 ring-white/10 transition-transform duration-300 group-hover:scale-105 ${radiusClass}`}
                    style={{ borderColor: themeSettings.primaryColor }}
                  />

                  {/* Playful Floating Badge Emojis with Animations */}
                  <span className="absolute -top-3 -right-2 text-2xl select-none animate-float drop-shadow-md" title="High velocity builder">
                    🚀
                  </span>
                  <span className="absolute -bottom-2 -left-2 text-xl select-none animate-float-reverse drop-shadow-md" title="Lightning fast architecture">
                    ⚡
                  </span>
                  <span className="absolute top-1/2 -right-5 text-lg select-none animate-bounce-subtle drop-shadow-md" title="AI powered">
                    ✨
                  </span>

                  {profile.availability === 'available' && (
                    <span
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-slate-900 bg-emerald-500 animate-pulse"
                      title="Available for projects"
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-bounce-subtle">
                      <Sparkles className="h-3 w-3" />
                      <span>Verified Portfolio</span>
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    {profile.fullName}
                  </h1>
                  <p
                    className="text-sm sm:text-base font-medium mt-1"
                    style={{ color: themeSettings.primaryColor }}
                  >
                    {profile.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs mt-2 text-slate-400">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-rose-400" />
                        {profile.location}
                      </span>
                    )}
                    {profile.statusText && (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        {profile.statusText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons with Hover Animations */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30 ${buttonRadius}`}
                  style={{ backgroundColor: themeSettings.primaryColor }}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Get in Touch</span>
                </a>

                {resume?.showPublicDownload && (
                  <button
                    onClick={() => window.print()}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-white/15 hover:bg-white/10 hover:scale-105 transition-all ${buttonRadius}`}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CV</span>
                  </button>
                )}
              </div>
            </div>

            {/* Social links bar */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 pt-4 text-xs">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">Connect:</span>
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {s.platform === 'github' && <Github className="h-3.5 w-3.5" />}
                    {s.platform === 'linkedin' && <Linkedin className="h-3.5 w-3.5" />}
                    {s.platform === 'twitter' && <Twitter className="h-3.5 w-3.5" />}
                    {s.platform === 'website' && <ExternalLink className="h-3.5 w-3.5" />}
                    <span className="capitalize">{s.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* DYNAMIC CONTENT SECTIONS ORDERED BY DRAG-AND-DROP PREFERENCE */}
        {sortedContentSections.map((secConfig) => {
          if (secConfig.sectionId === 'about') {
            return (
              <section key={secConfig.id} id="about" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'About Me'}
                </h2>
                <div
                  className={`p-6 sm:p-8 border border-white/10 ${radiusClass}`}
                  style={{ backgroundColor: themeSettings.cardBackground }}
                >
                  {profile.shortBio && (
                    <p className="text-sm sm:text-base font-medium leading-relaxed mb-4" style={{ color: themeSettings.textColor }}>
                      {profile.shortBio}
                    </p>
                  )}
                  {profile.longBio && (
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3 opacity-90">
                      {profile.longBio}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'skills' && skills && skills.length > 0) {
            return (
              <section key={secConfig.id} id="skills" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Core Competencies'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`p-4 border border-white/10 group hover:-translate-y-1 hover:border-white/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{skill.name}</span>
                        <span className="text-[11px] font-mono font-semibold" style={{ color: themeSettings.primaryColor }}>
                          {skill.percentage}%
                        </span>
                      </div>
                      {/* Animated Progress bar */}
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125"
                          style={{
                            width: `${skill.percentage}%`,
                            backgroundColor: themeSettings.primaryColor
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{skill.category}</span>
                        <span>{skill.level} · {skill.years} yrs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'services' && services && services.length > 0) {
            return (
              <section key={secConfig.id} id="services" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Services & Offerings'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      className={`p-6 border border-white/10 flex flex-col justify-between ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white"
                            style={{ backgroundColor: `${themeSettings.primaryColor}20` }}
                          >
                            <Sparkles className="h-4 w-4" style={{ color: themeSettings.primaryColor }} />
                          </div>
                          <span className="text-xs font-mono font-bold" style={{ color: themeSettings.primaryColor }}>
                            {srv.startingPrice}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white mb-2">{srv.name}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {srv.description}
                        </p>

                        {srv.features && srv.features.length > 0 && (
                          <ul className="space-y-2 mb-6 border-t border-white/5 pt-4 text-[11px] text-slate-300">
                            {srv.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <a
                        href="#contact"
                        className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors ${buttonRadius}`}
                      >
                        <span>{srv.ctaText || 'Inquire Now'}</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'projects' && projects && projects.length > 0) {
            return (
              <section key={secConfig.id} id="projects" className="mb-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {secConfig.title || 'Featured Projects'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Production architecture, software craft, and case studies</p>
                  </div>

                  {/* Filter Tabs */}
                  {projectCategories.length > 2 && (
                    <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                      {projectCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setProjectFilter(cat)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            projectFilter === cat ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`border border-white/10 overflow-hidden flex flex-col justify-between group hover:-translate-y-2 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div>
                        {proj.image && (
                          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {proj.isFeatured && (
                              <span
                                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-md animate-pulse-glow"
                                style={{ backgroundColor: themeSettings.primaryColor }}
                              >
                                Featured
                              </span>
                            )}
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              {proj.emoji && (
                                <span className="text-base inline-block group-hover:scale-125 group-hover:rotate-6 transition-transform duration-200">
                                  {proj.emoji}
                                </span>
                              )}
                              <span>{proj.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {proj.badgeGif && (
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-sm"
                                  style={{ backgroundColor: `${themeSettings.primaryColor}80` }}
                                >
                                  {proj.badgeGif}
                                </span>
                              )}
                              <span>{proj.date}</span>
                            </div>
                          </div>
                          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                            <span>{proj.title}</span>
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                            {proj.description}
                          </p>

                          {/* Video and File Quick Indicators */}
                          {(proj.videoUrl || proj.fileUrl) && (
                            <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-white/5 text-[11px]">
                              {proj.videoUrl && (
                                <button
                                  onClick={() => setSelectedProject(proj)}
                                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40"
                                >
                                  <Video className="h-3 w-3" />
                                  <span>Video Demo</span>
                                </button>
                              )}
                              {proj.fileUrl && (
                                <a
                                  href={proj.fileUrl}
                                  download={proj.fileName || 'project-asset'}
                                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span>{proj.fileName || 'Download Asset'}</span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Tech stack */}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {proj.technologies.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Metrics results */}
                          {proj.results && proj.results.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 text-[10px] text-emerald-400">
                              {proj.results.map((res, i) => (
                                <span key={i} className="flex items-center gap-1 font-medium">
                                  ● {res}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Case Study</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
                              title="View Source Code"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <span>Live Site</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'experience' && experiences && experiences.length > 0) {
            return (
              <section key={secConfig.id} id="experience" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Work Experience'}
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-6 border border-white/10 ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">{exp.position}</h3>
                          <p className="text-xs font-medium" style={{ color: themeSettings.primaryColor }}>
                            {exp.company} · <span className="text-slate-400">{exp.location}</span>
                          </p>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {exp.description}
                      </p>

                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-1.5 text-xs text-slate-400 pl-4 list-disc marker:text-indigo-400">
                          {exp.achievements.map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'education' && educations && educations.length > 0) {
            return (
              <section key={secConfig.id} id="education" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Education & Academics'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {educations.map((edu) => (
                    <div
                      key={edu.id}
                      className={`p-5 border border-white/10 ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-bold text-white">{edu.institution}</h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          {edu.startYear} — {edu.endYear}
                        </span>
                      </div>
                      <p className="text-xs font-medium" style={{ color: themeSettings.primaryColor }}>
                        {edu.degree} in {edu.field}
                      </p>
                      {edu.grade && (
                        <p className="text-[11px] text-emerald-400 font-medium mt-1">Honors: {edu.grade}</p>
                      )}
                      {edu.description && (
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'certifications' && certifications && certifications.length > 0) {
            return (
              <section key={secConfig.id} id="certifications" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Certifications & Honors'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className={`p-4 border border-white/10 flex items-start gap-3 ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-indigo-400 shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-white truncate">{cert.title}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{cert.issuer} · Issued {cert.issueDate}</p>
                        {cert.credentialId && (
                          <p className="text-[10px] font-mono text-slate-500 mt-1">ID: {cert.credentialId}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'testimonials' && testimonials && testimonials.length > 0) {
            return (
              <section key={secConfig.id} id="testimonials" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Client Endorsements'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className={`p-6 border border-white/10 flex flex-col justify-between ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 mb-3">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed mb-4">
                          "{t.content}"
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                        {t.avatar && (
                          <img
                            src={t.avatar}
                            alt={t.clientName}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">{t.clientName}</div>
                          <div className="text-[10px] text-slate-400">{t.role} at {t.company}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'blog' && blogPosts && blogPosts.filter(b => b.isPublished).length > 0) {
            return (
              <section key={secConfig.id} id="blog" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Engineering & Design Insights'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blogPosts.filter(b => b.isPublished).map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`cursor-pointer p-5 border border-white/10 hover:border-white/30 transition-all ${radiusClass}`}
                      style={{ backgroundColor: themeSettings.cardBackground }}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span>{post.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readMinutes} min read
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {post.summary}
                      </p>
                      <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                        <span>Read Article</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'contact') {
            return (
              <section key={secConfig.id} id="contact" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Get In Touch'}
                </h2>
                <div
                  className={`p-6 sm:p-8 border border-white/10 ${radiusClass}`}
                  style={{ backgroundColor: themeSettings.cardBackground }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-base font-bold text-white mb-2">
                        Let's collaborate on your next milestone
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        Have an advisory inquiry, architectural challenge, or exciting project? Send a direct note through this verified form and I'll respond within 24 hours.
                      </p>

                      <div className="space-y-3 text-xs text-slate-300">
                        {profile.email && (
                          <div className="flex items-center gap-2.5">
                            <Mail className="h-4 w-4 text-indigo-400" />
                            <span>{profile.email}</span>
                          </div>
                        )}
                        {profile.phone && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="h-4 w-4 text-indigo-400" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile.location && (
                          <div className="flex items-center gap-2.5">
                            <MapPin className="h-4 w-4 text-indigo-400" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      {contactSent && (
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 p-3 text-xs text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>Thank you! Your message has been sent to the dashboard.</span>
                        </div>
                      )}

                      <div>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Your Email Address"
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="Subject (e.g. Consulting Inquiry)"
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <textarea
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="How can I help you achieve your goals?"
                          className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSending}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white shadow-md transition-all ${buttonRadius}`}
                        style={{ backgroundColor: themeSettings.primaryColor }}
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isSending ? 'Sending Inquiry...' : 'Send Message'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            );
          }

          if (secConfig.sectionId === 'custom' && secConfig.customContent) {
            return (
              <section key={secConfig.id} id="custom" className="mb-16">
                <h2 className="text-xl font-bold mb-4 tracking-tight">
                  {secConfig.title || 'Special Showcase'}
                </h2>
                <div
                  className={`p-6 sm:p-8 border border-white/10 ${radiusClass}`}
                  style={{ backgroundColor: themeSettings.cardBackground }}
                >
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {secConfig.customContent}
                  </p>
                </div>
              </section>
            );
          }

          return null;
        })}

        {/* FOOTER */}
        <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#about"
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3 w-3" />
            </a>
            <span>·</span>
            <span className="text-[11px] text-slate-600">
              Powered by PortfolioForge AI
            </span>
          </div>
        </footer>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className={`relative w-full max-w-2xl border border-white/15 p-6 sm:p-8 max-h-[85vh] overflow-y-auto ${radiusClass}`}
            style={{ backgroundColor: themeSettings.cardBackground, color: themeSettings.textColor }}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider mb-1">
              Case Study Showcase
            </div>
            <h2 className="text-xl font-bold mb-3">{selectedProject.title}</h2>

            {selectedProject.image && (
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-56 object-cover rounded-xl mb-4 border border-white/10"
              />
            )}

            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div>
                <h4 className="font-bold text-white mb-1">Project Overview</h4>
                <p>{selectedProject.description}</p>
              </div>

              {selectedProject.caseStudy && (
                <div>
                  <h4 className="font-bold text-white mb-1">Architectural Solution</h4>
                  <p>{selectedProject.caseStudy}</p>
                </div>
              )}

              {selectedProject.results && selectedProject.results.length > 0 && (
                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                  <h4 className="font-bold text-emerald-400 mb-2">Quantified Business Impact</h4>
                  <ul className="space-y-1 pl-4 list-disc">
                    {selectedProject.results.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video Walkthrough or File Attachment if available */}
              {selectedProject.videoUrl && (
                <div className="rounded-xl bg-white/5 p-4 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Video className="h-4 w-4" />
                    <span>Video Walkthrough & Interactive Demo</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-black/40 p-3 rounded-lg">
                    <span className="text-xs text-slate-300 truncate font-mono">{selectedProject.videoUrl}</span>
                    <a
                      href={selectedProject.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Watch Video</span>
                    </a>
                  </div>
                </div>
              )}

              {selectedProject.fileUrl && (
                <div className="rounded-xl bg-white/5 p-4 border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-950 text-sky-400 border border-sky-800/40">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Project Attachment & Specs</div>
                      <div className="text-[11px] text-slate-400">{selectedProject.fileName || 'architecture_specs.pdf'}</div>
                    </div>
                  </div>
                  <a
                    href={selectedProject.fileUrl}
                    download={selectedProject.fileName || 'project_document'}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download File</span>
                  </a>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 font-semibold text-white text-xs hover:bg-indigo-500"
                  >
                    <span>View Production Website</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-xs text-white hover:bg-white/10"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div
            className={`relative w-full max-w-2xl border border-white/15 p-6 sm:p-8 max-h-[85vh] overflow-y-auto ${radiusClass}`}
            style={{ backgroundColor: themeSettings.cardBackground, color: themeSettings.textColor }}
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span>{selectedPost.category}</span>
              <span>·</span>
              <span>{selectedPost.readMinutes} min read</span>
              <span>·</span>
              <span>{selectedPost.publishedAt}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-4">{selectedPost.title}</h2>

            {selectedPost.coverImage && (
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-56 object-cover rounded-xl mb-6 border border-white/10"
              />
            )}

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
              {selectedPost.content}
            </div>

            {selectedPost.tags && (
              <div className="flex flex-wrap gap-1.5 pt-6 border-t border-white/10 mt-6">
                {selectedPost.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Interactive Emoji & Celebration Dock */}
      <aside aria-label="Reaction bar" className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
        <span className="text-[11px] font-bold text-slate-400 pl-2 pr-1 hidden sm:inline">React:</span>
        {[
          { emoji: '🔥', label: 'Fire' },
          { emoji: '👏', label: 'Clap' },
          { emoji: '🚀', label: 'Rocket' },
          { emoji: '❤️', label: 'Love' },
          { emoji: '✨', label: 'Sparkle' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (rect.left + rect.width / 2) / window.innerWidth;
              const y = (rect.top + rect.height / 2) / window.innerHeight;
              try {
                confetti({
                  particleCount: 25,
                  spread: 50,
                  origin: { x, y }
                });
              } catch {}
              setReactionCount(prev => prev + 1);
            }}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-sm transition-transform hover:scale-130 active:scale-95"
            title={`Send ${item.label} reaction!`}
          >
            {item.emoji}
          </button>
        ))}
      </aside>
    </div>
  );
};
