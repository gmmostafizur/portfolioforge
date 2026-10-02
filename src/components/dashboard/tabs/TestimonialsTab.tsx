import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  User as UserIcon
} from 'lucide-react';
import { Portfolio, TestimonialItem } from '../../../types/portfolio';

interface TestimonialsTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([...portfolio.testimonials]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [role, setRole] = useState('Chief Technology Officer');
  const [company, setCompany] = useState('Acme Technologies');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [projectRef, setProjectRef] = useState('');

  const startCreate = () => {
    setClientName('');
    setRole('Founder & CEO');
    setCompany('');
    setAvatar('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80');
    setContent('');
    setRating(5);
    setProjectRef('');
    setEditingItem(null);
    setIsCreating(true);
  };

  const startEdit = (t: TestimonialItem) => {
    setEditingItem(t);
    setClientName(t.clientName);
    setRole(t.role);
    setCompany(t.company);
    setAvatar(t.avatar);
    setContent(t.content);
    setRating(t.rating);
    setProjectRef(t.projectRef || '');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !content.trim()) return;

    const tData: TestimonialItem = {
      id: editingItem ? editingItem.id : `t-${Date.now()}`,
      clientName: clientName.trim(),
      role: role.trim(),
      company: company.trim(),
      avatar: avatar.trim(),
      content: content.trim(),
      rating,
      projectRef: projectRef.trim()
    };

    let updated: TestimonialItem[];
    if (editingItem) {
      updated = testimonials.map(item => item.id === editingItem.id ? tData : item);
    } else {
      updated = [...testimonials, tData];
    }

    setTestimonials(updated);
    onUpdatePortfolio({ ...portfolio, testimonials: updated });
    setIsCreating(false);
    setEditingItem(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    onUpdatePortfolio({ ...portfolio, testimonials: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" />
            <span>Client & Colleague Endorsements</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build instant credibility with client reviews, testimonials, ratings, and quotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {!isCreating && (
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Endorsement</span>
            </button>
          )}
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading text-sm font-bold text-white">
              {editingItem ? 'Edit Testimonial' : 'Add Client Review'}
            </h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Chief Technology Officer"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Veloce Dynamics"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Client Photo URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Star Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Referenced Project (Optional)</label>
              <input
                type="text"
                value={projectRef}
                onChange={(e) => setProjectRef(e.target.value)}
                placeholder="e.g. Nexus Multi-Agent Engine"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Testimonial Quote *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did they say about working with you, your delivery speed, quality, and technical leadership?"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
            >
              {editingItem ? 'Save Endorsement' : 'Add Endorsement'}
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(t)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed mb-4">
                "{t.content}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              {t.avatar && (
                <img src={t.avatar} alt={t.clientName} className="h-8 w-8 rounded-full object-cover" />
              )}
              <div>
                <div className="text-xs font-bold text-white">{t.clientName}</div>
                <div className="text-[10px] text-slate-400">{t.role} · {t.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
