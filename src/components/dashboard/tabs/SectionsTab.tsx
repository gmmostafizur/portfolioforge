import React, { useState } from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Eye,
  EyeOff,
  Edit2,
  Check,
  Plus,
  Sparkles,
  Info,
  GripVertical,
  Briefcase,
  Layout,
  ExternalLink,
  Move
} from 'lucide-react';
import { Portfolio, PortfolioSectionConfig, ProjectItem } from '../../../types/portfolio';
import confetti from 'canvas-confetti';

interface SectionsTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
  onOpenPreview: () => void;
}

export const SectionsTab: React.FC<SectionsTabProps> = ({
  portfolio,
  onUpdatePortfolio,
  onOpenPreview,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sections' | 'projects' | 'wireframe'>('sections');
  const [sections, setSections] = useState<PortfolioSectionConfig[]>([...portfolio.sections]);
  const [projects, setProjects] = useState<ProjectItem[]>([...portfolio.projects]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  // Sections drag states
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dropSectionIndicator, setDropSectionIndicator] = useState<{
    index: number;
    position: 'above' | 'below';
  } | null>(null);

  // Projects drag states
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [dropProjectIndicator, setDropProjectIndicator] = useState<{
    index: number;
    position: 'above' | 'below';
  } | null>(null);

  const triggerSaved = (msg: string = 'Changes saved') => {
    setSaveAlert(msg);
    try {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.2 } });
    } catch {}
    setTimeout(() => setSaveAlert(null), 2500);
  };

  // --- SECTIONS DRAG & DROP ---
  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleSectionDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midpoint = targetRect.top + targetRect.height / 2;
    const position = e.clientY < midpoint ? 'above' : 'below';

    if (
      !dropSectionIndicator ||
      dropSectionIndicator.index !== index ||
      dropSectionIndicator.position !== position
    ) {
      setDropSectionIndicator({ index, position });
    }
  };

  const handleSectionDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null) return;

    const sourceIndex = draggedSectionIndex;
    if (sourceIndex === targetIndex) {
      setDraggedSectionIndex(null);
      setDropSectionIndicator(null);
      return;
    }

    const updated = [...sections];
    const [moved] = updated.splice(sourceIndex, 1);

    let insertIndex = targetIndex;
    if (dropSectionIndicator?.position === 'below' && sourceIndex > targetIndex) {
      insertIndex = targetIndex + 1;
    } else if (dropSectionIndicator?.position === 'above' && sourceIndex < targetIndex) {
      insertIndex = targetIndex - 1;
    }
    insertIndex = Math.max(0, Math.min(insertIndex, updated.length));

    updated.splice(insertIndex, 0, moved);
    updated.forEach((s, idx) => (s.order = idx + 1));

    setSections(updated);
    onUpdatePortfolio({ ...portfolio, sections: updated });
    setDraggedSectionIndex(null);
    setDropSectionIndicator(null);
    triggerSaved('Section order updated!');
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setDropSectionIndicator(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const updated = [...sections];
    const [item] = updated.splice(index, 1);

    if (direction === 'top') {
      updated.unshift(item);
    } else if (direction === 'bottom') {
      updated.push(item);
    } else if (direction === 'up') {
      const newIdx = Math.max(0, index - 1);
      updated.splice(newIdx, 0, item);
    } else if (direction === 'down') {
      const newIdx = Math.min(sections.length - 1, index + 1);
      updated.splice(newIdx, 0, item);
    }

    updated.forEach((s, idx) => (s.order = idx + 1));
    setSections(updated);
    onUpdatePortfolio({ ...portfolio, sections: updated });
    triggerSaved('Section order moved!');
  };

  const handleToggle = (id: string) => {
    const updated = sections.map((sec) =>
      sec.id === id ? { ...sec, isEnabled: !sec.isEnabled } : sec
    );
    setSections(updated);
    onUpdatePortfolio({ ...portfolio, sections: updated });
    triggerSaved('Visibility updated');
  };

  const startEdit = (sec: PortfolioSectionConfig) => {
    setEditingId(sec.id);
    setEditTitle(sec.title);
    setEditSubtitle(sec.subtitle || '');
  };

  const saveEdit = (id: string) => {
    const updated = sections.map((sec) =>
      sec.id === id ? { ...sec, title: editTitle, subtitle: editSubtitle } : sec
    );
    setSections(updated);
    setEditingId(null);
    onUpdatePortfolio({ ...portfolio, sections: updated });
    triggerSaved('Section headers saved');
  };

  // --- PROJECTS DRAG & DROP ---
  const handleProjectDragStart = (e: React.DragEvent, index: number) => {
    setDraggedProjectIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleProjectDragOver = (e: React.DragEvent, index: number) => {
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

  const handleProjectDrop = (e: React.DragEvent, targetIndex: number) => {
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
    triggerSaved('Project display order updated!');
  };

  const handleProjectDragEnd = () => {
    setDraggedProjectIndex(null);
    setDropProjectIndicator(null);
  };

  const moveProject = (index: number, direction: 'up' | 'down' | 'top' | 'bottom') => {
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
    triggerSaved('Project moved!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              <span>Drag & Drop Layout & Reorder Studio</span>
            </h2>
            <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reorder the visual hierarchy of your portfolio sections and project showcase with real-time drag-and-drop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveAlert && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              <Check className="h-3.5 w-3.5" />
              <span>{saveAlert}</span>
            </span>
          )}
          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4 text-indigo-400" />
            <span>Preview Layout</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Sections Reorder vs Projects Reorder vs Live Wireframe */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('sections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sections'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Reorder Sections ({sections.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'projects'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Reorder Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wireframe')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'wireframe'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layout className="h-4 w-4" />
          <span>Visual Layout Wireframe</span>
        </button>
      </div>

      {/* Reorder Tip Banner */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 px-4 py-3 text-xs text-indigo-300">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-indigo-400" />
          <span>
            <strong>Drag-and-Drop Active:</strong> Grab any card by the grip handle (
            <GripVertical className="inline h-3.5 w-3.5 text-indigo-400" />
            ) and drag it to insert above or below other items. Changes are saved and reflected live.
          </span>
        </div>
      </div>

      {/* SUB-TAB 1: REORDER SECTIONS */}
      {activeSubTab === 'sections' && (
        <div className="space-y-3">
          {sections.map((sec, idx) => {
            const isDragging = draggedSectionIndex === idx;
            const isIndicatorAbove =
              dropSectionIndicator?.index === idx &&
              dropSectionIndicator.position === 'above';
            const isIndicatorBelow =
              dropSectionIndicator?.index === idx &&
              dropSectionIndicator.position === 'below';

            return (
              <div key={sec.id} className="relative">
                {/* Visual Drop Line Above */}
                {isIndicatorAbove && (
                  <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mb-2 animate-pulse" />
                )}

                <div
                  draggable={editingId === null}
                  onDragStart={(e) => handleSectionDragStart(e, idx)}
                  onDragOver={(e) => handleSectionDragOver(e, idx)}
                  onDrop={(e) => handleSectionDrop(e, idx)}
                  onDragEnd={handleSectionDragEnd}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 sm:p-4 transition-all select-none ${
                    isDragging
                      ? 'opacity-40 border-dashed border-indigo-500 bg-indigo-950/20 scale-[0.99]'
                      : sec.isEnabled
                      ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                      : 'border-slate-800/40 bg-slate-950/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                    {/* Grip Handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Drag to reorder section"
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>

                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300 shrink-0">
                      {idx + 1}
                    </span>

                    {editingId === sec.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none flex-1"
                          placeholder="Section Title"
                        />
                        <input
                          type="text"
                          value={editSubtitle}
                          onChange={(e) => setEditSubtitle(e.target.value)}
                          className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none flex-1"
                          placeholder="Subtitle (optional)"
                        />
                        <button
                          onClick={() => saveEdit(sec.id)}
                          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white truncate">
                            {sec.title}
                          </span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono uppercase text-slate-400">
                            {sec.sectionId}
                          </span>
                          {!sec.isEnabled && (
                            <span className="rounded bg-rose-950/80 border border-rose-800/40 px-1.5 py-0.2 text-[9px] font-semibold text-rose-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        {sec.subtitle && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {sec.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(sec)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Rename section"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggle(sec.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        sec.isEnabled
                          ? 'text-emerald-400 hover:bg-emerald-950/40'
                          : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                      }`}
                      title={sec.isEnabled ? 'Hide section' : 'Enable section'}
                    >
                      {sec.isEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>

                    <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

                    <button
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'top')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                      title="Move to top"
                    >
                      <ArrowUpToLine className="h-3.5 w-3.5" />
                    </button>

                    <button
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, 'bottom')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                      title="Move to bottom"
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Visual Drop Line Below */}
                {isIndicatorBelow && (
                  <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mt-2 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: REORDER PROJECTS */}
      {activeSubTab === 'projects' && (
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8">
              <Briefcase className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No projects available to reorder.</p>
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
                  {/* Above Drop Line */}
                  {isIndicatorAbove && (
                    <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mb-2 animate-pulse" />
                  )}

                  <div
                    draggable
                    onDragStart={(e) => handleProjectDragStart(e, idx)}
                    onDragOver={(e) => handleProjectDragOver(e, idx)}
                    onDrop={(e) => handleProjectDrop(e, idx)}
                    onDragEnd={handleProjectDragEnd}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 sm:p-4 transition-all select-none ${
                      isDragging
                        ? 'opacity-40 border-dashed border-indigo-500 bg-indigo-950/20 scale-[0.99]'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                      {/* Grip */}
                      <div
                        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Drag to reorder project"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>

                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300 shrink-0">
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
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span>{proj.category}</span>
                          {proj.date && <span>• {proj.date}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveProject(idx, 'top')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                        title="Move to top"
                      >
                        <ArrowUpToLine className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === 0}
                        onClick={() => moveProject(idx, 'up')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === projects.length - 1}
                        onClick={() => moveProject(idx, 'down')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === projects.length - 1}
                        onClick={() => moveProject(idx, 'bottom')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                        title="Move to bottom"
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Below Drop Line */}
                  {isIndicatorBelow && (
                    <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50 mt-2 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SUB-TAB 3: LIVE WIREFRAME LAYOUT */}
      {activeSubTab === 'wireframe' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-heading text-sm font-bold text-white">Visual Page Hierarchy</h3>
              <p className="text-xs text-slate-400">Shows the exact order that visitors see when scrolling your website.</p>
            </div>
            <button
              onClick={onOpenPreview}
              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Open Live Modal Preview
            </button>
          </div>

          <div className="max-w-lg mx-auto space-y-2 py-4">
            {/* Top Fixed Hero */}
            <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/40 p-3 text-center">
              <span className="text-xs font-bold text-indigo-300">👤 Hero & Profile Intro (Always Top)</span>
            </div>

            {/* Dynamic sections in order */}
            {sections
              .filter((s) => s.sectionId !== 'hero' && s.isEnabled)
              .sort((a, b) => a.order - b.order)
              .map((sec, idx) => (
                <div
                  key={sec.id}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 p-3 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Step {idx + 1}:</span>
                    <span className="text-xs font-semibold text-white">{sec.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    {sec.sectionId}
                  </span>
                </div>
              ))}

            {/* Footer */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center">
              <span className="text-[11px] text-slate-500">© Footer & Copyright</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
