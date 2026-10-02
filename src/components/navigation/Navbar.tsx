import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Globe,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { User } from '../../types/portfolio';
import { DEMO_USERS } from '../../data/demoPortfolios';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string, params?: { username?: string; tab?: string }) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchUser: (username: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onSwitchUser,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20 ring-1 ring-white/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                PortfolioForge <span className="bg-gradient-to-r from-indigo-400 to-sky-300 bg-clip-text text-transparent font-extrabold text-xs px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Professional SaaS Portfolio Engine
              </span>
            </div>
          </button>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-white ${currentView === 'landing' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                onNavigate('dashboard', { tab: 'themes' });
              } else {
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('themes-showcase')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-white"
          >
            Themes
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                onNavigate('dashboard', { tab: 'ai-tools' });
              } else {
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('ai-features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-white flex items-center gap-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI Tools
          </button>
          <button
            onClick={() => onNavigate('public-portfolio', { username: 'mostafizur' })}
            className="transition-colors hover:text-white"
          >
            Live Examples
          </button>
          <button
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-white"
          >
            Pricing
          </button>
        </nav>

        {/* Right CTA / User controls */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher dropdown for evaluation */}
          <div className="relative">
            <button
              onClick={() => setDemoSwitcherOpen(!demoSwitcherOpen)}
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
              title="Test multi-user switching"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span>Demo Accounts</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {demoSwitcherOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 text-xs"
                onMouseLeave={() => setDemoSwitcherOpen(false)}
              >
                <div className="px-2 py-1.5 font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                  Switch Test Profile
                </div>
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSwitchUser(user.username);
                      setDemoSwitcherOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-800 ${
                      currentUser?.username === user.username ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/40' : 'text-slate-200'
                    }`}
                  >
                    <img src={user.avatar} alt={user.fullName} className="h-6 w-6 rounded-full object-cover" />
                    <div className="flex-1 truncate">
                      <div className="font-medium text-white truncate">{user.fullName}</div>
                      <div className="text-[10px] text-slate-400 truncate">@{user.username} · {user.profession}</div>
                    </div>
                  </button>
                ))}
                <div className="mt-1 border-t border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setDemoSwitcherOpen(false);
                      onOpenAuth('register');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-indigo-400 hover:bg-indigo-950/40"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Create Fresh User Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hidden sm:flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('public-portfolio', { username: currentUser.username })}
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:text-white transition-all"
                title="View your public live website"
              >
                <span>/u/{currentUser.username}</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </button>

              {/* User Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full p-1 ring-1 ring-slate-800 hover:ring-indigo-500 transition-all focus:outline-none"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 text-xs"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="border-b border-slate-800 px-3 py-2.5">
                      <p className="font-semibold text-white">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">@{currentUser.username}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="rounded bg-indigo-950/80 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300 uppercase tracking-wider border border-indigo-800/40">
                          {currentUser.plan} Plan
                        </span>
                        {currentUser.role === 'admin' && (
                          <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 uppercase tracking-wider border border-emerald-800/40">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('dashboard', { tab: 'overview' });
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800 text-left"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Admin Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('public-portfolio', { username: currentUser.username });
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800 text-left"
                      >
                        <Globe className="h-3.5 w-3.5 text-sky-400" />
                        <span>View Live Portfolio</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('dashboard', { tab: 'profile' });
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800 text-left"
                      >
                        <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>Edit Profile</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('dashboard', { tab: 'admin' });
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-emerald-300 hover:bg-emerald-950/40 text-left"
                        >
                          <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Platform Admin Panel</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-400 hover:bg-rose-950/30 text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/98 px-4 py-4 space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('landing');
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Home
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (currentUser) onNavigate('dashboard', { tab: 'themes' });
              else onNavigate('landing');
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Themes Marketplace
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (currentUser) onNavigate('dashboard', { tab: 'ai-tools' });
              else onNavigate('landing');
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            AI Copy & Builder Tools
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('public-portfolio', { username: 'mostafizur' });
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Live Examples (/u/mostafizur)
          </button>

          {currentUser ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 py-2 text-xs font-medium text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 rounded-lg border border-slate-700 py-2 text-xs font-semibold text-slate-200"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="flex-1 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
