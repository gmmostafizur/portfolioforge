import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Github,
  Sparkles,
  Check,
  Star,
  Image as ImageIcon,
  Tag,
  Video,
  FileText,
  Play,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Info,
  LayoutGrid,
  ListOrdered
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Portfolio, ProjectItem } from '../../../types/portfolio';
import { AIService } from '../../../services/ai';

interface ProjectsTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>([...portfolio.projects]);
  const [viewMode, setViewMode] = useState<'grid' | 'reorder'>('grid');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Drag and drop states for projects
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [dropProjectIndicator, setDropProjectIndicator] = useState<{
    index: number;
    position: 'above' | 'below';
  } | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedProjectIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midpoint = targetRect.top + targetRect.height / 2;
    const position = e.clientY < midpoint ? 'above' : 'below';

    if (
      !dropProjectIndicator ||
      dropProjectIndicator.index !== index ||
      dropProjectIndicator.position !== position
    ) {
      setDropProjectIndicator({ index, position });
    }
  };

  const handleDragLeave = () => {
    // Keep indicator steady or clear
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedProjectIndex === null) return;

    const sourceIndex = draggedProjectIndex;
    if (sourceIndex === targetIndex) {
      setDraggedProjectIndex(null);
      setDropProjectIndicator(null);
      return;
    }

    const updated = [...projects];
    const [moved] = updated.splice(sourceIndex, 1);

    let insertIndex = targetIndex;
    if (dropProjectIndicator?.position === 'below' && sourceIndex > targetIndex) {
      insertIndex = targetIndex + 1;
    } else if (dropProjectIndicator?.position === 'above' && sourceIndex < targetIndex) {
      insertIndex = targetIndex - 1;
    }
    insertIndex = Math.max(0, Math.min(insertIndex, updated.length));

    updated.splice(insertIndex, 0, moved);
    setProjects(updated);
    onUpdatePortfolio({ ...portfolio, projects: updated });
    setDraggedProjectIndex(null);
    setDropProjectIndicator(null);
    setIsSaved(true);
    try {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.25 } });
    } catch {}
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDragEnd = () => {
    setDraggedProjectIndex(null);
    setDropProjectIndicator(null);
  };

  const handleMoveProject = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= projects.length) return;
    const updated = [...projects];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;
    setProjects(updated);
    onUpdatePortfolio({ ...portfolio, projects: updated });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const moveProjectDirection = (index: number, direction: 'top' | 'up' | 'down' | 'bottom') => {
    const updated = [...projects];
    const [item] = updated.splice(index, 1);

    if (direction === 'top') {
      updated.unshift(item);
    } else if (direction === 'bottom') {
      updated.push(item);
    } else if (direction === 'up') {
      const newIdx = Math.max(0, index - 1);
      updated.splice(newIdx, 0, item);
    } else if (direction === 'down') {
      const newIdx = Math.min(projects.length - 1, index + 1);
      updated.splice(newIdx, 0, item);
    }

    setProjects(updated);
    onUpdatePortfolio({ ...portfolio, projects: updated });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Form states for new/edited project
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Full-Stack Web App');
  const [client, setClient] = useState('');
  const [date, setDate] = useState('2025-2026');
  const [techInput, setTechInput] = useState('React, TypeScript, Tailwind');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [emoji, setEmoji] = useState('🚀');
  const [badgeGif, setBadgeGif] = useState('🔥 Popular');
  const [caseStudy, setCaseStudy] = useState('');
  const [resultsInput, setResultsInput] = useState('+40% Speed, 100K Users');
  const [isFeatured, setIsFeatured] = useState(true);

  const startCreate = () => {
    setTitle('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
    setCategory('Web Architecture');
    setClient('');
    setDate('2025');
    setTechInput('TypeScript, React, Cloud SQL');
    setLiveUrl('');
    setGithubUrl('');
    setVideoUrl('');
    setFileUrl('');
    setFileName('');
    setEmoji('🚀');
    setBadgeGif('🔥 Popular');
    setCaseStudy('');
    setResultsInput('99.9% Uptime, Sub-50ms Latency');
    setIsFeatured(true);
    setEditingProject(null);
    setIsCreating(true);
  };

  const startEdit = (proj: ProjectItem) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setImage(proj.image);
    setCategory(proj.category);
    setClient(proj.client || '');
    setDate(proj.date);
    setTechInput(proj.technologies.join(', '));
    setLiveUrl(proj.liveUrl || '');
    setGithubUrl(proj.githubUrl || '');
    setVideoUrl(proj.videoUrl || '');
    setFileUrl(proj.fileUrl || '');
    setFileName(proj.fileName || '');
    setEmoji(proj.emoji || '🚀');
    setBadgeGif(proj.badgeGif || '');
    setCaseStudy(proj.caseStudy || '');
    setResultsInput(proj.results.join(', '));
    setIsFeatured(proj.isFeatured);
    setIsCreating(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const techArray = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const resultsArray = resultsInput.split(',').map(r => r.trim()).filter(Boolean);

    const projectData: ProjectItem = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      gallery: [],
      category: category.trim(),
      client: client.trim(),
      date: date.trim(),
      technologies: techArray,
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      videoUrl: videoUrl.trim(),
      fileUrl: fileUrl.trim(),
      fileName: fileName.trim() || (fileUrl ? 'project_asset.pdf' : ''),
      emoji: emoji.trim() || '🚀',
      badgeGif: badgeGif.trim(),
      caseStudy: caseStudy.trim(),
      results: resultsArray,
      isFeatured
    };

    let updated: ProjectItem[];
    if (editingProject) {
      updated = projects.map(p => p.id === editingProject.id ? projectData : p);
    } else {
      updated = [projectData, ...projects];
    }

    setProjects(updated);
    onUpdatePortfolio({ ...portfolio, projects: updated });
    setIsCreating(false);
    setEditingProject(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    onUpdatePortfolio({ ...portfolio, projects: updated });
  };

  // AI Description Generator for Projects
  const handleAIGenerateProjectDesc = async () => {
    if (!title.trim()) return;
    setIsGeneratingDesc(true);
    try {
      const res = await AIService.generateContent({
        tool: 'project',
        inputs: {
          projectTitle: title,
          details: techInput,
          problem: description || 'High-throughput concurrency bottleneck'
        },
        tone: 'Professional',
        length: 'Medium'
      });
      if (res.text) {
        setDescription(res.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-400" />
            <span>Project & Case Study Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Showcase your flagship projects with live URLs, GitHub repositories, case studies, and quantified metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}

          {/* View mode toggle */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('reorder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'reorder'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Drag & Drop Sorter</span>
            </button>
          </div>

          {!isCreating && (
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Modal/Form */}
      {isCreating && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading text-sm font-bold text-white">
              {editingProject ? 'Edit Project' : 'Create New Featured Project'}
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nexus Multi-Agent Engine"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. AI & Cloud Architecture"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client or Organization (Optional)
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. FinTech Global"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Technologies Used (Comma-separated)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="TypeScript, React, Node.js, PostgreSQL"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Key Quantifiable Results (Comma-separated)
              </label>
              <input
                type="text"
                value={resultsInput}
                onChange={(e) => setResultsInput(e.target.value)}
                placeholder="+45% Speed, 450K Requests/mo"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Live Website URL (Optional)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Video Demo / Walkthrough URL (YouTube, Vimeo, MP4, Loom)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://loom.com/..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Attach Project File / Document (PDF, Code, ZIP, Case Study)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="File name (e.g. System_Architecture.pdf)"
                  className="w-1/2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
                <label className="w-1/2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-500/50 bg-indigo-950/20 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-950/40 cursor-pointer transition-colors">
                  <span>{fileUrl ? 'File Attached ✓' : 'Upload File / Asset'}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Emoji & Badge Animation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{emoji}</span>
                  <select
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="🚀">🚀 Rocket</option>
                    <option value="⚡">⚡ Lightning</option>
                    <option value="🤖">🤖 AI Bot</option>
                    <option value="🌐">🌐 Web Platform</option>
                    <option value="📱">📱 Mobile App</option>
                    <option value="🎨">🎨 UI/UX Design</option>
                    <option value="💎">💎 Premium</option>
                    <option value="📈">📈 Growth / Analytics</option>
                    <option value="🛡️">🛡️ Security / Cloud</option>
                    <option value="💡">💡 Innovation</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={badgeGif}
                  onChange={(e) => setBadgeGif(e.target.value)}
                  placeholder="Badge (e.g. 🔥 Trending, 📹 Video Demo)"
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Project Overview Description
              </label>
              <button
                type="button"
                disabled={isGeneratingDesc}
                onClick={handleAIGenerateProjectDesc}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                <span>{isGeneratingDesc ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the background, challenge, and technical approach..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              In-Depth Case Study Narrative (Optional)
            </label>
            <textarea
              rows={4}
              value={caseStudy}
              onChange={(e) => setCaseStudy(e.target.value)}
              placeholder="Detailed architecture breakdown, technical trade-offs, and lessons learned..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded accent-indigo-600 h-4 w-4"
              />
              <span>Mark as Featured Project</span>
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
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
              >
                {editingProject ? 'Save Changes' : 'Add Project'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Projects Reorder Tip Banner */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 px-4 py-3 text-xs text-indigo-300">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-indigo-400" />
          <span>
            <strong>Drag & Drop Interface:</strong> Grab any project by the handle (<GripVertical className="inline h-3.5 w-3.5 text-indigo-400" />) to reorder how projects are showcased on your public website.
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/40">
          {projects.length} Total Projects
        </span>
      </div>

      {/* VIEW MODE 1: DEDICATED DRAG & DROP SORTER VIEW */}
      {viewMode === 'reorder' && (
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8">
              <Briefcase className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No projects added yet to reorder.</p>
            </div>
          ) : (
            projects.map((proj, idx) => {
              const isDragging = draggedProjectIndex === idx;
              const isIndicatorAbove =
                dropProjectIndicator?.index === idx &&
                dropProjectIndicator.position === 'above';
              const isIndicatorBelow =
                dropProjectIndicator?.index === idx &&
                dropProjectIndicator.position === 'below';

              return (
                <div key={proj.id} className="relative">
                  {/* Above Drop Line Indicator */}
                  {isIndicatorAbove && (
                    <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mb-2 animate-pulse" />
                  )}

                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 sm:p-4 transition-all select-none ${
                      isDragging
                        ? 'opacity-40 border-dashed border-indigo-500 bg-indigo-950/20 scale-[0.99]'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                      {/* Drag Grip Handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Drag to reorder project"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>

                      {/* Order Number Badge */}
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-slate-300 shrink-0">
                        #{idx + 1}
                      </span>

                      {/* Thumbnail */}
                      {proj.image ? (
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="h-10 w-14 rounded-lg object-cover ring-1 ring-white/10 shrink-0 pointer-events-none"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 shrink-0">
                          <Briefcase className="h-4 w-4" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {proj.emoji && <span className="text-sm">{proj.emoji}</span>}
                          <span className="text-xs sm:text-sm font-bold text-white truncate">
                            {proj.title}
                          </span>
                          {proj.isFeatured && (
                            <span className="rounded bg-indigo-950 border border-indigo-800/40 px-1.5 py-0.2 text-[9px] font-bold text-indigo-400">
                              Featured
                            </span>
                          )}
                          {proj.videoUrl && (
                            <span className="rounded bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                              <Video className="h-2.5 w-2.5" /> Video
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span>{proj.category}</span>
                          {proj.date && <span>• {proj.date}</span>}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span className="hidden sm:inline text-slate-500">
                              ({proj.technologies.slice(0, 3).join(', ')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

                      <button
                        disabled={idx === 0}
                        onClick={() => moveProjectDirection(idx, 'top')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                        title="Move to first project"
                      >
                        <ArrowUpToLine className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === 0}
                        onClick={() => moveProjectDirection(idx, 'up')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                        title="Move earlier"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === projects.length - 1}
                        onClick={() => moveProjectDirection(idx, 'down')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                        title="Move later"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === projects.length - 1}
                        onClick={() => moveProjectDirection(idx, 'bottom')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                        title="Move to last project"
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Below Drop Line Indicator */}
                  {isIndicatorBelow && (
                    <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mt-2 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: CARDS GRID DISPLAY */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj, idx) => {
            const isDragging = draggedProjectIndex === idx;
            const isIndicatorAbove =
              dropProjectIndicator?.index === idx &&
              dropProjectIndicator.position === 'above';
            const isIndicatorBelow =
              dropProjectIndicator?.index === idx &&
              dropProjectIndicator.position === 'below';

            return (
              <div key={proj.id} className="relative">
                {/* Above indicator */}
                {isIndicatorAbove && (
                  <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mb-2 animate-pulse" />
                )}

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`rounded-2xl border bg-slate-900/50 overflow-hidden flex flex-col justify-between transition-all select-none ${
                    isDragging
                      ? 'opacity-40 border-dashed border-indigo-500 scale-[0.98] bg-indigo-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Drag Grip & Priority Bar */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                          title="Drag to reorder project"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveProject(idx, idx - 1)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                          title="Move up / earlier in order"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === projects.length - 1}
                          onClick={() => handleMoveProject(idx, idx + 1)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                          title="Move down / later in order"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {proj.image && (
                      <div className="h-40 w-full overflow-hidden bg-slate-950 relative">
                        <img src={proj.image} alt={proj.title} className="h-full w-full object-cover pointer-events-none" />
                        {proj.isFeatured && (
                          <span className="absolute top-2 right-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                            Featured
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <div className="flex items-center gap-1.5">
                          {proj.emoji && <span className="text-sm">{proj.emoji}</span>}
                          <span>{proj.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {proj.badgeGif && (
                            <span className="rounded bg-indigo-950/80 border border-indigo-700/50 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-300">
                              {proj.badgeGif}
                            </span>
                          )}
                          <span>{proj.date}</span>
                        </div>
                      </div>
                      <h3 className="font-heading text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {proj.description}
                      </p>

                      {/* Media and File Badges */}
                      {(proj.videoUrl || proj.fileUrl) && (
                        <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 border-b border-slate-800/80 text-[10px]">
                          {proj.videoUrl && (
                            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                              <Video className="h-3 w-3" />
                              <span>Video Demo Available</span>
                            </span>
                          )}
                          {proj.fileUrl && (
                            <span className="flex items-center gap-1 text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-800/40">
                              <FileText className="h-3 w-3" />
                              <span>{proj.fileName || 'Attached Project Asset'}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-2">
                        {proj.technologies.slice(0, 4).map((t, idx) => (
                          <span key={idx} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-800 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white" title="Live Link">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white" title="GitHub Repo">
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Below indicator */}
                {isIndicatorBelow && (
                  <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mt-2 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
