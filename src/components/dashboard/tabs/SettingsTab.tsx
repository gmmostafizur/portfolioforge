import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Mail,
  User as UserIcon,
  Trash2,
  Check,
  AlertTriangle,
  Download,
  Bell
} from 'lucide-react';
import { User, Portfolio } from '../../../types/portfolio';
import { StorageService } from '../../../services/storage';

interface SettingsTabProps {
  currentUser: User;
  portfolio: Portfolio;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentUser,
  portfolio,
  onUpdateUser,
  onLogout,
}) => {
  const [email, setEmail] = useState(currentUser.email);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [password, setPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      email: email.trim(),
      fullName: fullName.trim()
    };
    const users = StorageService.getUsers().map(u => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('pf_users_v2', JSON.stringify(users));
    StorageService.setCurrentUser(updatedUser);
    onUpdateUser(updatedUser);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolio, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentUser.username}_portfolio_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = () => {
    const users = StorageService.getUsers().filter(u => u.id !== currentUser.id);
    localStorage.setItem('pf_users_v2', JSON.stringify(users));
    StorageService.setCurrentUser(null);
    onLogout();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <span>Account Settings & Privacy</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your credentials, backup your portfolio data, and configure privacy controls.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      {/* Account Info Form */}
      <form onSubmit={handleSaveAccount} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Account Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username (Permanent)</label>
            <input
              type="text"
              disabled
              value={currentUser.username}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-500 cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">New Password (Optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep existing password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
        >
          Update Account
        </button>
      </form>

      {/* Export & Data Portability */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Data Portability & JSON Export</h3>
          <p className="text-xs text-slate-400">
            Download a full JSON backup of all your portfolio sections, projects, case studies, and settings.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportData}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export Portfolio JSON</span>
        </button>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="rounded-2xl border border-rose-900/40 bg-rose-950/10 p-6 space-y-3">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Danger Zone: Account Deletion</span>
        </h3>
        <p className="text-xs text-slate-400">
          Permanently delete your account, your published portfolio URL (/u/{currentUser.username}), and all stored messages. This action is irreversible.
        </p>

        {deleteConfirm ? (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleDeleteAccount}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-600/30"
            >
              Confirm & Delete Account Permanently
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-800/60 bg-rose-950/40 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/60"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete My Account</span>
          </button>
        )}
      </div>
    </div>
  );
};
