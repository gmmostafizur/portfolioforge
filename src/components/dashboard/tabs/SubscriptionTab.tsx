import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Check,
  ExternalLink
} from 'lucide-react';
import { User, SubscriptionPlan } from '../../../types/portfolio';
import { StorageService } from '../../../services/storage';

interface SubscriptionTabProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(currentUser.plan);
  const [upgradedAlert, setUpgradedAlert] = useState<string | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    const users = StorageService.getUsers();
    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, plan } : u);
    localStorage.setItem('pf_users_v2', JSON.stringify(updatedUsers));

    const updatedUser = { ...currentUser, plan };
    StorageService.setCurrentUser(updatedUser);
    setCurrentPlan(plan);
    onUpdateUser(updatedUser);

    setUpgradedAlert(`Successfully updated to ${plan.toUpperCase()} Plan!`);
    setTimeout(() => setUpgradedAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-400" />
            <span>Subscription & Plan Tiers</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your PortfolioForge AI subscription, usage quotas, and custom domain access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Plan:</span>
          <span className="rounded-lg bg-indigo-950 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-800/40 uppercase tracking-wider">
            {currentPlan}
          </span>
        </div>
      </div>

      {upgradedAlert && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          <span>{upgradedAlert}</span>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE */}
        <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
          currentPlan === 'free' ? 'border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/20' : 'border-slate-800 bg-slate-900/40'
        }`}>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400 mb-1">Starter</div>
            <div className="flex items-baseline gap-1 text-white">
              <span className="font-heading text-3xl font-extrabold">$0</span>
              <span className="text-xs text-slate-500">/ forever free</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 mb-6">Foundational features for simple personal portfolios.</p>

            <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>1 Published Portfolio</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Standard Domain (/u/username)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Basic Theme Library</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>10 Gemini AI Generations / mo</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('free')}
            disabled={currentPlan === 'free'}
            className={`mt-8 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
              currentPlan === 'free'
                ? 'bg-slate-800 text-slate-400 cursor-default'
                : 'border border-slate-700 hover:bg-slate-800 text-white'
            }`}
          >
            {currentPlan === 'free' ? 'Active Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* PRO */}
        <div className={`relative rounded-2xl border-2 p-6 flex flex-col justify-between transition-all ${
          currentPlan === 'pro'
            ? 'border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/30'
            : 'border-indigo-500/60 bg-slate-900/60'
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-0.5 text-[10px] font-bold uppercase text-white shadow">
            Popular
          </div>

          <div>
            <div className="text-xs font-semibold uppercase text-indigo-400 mb-1">Professional</div>
            <div className="flex items-baseline gap-1 text-white">
              <span className="font-heading text-3xl font-extrabold">$19</span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 mb-6">For engineers, designers, and growth consultants.</p>

            <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2 font-medium text-white">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Custom Domain Connection (A/CNAME)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>All 13+ Premium Themes & Customizer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>100 AI Generations / Month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Remove PortfolioForge Badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Full Visitor Telemetry Analytics</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('pro')}
            className={`mt-8 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
              currentPlan === 'pro'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md hover:from-indigo-600 hover:to-violet-700'
            }`}
          >
            {currentPlan === 'pro' ? 'Active Plan' : 'Upgrade to Pro ($19/mo)'}
          </button>
        </div>

        {/* PREMIUM */}
        <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
          currentPlan === 'premium' ? 'border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/20' : 'border-slate-800 bg-slate-900/40'
        }`}>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400 mb-1">Executive & Agency</div>
            <div className="flex items-baseline gap-1 text-white">
              <span className="font-heading text-3xl font-extrabold">$39</span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 mb-6">Unlimited AI power and agency features.</p>

            <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2 font-medium text-white">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Unlimited Gemini AI Generations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Multiple Portfolios & Custom CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Priority 24/7 Concierge Support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('premium')}
            className={`mt-8 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
              currentPlan === 'premium'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                : 'border border-slate-700 bg-slate-800 text-white hover:bg-slate-750'
            }`}
          >
            {currentPlan === 'premium' ? 'Active Plan' : 'Upgrade to Premium ($39/mo)'}
          </button>
        </div>
      </div>
    </div>
  );
};
