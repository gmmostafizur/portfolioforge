import React, { useState } from 'react';
import {
  LayoutDashboard,
  User as UserIcon,
  Layers,
  Code2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  MessageSquare,
  FileText,
  BookOpen,
  Mail,
  Share2,
  Image as ImageIcon,
  Palette,
  Search,
  Globe,
  TrendingUp,
  Settings,
  CreditCard,
  ShieldAlert,
  ExternalLink,
  Eye,
  Rocket,
  Bell,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Bot
} from 'lucide-react';
import { Portfolio, User, NotificationItem } from '../../types/portfolio';
import { StorageService } from '../../services/storage';
import confetti from 'canvas-confetti';

// Tabs
import { OverviewTab } from './tabs/OverviewTab';
import { SectionsTab } from './tabs/SectionsTab';
import { ProfileTab } from './tabs/ProfileTab';
import { SkillsTab } from './tabs/SkillsTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { EducationTab } from './tabs/EducationTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { CertificationsTab } from './tabs/CertificationsTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { ResumeTab } from './tabs/ResumeTab';
import { BlogTab } from './tabs/BlogTab';
import { ContactMessagesTab } from './tabs/ContactMessagesTab';
import { SocialLinksTab } from './tabs/SocialLinksTab';
import { MediaLibraryTab } from './tabs/MediaLibraryTab';
import { ThemesTab } from './tabs/ThemesTab';
import { AIToolsTab } from './tabs/AIToolsTab';
import { SEOTab } from './tabs/SEOTab';
import { DomainTab } from './tabs/DomainTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SubscriptionTab } from './tabs/SubscriptionTab';
import { SettingsTab } from './tabs/SettingsTab';
import { AdminPanelTab } from './tabs/AdminPanelTab';
import { AIPortfolioBuilderModal } from './tabs/AIPortfolioBuilderModal';
import { PortfolioPreviewModal } from '../portfolio/PortfolioPreviewModal';
import { DragDropReorderModal } from './DragDropReorderModal';

interface DashboardLayoutProps {
  currentUser: User;
  initialTab?: string;
  onNavigatePublic: (username: string) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  initialTab = 'overview',
  onNavigatePublic,
  onLogout,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    const existing = StorageService.getPortfolioByUsername(currentUser.username);
    if (existing) return existing;
    return StorageService.createInitialPortfolio(currentUser);
  });

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications(currentUser.id)
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAIBuilderOpen, setIsAIBuilderOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderModalTab, setReorderModalTab] = useState<'sections' | 'projects'>('sections');
  const [publishSuccessBanner, setPublishSuccessBanner] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Update portfolio and save to storage
  const handleUpdatePortfolio = (updated: Portfolio) => {
    setPortfolio(updated);
    StorageService.savePortfolio(currentUser.username, updated);
  };

  // Publish / Unpublish actions
  const handlePublish = () => {
    const res = StorageService.publishPortfolio(currentUser.username);
    if (res.success) {
      setPortfolio(prev => ({ ...prev, status: 'published', publishedAt: new Date().toISOString() }));
      setPublishSuccessBanner(`Your portfolio is live at /u/${currentUser.username}`);
      setNotifications(StorageService.getNotifications(currentUser.id));
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.25 }
        });
      } catch {}
      setTimeout(() => setPublishSuccessBanner(null), 5000);
    }
  };

  const handleUnpublish = () => {
    StorageService.unpublishPortfolio(currentUser.username);
    setPortfolio(prev => ({ ...prev, status: 'unpublished' }));
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    StorageService.markNotificationRead(notif.id);
    setNotifications(StorageService.getNotifications(currentUser.id));
    if (notif.link?.includes('/u/')) {
      onNavigatePublic(currentUser.username);
    } else if (notif.link?.includes('contact')) {
      setActiveTab('contact');
    }
    setNotificationsOpen(false);
  };

  // Nav menu items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Bio', icon: UserIcon },
    { id: 'sections', label: 'Sections & Layout', icon: Layers, badge: 'DRAG' },
    { id: 'projects', label: 'Projects & Case Studies', icon: Briefcase },
    { id: 'skills', label: 'Core Skills', icon: Code2 },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'services', label: 'Services & Pricing', icon: Layers },
    { id: 'certifications', label: 'Certifications & Awards', icon: Award },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'resume', label: 'Resume / CV', icon: FileText },
    { id: 'blog', label: 'Blog Essays', icon: BookOpen },
    { id: 'contact', label: 'Inquiries Inbox', icon: Mail },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'themes', label: 'Themes & Styles', icon: Palette },
    { id: 'ai-tools', label: '17 AI Tools', icon: Sparkles, badge: 'AI' },
    { id: 'seo', label: 'SEO & Structured Data', icon: Search },
    { id: 'domain', label: 'Custom Domain', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'subscription', label: 'Subscription Plans', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (currentUser.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Console', icon: ShieldAlert, badge: 'PRO' });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        {/* User Mini Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 p-4">
          <img
            src={portfolio.profile.avatar || currentUser.avatar}
            alt={currentUser.fullName}
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{currentUser.fullName}</h4>
            <p className="text-[10px] text-slate-400 truncate">@{currentUser.username}</p>
          </div>
          <span className="rounded bg-indigo-950 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-400 border border-indigo-800/40">
            {currentUser.plan}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-950 text-indigo-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Public URL Box */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={() => onNavigatePublic(currentUser.username)}
            className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-slate-300 hover:border-indigo-500/50 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2 truncate">
              <Globe className="h-3.5 w-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              <span className="truncate font-mono text-[11px]">/u/{currentUser.username}</span>
            </div>
            <ExternalLink className="h-3 w-3 text-slate-500" />
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 max-w-[80vw] bg-slate-950 flex flex-col h-full border-r border-slate-800 z-10">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Dashboard Menu</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top App Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="font-heading text-sm font-bold text-white capitalize hidden sm:inline">
              {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50 text-xs"
                  onMouseLeave={() => setNotificationsOpen(false)}
                >
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800 mb-2">
                    <span className="font-bold text-white">Notifications</span>
                    <span className="text-[10px] text-indigo-400">{unreadNotifs} unread</span>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-xs">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`cursor-pointer rounded-xl p-2.5 transition-colors ${
                            n.read ? 'hover:bg-slate-800/60 opacity-70' : 'bg-indigo-950/40 border border-indigo-800/40'
                          }`}
                        >
                          <div className="font-bold text-white text-[11px] mb-0.5">{n.title}</div>
                          <div className="text-[11px] text-slate-300">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Drag & Drop Reorder Layout Button */}
            <button
              onClick={() => {
                setReorderModalTab('sections');
                setIsReorderModalOpen(true);
              }}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-colors"
              title="Drag & drop to reorder sections and projects"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>Reorder Studio</span>
            </button>

            {/* AI Assistant Quick Modal */}
            <button
              onClick={() => setIsAIBuilderOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 transition-colors"
            >
              <Bot className="h-3.5 w-3.5 text-indigo-400" />
              <span>AI Builder</span>
            </button>

            {/* Preview Button */}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Publish Toggle */}
            {portfolio.status === 'published' ? (
              <button
                onClick={() => onNavigatePublic(currentUser.username)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
                <span>Live</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>Publish</span>
              </button>
            )}
          </div>
        </header>

        {/* Live Published Alert Banner */}
        {publishSuccessBanner && (
          <div className="bg-emerald-950 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{publishSuccessBanner}</span>
            </div>
            <button
              onClick={() => onNavigatePublic(currentUser.username)}
              className="font-bold underline text-white hover:text-emerald-200 ml-4"
            >
              View Website Now
            </button>
          </div>
        )}

        {/* Active Tab Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {activeTab === 'overview' && (
              <OverviewTab
                portfolio={portfolio}
                currentUser={currentUser}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onPublish={handlePublish}
                onOpenPreview={() => setIsPreviewOpen(true)}
                onOpenAIBuilder={() => setIsAIBuilderOpen(true)}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'sections' && (
              <SectionsTab
                portfolio={portfolio}
                onUpdatePortfolio={handleUpdatePortfolio}
                onOpenPreview={() => setIsPreviewOpen(true)}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'skills' && (
              <SkillsTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'experience' && (
              <ExperienceTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'education' && (
              <EducationTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'services' && (
              <ServicesTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'certifications' && (
              <CertificationsTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'testimonials' && (
              <TestimonialsTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'resume' && (
              <ResumeTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'blog' && (
              <BlogTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'contact' && (
              <ContactMessagesTab username={currentUser.username} />
            )}
            {activeTab === 'social' && (
              <SocialLinksTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'media' && (
              <MediaLibraryTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'themes' && (
              <ThemesTab
                portfolio={portfolio}
                onUpdatePortfolio={handleUpdatePortfolio}
                onOpenPreview={() => setIsPreviewOpen(true)}
              />
            )}
            {activeTab === 'ai-tools' && (
              <AIToolsTab
                portfolio={portfolio}
                onUpdatePortfolio={handleUpdatePortfolio}
                onOpenFullBuilder={() => setIsAIBuilderOpen(true)}
              />
            )}
            {activeTab === 'seo' && (
              <SEOTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'domain' && (
              <DomainTab portfolio={portfolio} onUpdatePortfolio={handleUpdatePortfolio} />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsTab username={currentUser.username} />
            )}
            {activeTab === 'subscription' && (
              <SubscriptionTab currentUser={currentUser} onUpdateUser={onUpdateUser} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab
                currentUser={currentUser}
                portfolio={portfolio}
                onUpdateUser={onUpdateUser}
                onLogout={onLogout}
              />
            )}
            {activeTab === 'admin' && <AdminPanelTab />}
          </div>
        </main>
      </div>

      {/* Live Preview Modal */}
      <PortfolioPreviewModal
        isOpen={isPreviewOpen}
        portfolio={portfolio}
        onClose={() => setIsPreviewOpen(false)}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      {/* AI Portfolio Builder Wizard Modal */}
      <AIPortfolioBuilderModal
        isOpen={isAIBuilderOpen}
        portfolio={portfolio}
        onClose={() => setIsAIBuilderOpen(false)}
        onApplyPortfolio={handleUpdatePortfolio}
      />

      {/* Drag & Drop Reorder Studio Modal */}
      <DragDropReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        portfolio={portfolio}
        onUpdatePortfolio={handleUpdatePortfolio}
        onOpenPreview={() => setIsPreviewOpen(true)}
        initialTab={reorderModalTab}
      />
    </div>
  );
};
