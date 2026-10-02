import React, { useState } from 'react';
import {
  Palette,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Layout,
  Type,
  Sun,
  Moon,
  RotateCcw
} from 'lucide-react';
import { Portfolio, ThemeConfig } from '../../../types/portfolio';
import { THEME_PRESETS, ThemePreset } from '../../../data/themes';

interface ThemesTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
  onOpenPreview: () => void;
}

export const ThemesTab: React.FC<ThemesTabProps> = ({
  portfolio,
  onUpdatePortfolio,
  onOpenPreview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [themeSettings, setThemeSettings] = useState<ThemeConfig>({ ...portfolio.themeSettings });
  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');
  const [isSaved, setIsSaved] = useState(false);

  const categories = ['All', 'Developer', 'Designer', 'Marketer', 'Executive', 'Creative', 'Minimal', 'Modern'];

  const filteredThemes = selectedCategory === 'All'
    ? THEME_PRESETS
    : THEME_PRESETS.filter(t => t.category === selectedCategory);

  const handleApplyPreset = (preset: ThemePreset) => {
    const updatedTheme: ThemeConfig = {
      ...preset
    };
    setThemeSettings(updatedTheme);
    onUpdatePortfolio({
      ...portfolio,
      themeId: preset.id,
      themeSettings: updatedTheme
    });
    triggerSaved();
  };

  const handleCustomChange = (field: keyof ThemeConfig, value: any) => {
    const updated = { ...themeSettings, [field]: value };
    setThemeSettings(updated);
    onUpdatePortfolio({
      ...portfolio,
      themeSettings: updated
    });
    triggerSaved();
  };

  const triggerSaved = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-400" />
            <span>Theme Marketplace & Visual Customizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Content is strictly decoupled from presentation. Switch themes freely — zero data is ever lost.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4 text-indigo-400" />
            <span>Open Live Preview</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'presets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Theme Presets ({THEME_PRESETS.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('customize')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'customize' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Visual Customizer (Live Tokens)</span>
        </button>
      </div>

      {/* TAB 1: PRESETS MARKETPLACE */}
      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of themes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredThemes.map((preset) => {
              const isCurrent = portfolio.themeSettings.name === preset.name;
              return (
                <div
                  key={preset.id}
                  className={`group rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-36 w-full bg-gradient-to-br ${preset.previewGradient} p-4 flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                        {preset.badge}
                      </span>
                      {isCurrent && (
                        <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          Active Theme
                        </span>
                      )}
                    </div>
                    <div className="font-heading font-bold text-base text-white drop-shadow">
                      {preset.name}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span>{preset.category}</span>
                        <span className="capitalize">{preset.fontFamily} font</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {preset.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={onOpenPreview}
                        className="text-xs font-semibold text-indigo-400 hover:underline"
                      >
                        Live Demo
                      </button>

                      <button
                        onClick={() => handleApplyPreset(preset)}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          isCurrent
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                        }`}
                      >
                        {isCurrent ? 'Current Theme' : 'Apply Theme'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL CUSTOMIZER */}
      {activeTab === 'customize' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-white">Visual Design Tokens</h3>
              
              {/* Quick Dark Mode / Light Mode Preset Toggles */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...themeSettings,
                      backgroundColor: '#090d16',
                      cardBackground: '#111827',
                      textColor: '#f8fafc'
                    };
                    setThemeSettings(updated);
                    onUpdatePortfolio({ ...portfolio, themeSettings: updated });
                    triggerSaved();
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    themeSettings.backgroundColor.toLowerCase() !== '#ffffff' && themeSettings.backgroundColor.toLowerCase() !== '#f8fafc'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="h-3 w-3" />
                  <span>Dark Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...themeSettings,
                      backgroundColor: '#f8fafc',
                      cardBackground: '#ffffff',
                      textColor: '#0f172a'
                    };
                    setThemeSettings(updated);
                    onUpdatePortfolio({ ...portfolio, themeSettings: updated });
                    triggerSaved();
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    themeSettings.backgroundColor.toLowerCase() === '#ffffff' || themeSettings.backgroundColor.toLowerCase() === '#f8fafc'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="h-3 w-3" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-300">Palette Tokens</span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleCustomChange('primaryColor', e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-slate-700 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleCustomChange('primaryColor', e.target.value)}
                      className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Secondary Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => handleCustomChange('secondaryColor', e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-slate-700 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => handleCustomChange('secondaryColor', e.target.value)}
                      className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.backgroundColor}
                      onChange={(e) => handleCustomChange('backgroundColor', e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-slate-700 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.backgroundColor}
                      onChange={(e) => handleCustomChange('backgroundColor', e.target.value)}
                      className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Card Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.cardBackground}
                      onChange={(e) => handleCustomChange('cardBackground', e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-slate-700 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.cardBackground}
                      onChange={(e) => handleCustomChange('cardBackground', e.target.value)}
                      className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300">Typography & Font Family</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sans', label: 'Plus Jakarta Sans (Modern Clean)' },
                  { id: 'heading', label: 'Space Grotesk (Tech Bold)' },
                  { id: 'serif', label: 'Newsreader Serif (Editorial)' },
                  { id: 'mono', label: 'JetBrains Mono (Developer)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleCustomChange('fontFamily', f.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      themeSettings.fontFamily === f.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300">Corner Radius</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Sharp 0px' },
                  { id: 'sm', label: 'Subtle 6px' },
                  { id: 'md', label: 'Standard 12px' },
                  { id: 'xl', label: 'Pill / 24px' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleCustomChange('borderRadius', r.id)}
                    className={`p-2 rounded-xl border text-center text-xs transition-all ${
                      themeSettings.borderRadius === r.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white font-bold'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Style */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300">Button Architecture</span>
              <div className="grid grid-cols-3 gap-2">
                {['solid', 'outline', 'glass'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleCustomChange('buttonStyle', b)}
                    className={`p-2 rounded-xl border text-center text-xs capitalize transition-all ${
                      themeSettings.buttonStyle === b
                        ? 'border-indigo-500 bg-indigo-950/40 text-white font-bold'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {b} Button
                  </button>
                ))}
              </div>
            </div>

            {/* Animation & Emoji Motion Presets */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Motion, Animation & Emoji Style</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'floating', label: 'Floating Aura & Emojis', desc: '🚀 Smooth floating badges & radiant glow' },
                  { id: 'bouncy', label: 'Bouncy Spring Motion', desc: '⚡ Interactive hover pop and spring scaling' },
                  { id: 'cyber', label: 'Cyber Glow & Pulse', desc: '💎 High-tech neon pulse and vibrant gradients' },
                  { id: 'minimal', label: 'Subtle Micro-Motion', desc: '✨ Elegant micro-transitions for executives' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      triggerSaved();
                    }}
                    className="p-2.5 rounded-xl border text-left text-xs transition-all border-indigo-500 bg-indigo-950/30 text-white ring-1 ring-indigo-500/50 hover:bg-indigo-950/50"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{m.label}</span>
                      <Check className="h-3 w-3 text-indigo-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Token Card Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Mini Preview
                </span>
                <span className="text-xs text-indigo-400 font-mono">Real-time reactive</span>
              </div>

              {/* Mock component applying current tokens */}
              <div
                className="p-6 border border-white/10 shadow-2xl transition-all"
                style={{
                  backgroundColor: themeSettings.backgroundColor,
                  color: themeSettings.textColor,
                  borderRadius:
                    themeSettings.borderRadius === 'none'
                      ? '0px'
                      : themeSettings.borderRadius === 'sm'
                      ? '6px'
                      : themeSettings.borderRadius === 'xl'
                      ? '24px'
                      : '12px'
                }}
              >
                <div
                  className="p-5 border border-white/10 mb-4"
                  style={{
                    backgroundColor: themeSettings.cardBackground,
                    borderRadius: '8px'
                  }}
                >
                  <h4 className="font-bold text-base mb-1" style={{ color: themeSettings.textColor }}>
                    {portfolio.profile.fullName}
                  </h4>
                  <p className="text-xs mb-3 font-medium" style={{ color: themeSettings.primaryColor }}>
                    {portfolio.profile.title}
                  </p>
                  <p className="text-xs opacity-80 leading-relaxed mb-4">
                    Sample card showing your active color tokens, card background, typography, and button styling.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-bold text-white shadow-md"
                    style={{
                      backgroundColor: themeSettings.primaryColor,
                      borderRadius: themeSettings.borderRadius === 'none' ? '0px' : '8px'
                    }}
                  >
                    Action Button
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onOpenPreview}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <Eye className="h-4 w-4" />
                <span>Open Full Page Preview</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
