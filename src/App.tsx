import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { User, Portfolio } from './types/portfolio';
import { Navbar } from './components/navigation/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { PublicPortfolio } from './components/portfolio/PublicPortfolio';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DEMO_PORTFOLIOS } from './data/demoPortfolios';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    StorageService.getCurrentUser()
  );

  // App routing views: 'landing' | 'dashboard' | 'public-portfolio'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'public-portfolio'>('landing');
  const [activePublicUsername, setActivePublicUsername] = useState<string>('mostafizur');
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('overview');

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize view from URL if user arrived at /u/:username or /dashboard
  useEffect(() => {
    const handleUrlRoute = () => {
      const pathname = window.location.pathname;

      if (pathname.startsWith('/u/')) {
        const username = pathname.replace('/u/', '').split('/')[0];
        if (username) {
          setActivePublicUsername(username);
          setCurrentView('public-portfolio');
          StorageService.recordVisit(username);
          return;
        }
      } else if (pathname === '/dashboard') {
        const user = StorageService.getCurrentUser();
        if (user) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('landing');
          setAuthModalMode('login');
          setAuthModalOpen(true);
        }
        return;
      }

      // Default: landing
      setCurrentView('landing');
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Update browser URL without reloading page
  const updateUrl = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      // ignore in iframe environments
    }
  };

  const handleNavigate = (view: string, params?: { username?: string; tab?: string }) => {
    if (view === 'dashboard') {
      const user = StorageService.getCurrentUser();
      if (!user) {
        setAuthModalMode('login');
        setAuthModalOpen(true);
        return;
      }
      if (params?.tab) setActiveDashboardTab(params.tab);
      setCurrentView('dashboard');
      updateUrl('/dashboard');
    } else if (view === 'public-portfolio') {
      const userToView = params?.username || currentUser?.username || 'mostafizur';
      setActivePublicUsername(userToView);
      setCurrentView('public-portfolio');
      StorageService.recordVisit(userToView);
      updateUrl(`/u/${userToView}`);
    } else {
      setCurrentView('landing');
      updateUrl('/');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User, isNewRegistration?: boolean) => {
    setCurrentUser(user);
    if (isNewRegistration) {
      setShowOnboarding(true);
    } else {
      setCurrentView('dashboard');
      updateUrl('/dashboard');
    }
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView('landing');
    updateUrl('/');
  };

  const handleSwitchUser = (username: string) => {
    const res = StorageService.login(username);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setActivePublicUsername(username);
      if (currentView === 'public-portfolio') {
        updateUrl(`/u/${username}`);
      }
    }
  };

  const currentPortfolioToView: Portfolio | null =
    StorageService.getPortfolioByUsername(activePublicUsername) ||
    DEMO_PORTFOLIOS[activePublicUsername] ||
    DEMO_PORTFOLIOS.mostafizur;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* App Navbar (Hidden inside full Dashboard to avoid double headers) */}
      {currentView !== 'dashboard' && (
        <Navbar
          currentUser={currentUser}
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
        />
      )}

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onExploreExample={(username) => handleNavigate('public-portfolio', { username })}
            onSelectThemePreview={(themeId) => {
              if (currentUser) {
                handleNavigate('dashboard', { tab: 'themes' });
              } else {
                handleOpenAuth('register');
              }
            }}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardLayout
            currentUser={currentUser}
            initialTab={activeDashboardTab}
            onNavigatePublic={(username) => handleNavigate('public-portfolio', { username })}
            onLogout={handleLogout}
            onUpdateUser={(updated) => setCurrentUser(updated)}
          />
        )}

        {currentView === 'public-portfolio' && currentPortfolioToView && (
          <PublicPortfolio
            portfolio={currentPortfolioToView}
            isDashboardPreview={false}
            onBackToDashboard={() => handleNavigate('dashboard')}
          />
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* 8-Step Onboarding Wizard for new registrations */}
      {showOnboarding && currentUser && (
        <OnboardingWizard
          user={currentUser}
          portfolio={
            StorageService.getPortfolioByUsername(currentUser.username) ||
            StorageService.createInitialPortfolio(currentUser)
          }
          onComplete={(updatedPortfolio) => {
            setShowOnboarding(false);
            setCurrentView('dashboard');
            updateUrl('/dashboard');
          }}
          onSkip={() => {
            setShowOnboarding(false);
            setCurrentView('dashboard');
            updateUrl('/dashboard');
          }}
        />
      )}
    </div>
  );
}
