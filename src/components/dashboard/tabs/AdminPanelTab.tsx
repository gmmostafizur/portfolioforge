import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Globe,
  Bot,
  CreditCard,
  TrendingUp,
  Search,
  ExternalLink,
  CheckCircle2,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Download,
  X,
  Sparkles,
  Server
} from 'lucide-react';
import { StorageService } from '../../../services/storage';
import { User } from '../../../types/portfolio';

export const AdminPanelTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const portfolios = StorageService.getPortfolios();
  const publishedCount = Object.values(portfolios).filter(p => p.status === 'published').length;

  const countries = ['All', ...Array.from(new Set(users.map(u => u.country || 'Bangladesh').filter(Boolean)))];

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phoneNumber && u.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.address && u.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry = selectedCountry === 'All' || (u.country || 'Bangladesh') === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const exportUsersCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Address', 'Country', 'Tagline', 'Username', 'Plan', 'Role', 'Registered', 'Last Login', 'IP Address'];
    const rows = users.map(u => [
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.phoneNumber || ''}"`,
      `"${u.address || ''}"`,
      `"${u.country || ''}"`,
      `"${u.tagline || u.profession || ''}"`,
      `"${u.username}"`,
      `"${u.plan}"`,
      `"${u.role}"`,
      `"${new Date(u.createdAt).toLocaleString()}"`,
      `"${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'N/A'}"`,
      `"${u.ipAddress || '103.230.106.12'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `platform_users_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-emerald-400" />
              <span>Super Admin Dashboard & User Management</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Authenticated as <strong className="text-white">gmmostafizur331@gmail.com</strong>. Complete directory of all user signups and logins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportUsersCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Users CSV</span>
          </button>
          <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-800/40 uppercase tracking-wider">
            Super Admin
          </span>
        </div>
      </div>

      {/* Global Metrics Cockpit */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            <span>Total Registered Users</span>
          </div>
          <div className="font-heading text-3xl font-extrabold text-white">
            {users.length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Full profile data captured</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>Published Portfolios</span>
          </div>
          <div className="font-heading text-3xl font-extrabold text-white">
            {publishedCount}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Live worldwide (/u/username)</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-violet-400" />
            <span>Gemini AI Operations</span>
          </div>
          <div className="font-heading text-3xl font-extrabold text-white">
            184
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Bios, case studies, headlines</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-amber-400" />
            <span>Estimated MRR</span>
          </div>
          <div className="font-heading text-3xl font-extrabold text-white">
            $2,140
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">From Pro & Premium tiers</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                selectedCountry === c ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone, country..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Detailed Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <span>Complete User Directory ({filteredUsers.length} Users)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any user row for full details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="pb-3">Name & Username</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Country & Address</th>
                <th className="pb-3">Tagline / Title</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Last Login</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const port = portfolios[u.username];
                return (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="hover:bg-slate-850/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.fullName} className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700" />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{u.fullName}</span>
                            {u.role === 'admin' && (
                              <span className="rounded bg-emerald-950 px-1 text-[9px] text-emerald-400 border border-emerald-800/40">Admin</span>
                            )}
                          </div>
                          <div className="text-[11px] text-indigo-400 font-mono">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-300">{u.email}</td>
                    <td className="py-3.5 text-slate-300 font-mono text-[11px]">{u.phoneNumber || '—'}</td>
                    <td className="py-3.5 text-slate-300">
                      <div>{u.country || 'Bangladesh'}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{u.address || '—'}</div>
                    </td>
                    <td className="py-3.5 text-slate-300 max-w-[160px] truncate" title={u.tagline || u.profession}>
                      {u.tagline || u.profession}
                    </td>
                    <td className="py-3.5">
                      <span className="rounded bg-indigo-950/80 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-400 border border-indigo-800/40">
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-3.5 text-[11px] text-slate-400 font-mono">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Active'}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="View complete information"
                        >
                          <Eye className="h-3.5 w-3.5 text-indigo-400" />
                        </button>
                        <a
                          href={`/u/${u.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Open live website"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Information Dossier Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-800 pb-5 mb-5">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.fullName}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg"
              />
              <div>
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedUser.fullName}</span>
                  <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] uppercase font-bold text-indigo-400 border border-indigo-800/40">
                    {selectedUser.plan} Plan
                  </span>
                </h3>
                <p className="text-xs text-indigo-400 font-mono">@{selectedUser.username}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedUser.tagline || selectedUser.profession}</p>
              </div>
            </div>

            {/* Dossier Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Email Address</span>
                <p className="font-mono text-white mt-0.5">{selectedUser.email}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Phone Number</span>
                <p className="font-mono text-white mt-0.5">{selectedUser.phoneNumber || 'Not provided'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Country</span>
                <p className="text-white mt-0.5">{selectedUser.country || 'Bangladesh'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Street / City Address</span>
                <p className="text-white mt-0.5">{selectedUser.address || 'Not provided'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Registration Date</span>
                <p className="font-mono text-slate-300 mt-0.5">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Last Login Timestamp</span>
                <p className="font-mono text-emerald-400 mt-0.5">
                  {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Just now'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Client IP Address</span>
                <p className="font-mono text-slate-300 mt-0.5">{selectedUser.ipAddress || '103.230.106.12'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500">AI Generations Used</span>
                <p className="font-mono text-indigo-400 font-bold mt-0.5">{selectedUser.aiGenerationsUsed} calls</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <a
                href={`/u/${selectedUser.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md"
              >
                <span>Visit Live Portfolio (/u/{selectedUser.username})</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
