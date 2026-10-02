import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Search,
  ExternalLink,
  Plus,
  Check,
  Eye,
  FileText
} from 'lucide-react';
import { Portfolio, MediaItem } from '../../../types/portfolio';

interface MediaLibraryTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const MediaLibraryTab: React.FC<MediaLibraryTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    ...(portfolio.media || []),
    { id: 'med-1', name: 'Profile_Avatar_HQ.jpg', url: portfolio.profile.avatar, size: '240 KB', category: 'avatar', uploadedAt: '2026-09-15' },
    { id: 'med-2', name: 'Header_Cover_Panoramic.png', url: portfolio.profile.coverImage, size: '1.4 MB', category: 'cover', uploadedAt: '2026-09-18' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const categories = ['all', 'avatar', 'project', 'cover', 'certificate', 'blog'];

  const filteredMedia = mediaList.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newItem: MediaItem = {
            id: `med-${Date.now()}`,
            name: file.name,
            url: reader.result,
            size: `${(file.size / 1024).toFixed(0)} KB`,
            category: 'project',
            uploadedAt: new Date().toISOString().split('T')[0]
          };
          const updated = [newItem, ...mediaList];
          setMediaList(updated);
          onUpdatePortfolio({ ...portfolio, media: updated });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    const updated = mediaList.filter(m => m.id !== id);
    setMediaList(updated);
    onUpdatePortfolio({ ...portfolio, media: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-indigo-400" />
            <span>Visual Assets & Media Library</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload, inspect, and organize screenshots, cover photos, certificates, and logos.
          </p>
        </div>

        <label className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 cursor-pointer self-start sm:self-auto">
          <Upload className="h-4 w-4" />
          <span>Upload Media</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                selectedCategory === c ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all"
          >
            <div className="relative h-32 w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewItem(item)}>
              <img src={item.url} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="p-3">
              <div className="text-xs font-bold text-white truncate mb-0.5">{item.name}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="capitalize">{item.category}</span>
                <span className="font-mono">{item.size}</span>
              </div>
            </div>

            <div className="p-3 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-1">
              <span className="text-[9px] text-slate-500">{item.uploadedAt}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 text-slate-500 hover:text-rose-400"
                title="Delete media"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute right-3 top-3 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <img src={previewItem.url} alt={previewItem.name} className="w-full max-h-[70vh] object-contain rounded-xl" />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold">{previewItem.name}</span>
              <span className="font-mono">{previewItem.size}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
