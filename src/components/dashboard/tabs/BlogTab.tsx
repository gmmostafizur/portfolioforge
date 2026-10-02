import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  Clock,
  Eye,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Portfolio, BlogPost } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface BlogTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const BlogTab: React.FC<BlogTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([...portfolio.blogPosts]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  const [category, setCategory] = useState('Architecture & Engineering');
  const [tagsInput, setTagsInput] = useState('AI, System Design, TypeScript');
  const [readMinutes, setReadMinutes] = useState(5);
  const [isPublished, setIsPublished] = useState(true);

  const startCreate = () => {
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
    setCategory('Engineering & Architecture');
    setTagsInput('Architecture, Systems, Best Practices');
    setReadMinutes(5);
    setIsPublished(true);
    setEditingPost(null);
    setIsCreating(true);
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setCategory(post.category);
    setTagsInput(post.tags.join(', '));
    setReadMinutes(post.readMinutes);
    setIsPublished(post.isPublished);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const postData: BlogPost = {
      id: editingPost ? editingPost.id : `post-${Date.now()}`,
      title: title.trim(),
      slug: generatedSlug,
      summary: summary.trim(),
      content: content.trim(),
      coverImage: coverImage.trim(),
      category: category.trim(),
      tags: tagsArray,
      publishedAt: new Date().toISOString().split('T')[0],
      isPublished,
      readMinutes: Number(readMinutes) || 4
    };

    let updated: BlogPost[];
    if (editingPost) {
      updated = posts.map(p => p.id === editingPost.id ? postData : p);
    } else {
      updated = [postData, ...posts];
    }

    setPosts(updated);
    onUpdatePortfolio({ ...portfolio, blogPosts: updated });
    setIsCreating(false);
    setEditingPost(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    onUpdatePortfolio({ ...portfolio, blogPosts: updated });
  };

  // AI Blog Article Generator
  const handleAIGenerateBlog = async () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    try {
      const res = await AIService.generateContent({
        tool: 'blog',
        inputs: {
          name: portfolio.profile.fullName,
          topic: title,
          details: summary || `Insights on ${category}`
        },
        tone: 'Professional'
      });
      if (res.text) {
        setContent(res.text);
        if (!summary) {
          setSummary(res.text.slice(0, 160) + '...');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span>Blog Essays & Insights</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish thoughtful technical articles, design teardowns, and industry perspectives to demonstrate expertise.
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
              <span>Write New Essay</span>
            </button>
          )}
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading text-sm font-bold text-white">
              {editingPost ? 'Edit Essay' : 'Draft New Article'}
            </h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }
                }}
                placeholder="e.g. Modern System Design Principles"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="modern-system-design"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. AI Architecture"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Read Time (Minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={readMinutes}
                onChange={(e) => setReadMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="AI, Architecture, Scalability"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Summary / Excerpt</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief preview displayed in blog cards and social sharing..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Article Content (Markdown supported)</label>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleAIGenerateBlog}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                <span>{isGenerating ? 'Writing with Gemini...' : 'Draft Post with AI'}</span>
              </button>
            </div>
            <textarea
              rows={10}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here. Use # for headers, ## for subsections, and bullet points..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded accent-indigo-600 h-4 w-4"
              />
              <span>Publish this post publicly</span>
            </label>

            <div className="flex gap-2">
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
                {editingPost ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>{post.category}</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {post.readMinutes} min read
                </span>
              </div>
              <h3 className="font-heading text-sm font-bold text-white mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {post.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                post.isPublished ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {post.isPublished ? 'Published' : 'Draft'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(post)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
