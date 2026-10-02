import React, { useState } from 'react';
import {
  User as UserIcon,
  Camera,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sparkles,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Portfolio, Profile, AvailabilityStatus } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface ProfileTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [profile, setProfile] = useState<Profile>({ ...portfolio.profile });
  const [isSaved, setIsSaved] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const handleChange = (field: keyof Profile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdatePortfolio({
      ...portfolio,
      profile: { ...profile }
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // AI Bio Assistant for Profile
  const handleAIBio = async () => {
    setIsGeneratingBio(true);
    try {
      const res = await AIService.generateContent({
        tool: 'bio',
        inputs: {
          name: profile.fullName,
          profession: profile.title,
          details: profile.shortBio || profile.location
        },
        tone: 'Professional',
        length: 'Medium'
      });
      if (res.text) {
        setProfile(prev => ({ ...prev, shortBio: res.text }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleChange('avatar', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleChange('coverImage', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-indigo-400" />
            <span>Profile & Identity</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your core details, contact information, photos, and professional status badge.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all self-start sm:self-auto"
        >
          {isSaved ? <Check className="h-4 w-4" /> : null}
          <span>{isSaved ? 'Changes Saved!' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Photos Section: Avatar & Cover */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col items-center text-center">
          <div className="relative mb-3 group">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={profile.fullName}
              className="h-28 w-28 rounded-2xl object-cover ring-2 ring-slate-700 shadow-xl"
            />
            <label className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div className="text-xs font-bold text-white mb-1">Profile Photo</div>
          <p className="text-[10px] text-slate-400 mb-3">Square aspect ratio recommended (PNG/JPG)</p>
          <label className="cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-750 transition-colors">
            Upload Avatar
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        {/* Cover Image */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white mb-1">Header Cover Image</div>
            <p className="text-[10px] text-slate-400 mb-3">Displays at the top of your public portfolio</p>
            <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
              {profile.coverImage ? (
                <img src={profile.coverImage} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-600 text-xs">
                  No cover image set
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <ImageIcon className="h-6 w-6 text-white" />
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">1600 × 500 px recommended</span>
            <label className="cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-750 transition-colors">
              Upload Cover
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Primary Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={profile.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Professional Title / Headline *
          </label>
          <input
            type="text"
            required
            value={profile.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Principal Cloud & AI Architect"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Location / Timezone
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. San Francisco, CA / Remote"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Contact Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@domain.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            External Website (Optional)
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="url"
              value={profile.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourdomain.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="text-xs font-bold text-white">Availability & Work Status</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'available', label: 'Available for Work', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20' },
            { id: 'open_to_offers', label: 'Open to Offers', color: 'text-sky-400 border-sky-500/40 bg-sky-950/20' },
            { id: 'busy', label: 'Fully Booked', color: 'text-slate-400 border-slate-700 bg-slate-800/40' }
          ].map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => handleChange('availability', status.id as AvailabilityStatus)}
              className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                profile.availability === status.id ? status.color + ' ring-1 ring-white/20' : 'border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              ● {status.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Status Badge Text (e.g. "Available for Advisory Consulting")
          </label>
          <input
            type="text"
            value={profile.statusText}
            onChange={(e) => handleChange('statusText', e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Short Bio with AI Generator */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Short Bio / Elevator Pitch
          </label>
          <button
            type="button"
            disabled={isGeneratingBio}
            onClick={handleAIBio}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isGeneratingBio ? 'Generating...' : 'Enhance with AI'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={profile.shortBio}
          onChange={(e) => handleChange('shortBio', e.target.value)}
          placeholder="Brief 2-3 sentences introducing your core value proposition..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
        />
      </div>

      {/* Long Bio / About Section */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Long Bio (Detailed Story & Career Philosophy)
        </label>
        <textarea
          rows={6}
          value={profile.longBio}
          onChange={(e) => handleChange('longBio', e.target.value)}
          placeholder="Write a deeper narrative detailing your career milestones, technical philosophy, and approach to collaboration..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
        />
      </div>
    </form>
  );
};
