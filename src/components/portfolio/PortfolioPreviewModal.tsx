import React, { useState } from 'react';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  Rocket,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Portfolio } from '../../types/portfolio';
import { PublicPortfolio } from './PublicPortfolio';
import confetti from 'canvas-confetti';

interface PortfolioPreviewModalProps {
  isOpen: boolean;
  portfolio: Portfolio;
  onClose: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
}

export const PortfolioPreviewModal: React.FC<PortfolioPreviewModalProps> = ({
  isOpen,
  portfolio,
  onClose,
  onPublish,
  onUnpublish,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `https://portfolioforge.ai/u/${portfolio.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.1 } });
    } catch {}
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublishClick = () => {
    onPublish();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.2 }
      });
    } catch {}
  };

  const deviceWidthClass =
    device === 'desktop'
      ? 'w-full'
      : device === 'tablet'
      ? 'w-[768px] mx-auto border-x border-slate-700 shadow-2xl rounded-2xl overflow-hidden my-4'
      : 'w-[390px] mx-auto border-x border-slate-700 shadow-2xl rounded-3xl overflow-hidden my-4';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in">
      {/* Top Controls Bar */}
      <div className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Live Preview
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Status:</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                portfolio.status === 'published'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                  : 'bg-amber-950 text-amber-400 border border-amber-800/40'
              }`}
            >
              {portfolio.status}
            </span>
          </div>
        </div>

        {/* Viewport switchers */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors ${
              device === 'desktop' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 1440px"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors ${
              device === 'tablet' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors ${
              device === 'mobile' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile 390px"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {portfolio.status === 'published' ? (
            <>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={onUnpublish}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-950/40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Unpublish</span>
              </button>
            </>
          ) : (
            <button
              onClick={handlePublishClick}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-all hover:scale-105"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>Publish Now</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-2 sm:p-4">
        <div className={deviceWidthClass}>
          <PublicPortfolio portfolio={portfolio} isDashboardPreview={false} />
        </div>
      </div>
    </div>
  );
};
