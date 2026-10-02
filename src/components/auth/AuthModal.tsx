import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Briefcase,
  AtSign,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Phone,
  MapPin,
  Globe,
  ShieldAlert
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { User } from '../../types/portfolio';
import { DEMO_USERS } from '../../data/demoPortfolios';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User, isNewRegistration?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  // Expanded registration fields requested by user:
  // Name, email address, phone number, address, tagline, username, country, password
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [tagline, setTagline] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [registerPassword, setRegisterPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const countries = [
    'Bangladesh',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'Singapore',
    'United Arab Emirates',
    'India',
    'Saudi Arabia',
    'Malaysia',
    'Japan',
    'Other'
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = StorageService.login(emailOrUsername, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      onSuccess(res.user, false);
      onClose();
    } else {
      setError(res.error || 'Failed to sign in. Please verify credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !registerEmail.trim() || !username.trim() || !registerPassword.trim()) {
      setError('Please fill in required fields: Full Name, Email, Username, and Password.');
      return;
    }

    setIsSubmitting(true);

    const res = StorageService.register({
      fullName,
      email: registerEmail,
      username,
      profession: tagline || 'Professional Specialist',
      tagline,
      phoneNumber,
      address,
      country,
      password: registerPassword
    });

    setIsSubmitting(false);

    if (res.success && res.user) {
      onSuccess(res.user, true);
      onClose();
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      setError('Please enter your account email.');
      return;
    }
    setError(null);
    setSuccessMsg(`Password reset instructions have been dispatched to ${emailOrUsername}.`);
    setTimeout(() => {
      setMode('login');
      setSuccessMsg(null);
    }, 2500);
  };

  const handleLoginAsSuperAdmin = () => {
    setEmailOrUsername('gmmostafizur331@gmail.com');
    setPassword('Allah2552@');
    const res = StorageService.login('gmmostafizur331@gmail.com', 'Allah2552@');
    if (res.success && res.user) {
      onSuccess(res.user, false);
      onClose();
    }
  };

  const handleDemoLogin = (demoUser: typeof DEMO_USERS[0]) => {
    const res = StorageService.login(demoUser.username, demoUser.password);
    if (res.success && res.user) {
      onSuccess(res.user, false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full ${mode === 'register' ? 'max-w-xl' : 'max-w-md'} rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 mb-3">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-white">
            {mode === 'login' && 'Welcome to PortfolioForge'}
            {mode === 'register' && 'Create Your Personal Portfolio Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {mode === 'login' && 'Sign in to access your dashboard, themes, and public website.'}
            {mode === 'register' && 'Provide your details to launch your AI-powered portfolio site.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Super Admin Quick Access Pill in Login mode */}
        {mode === 'login' && (
          <div className="mb-4 rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Super Admin Access</div>
                <div className="text-[10px] text-slate-400">gmmostafizur331@gmail.com</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLoginAsSuperAdmin}
              className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors shadow"
            >
              1-Click Super Admin Login
            </button>
          </div>
        )}

        {/* Alert Notification */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username or Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="gmmostafizur331@gmail.com or username"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Allah2552@"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Complete Registration Form with all 8 requested fields */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!username && e.target.value) {
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                      }
                    }}
                    placeholder="e.g. Mostafizur Rahman"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Unique Username *
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="mostafizur"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Your URL: /u/{username || 'username'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Professional Tagline / Headline
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. AI-Powered Full-Stack Architect & Cloud Consultant"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Address (City / Street)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Gulshan-2, Dhaka"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration & Start'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 pl-9 pr-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all"
            >
              <KeyRound className="h-4 w-4" />
              <span>Send Recovery Link</span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Demo Switcher */}
        {mode === 'login' && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-medium text-slate-400 text-center mb-2.5">
              Or test pre-seeded profiles:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleDemoLogin(user)}
                  className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950/40 p-2 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group"
                >
                  <img src={user.avatar} alt={user.fullName} className="h-7 w-7 rounded-full object-cover mb-1 group-hover:scale-105 transition-transform" />
                  <span className="text-[11px] font-medium text-slate-200 group-hover:text-indigo-300 truncate w-full text-center">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 truncate w-full text-center">
                    @{user.username}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer switcher */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setError(null);
                  setMode('register');
                }}
                className="font-medium text-indigo-400 hover:underline"
              >
                Register now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="font-medium text-indigo-400 hover:underline"
              >
                Sign in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
