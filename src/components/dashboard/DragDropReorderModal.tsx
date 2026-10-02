import React, { useState } from 'react';
import {
  X,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Eye,
  EyeOff,
  Layers,
  Briefcase,
  Check,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { Portfolio, PortfolioSectionConfig, ProjectItem } from '../../types/portfolio';
import confetti from 'canvas-confetti';

interface DragDropReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
  onOpenPreview: () => void;
  initialTab?: 'sections' | 'projects';
}

export const DragDropReorderModal: React.FC<DragDropReorderModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  onUpdatePortfolio,
  onOpenPreview,
  initialTab = 'sections',
}) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'projects'>(initialTab);
  const [sections, setSections] = useState<PortfolioSectionConfig[]>([...portfolio.sections]);
  const [projects, setProjects] = useState<ProjectItem[]>([...portfolio.projects]);

  // Drag states for Sections
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dropSectionIndicator, setDropSectionIndicator] = useState<{
    index: number;
    position: 'above' | 'below';
  } | null>(null);

  // Drag states for Projects
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [dropProjectIndicator, setDropProjectIndicator] = useState<{
    index: number;
    position: 'above' | 'below';
  } | null>(null);

  const [savedAlert, setSavedAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const showSaved = (message: string) => {
    setSavedAlert(message);
    try {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.15 } });
    } catch {}
    setTimeout(() => setSavedAlert(null), 2500);
  };

  // --- SECTIONS REORDERING LOGIC ---
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

    // Calculate insertion index
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
    showSaved('Sections reordered successfully!');
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
    showSaved('Section position moved!');
  };

  const toggleSection = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
    );
    setSections(updated);
    onUpdatePortfolio({ ...portfolio, sections: updated });
    showSaved('Section visibility updated!');
  };

  // --- PROJECTS REORDERING LOGIC ---
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
    showSaved('Projects reordered successfully!');
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
    showSaved('Project moved!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <GripVertical className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white">
                  Drag & Drop Layout Editor
                </h3>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Easily drag and reorder sections and projects to define the presentation sequence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedAlert && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-bounce-subtle">
                <Check className="h-3.5 w-3.5" />
                <span>{savedAlert}</span>
              </span>
            )}
            <button
              onClick={onOpenPreview}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-indigo-400" />
              <span>Preview</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sections'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Portfolio Sections ({sections.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Projects Showcase ({projects.length})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-indigo-400" />
            <span>Grab the handle (<GripVertical className="inline h-3 w-3" />) and drop above or below any card.</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {/* TAB 1: SECTIONS */}
          {activeTab === 'sections' && (
            <div className="space-y-2.5">
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
                    {/* Above Drop Line Indicator */}
                    {isIndicatorAbove && (
                      <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 mb-2 animate-pulse" />
                    )}

                    <div
                      draggable
                      onDragStart={(e) => handleSectionDragStart(e, idx)}
                      onDragOver={(e) => handleSectionDragOver(e, idx)}
                      onDrop={(e) => handleSectionDrop(e, idx)}
                      onDragEnd={handleSectionDragEnd}
                      className={`flex items-center justify-between rounded-2xl border p-3 sm:p-4 transition-all duration-150 select-none ${
                        isDragging
                          ? 'opacity-40 border-dashed border-indigo-500 bg-indigo-950/20 scale-[0.99]'
                          : sec.isEnabled
                          ? 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950'
                          : 'border-slate-800/40 bg-slate-950/30 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                        {/* Drag Grip Handle */}
                        <div
                          className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Drag to reorder section"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Order Number Badge */}
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-slate-300 shrink-0">
                          {idx + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {sec.title}
                            </span>
                            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[9px] font-mono uppercase text-slate-400">
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
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Toggle visibility */}
                        <button
                          onClick={() => toggleSection(sec.id)}
                          className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                            sec.isEnabled
                              ? 'text-emerald-400 hover:bg-emerald-950/50'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                          }`}
                          title={sec.isEnabled ? 'Hide section' : 'Show section'}
                        >
                          {sec.isEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>

                        <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

                        {/* Top / Up / Down / Bottom shortcuts */}
                        <button
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, 'top')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                          title="Move to very top"
                        >
                          <ArrowUpToLine className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, 'up')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                          title="Move up one position"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => moveSection(idx, 'down')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                          title="Move down one position"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => moveSection(idx, 'bottom')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                          title="Move to very bottom"
                        >
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Below Drop Line Indicator */}
                    {isIndicatorBelow && (
                      <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 mt-2 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-2.5">
              {projects.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8">
                  <Briefcase className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No projects created yet to reorder.</p>
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
                        <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 mb-2 animate-pulse" />
                      )}

                      <div
                        draggable
                        onDragStart={(e) => handleProjectDragStart(e, idx)}
                        onDragOver={(e) => handleProjectDragOver(e, idx)}
                        onDrop={(e) => handleProjectDrop(e, idx)}
                        onDragEnd={handleProjectDragEnd}
                        className={`flex items-center justify-between rounded-2xl border p-3 sm:p-4 transition-all duration-150 select-none ${
                          isDragging
                            ? 'opacity-40 border-dashed border-indigo-500 bg-indigo-950/20 scale-[0.99]'
                            : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950'
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

                          {/* Project Thumbnail */}
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

                        {/* Action Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            disabled={idx === 0}
                            onClick={() => moveProject(idx, 'top')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                            title="Move to first project"
                          >
                            <ArrowUpToLine className="h-3.5 w-3.5" />
                          </button>
                          <button
                            disabled={idx === 0}
                            onClick={() => moveProject(idx, 'up')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                            title="Move earlier"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            disabled={idx === projects.length - 1}
                            onClick={() => moveProject(idx, 'down')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20"
                            title="Move later"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            disabled={idx === projects.length - 1}
                            onClick={() => moveProject(idx, 'bottom')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 hidden sm:inline-flex"
                            title="Move to last project"
                          >
                            <ArrowDownToLine className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Below Drop Line Indicator */}
                      {isIndicatorBelow && (
                        <div className="h-1.5 w-full rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 mt-2 animate-pulse" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800/80 bg-slate-950/80">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Changes are automatically saved and immediately updated on your public link.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
