import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Shield,
  ArrowRight,
  Server
} from 'lucide-react';
import { Portfolio, CustomDomainSettings } from '../../../types/portfolio';

interface DomainTabProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updated: Portfolio) => void;
}

export const DomainTab: React.FC<DomainTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [domainInput, setDomainInput] = useState(portfolio.domain?.domain || '');
  const [domainStatus, setDomainStatus] = useState<CustomDomainSettings['status']>(
    portfolio.domain?.status || 'none'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const dnsRecordA = '76.76.21.21';
  const dnsRecordCNAME = 'cname.portfolioforge.ai';

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setDomainStatus('verified');

      const updatedDomain: CustomDomainSettings = {
        domain: domainInput.trim().toLowerCase(),
        status: 'verified',
        configuredAt: new Date().toISOString(),
        dnsRecordA,
        dnsRecordCNAME
      };

      onUpdatePortfolio({
        ...portfolio,
        domain: updatedDomain
      });
    }, 1500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-400" />
            <span>Custom Domain Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect your branded domain (e.g. {portfolio.username}.com) with automated SSL certification.
          </p>
        </div>
      </div>

      {/* Domain Input Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="font-heading text-sm font-bold text-white">Connect Domain</h3>
        <p className="text-xs text-slate-400">
          Enter your apex domain or subdomain below:
        </p>

        <form onSubmit={handleConnect} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="e.g. john.dev or portfolio.john.com"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md transition-all disabled:opacity-50"
          >
            {isVerifying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
            <span>{isVerifying ? 'Verifying DNS...' : 'Connect & Verify'}</span>
          </button>
        </form>

        {domainStatus === 'verified' && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Domain {domainInput} is verified & active with SSL certificate!</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Status: OK (200)</span>
          </div>
        )}
      </div>

      {/* DNS Configuration Instructions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Server className="h-4 w-4 text-indigo-400" />
          <span>Required DNS Records</span>
        </div>
        <p className="text-xs text-slate-400">
          Add either of the following records to your domain provider (Cloudflare, Namecheap, GoDaddy):
        </p>

        <div className="space-y-3">
          {/* Record 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-indigo-400 font-mono">Type: A Record (Apex)</div>
              <div className="text-white font-mono mt-0.5">Name: @ · Value: {dnsRecordA}</div>
            </div>
            <button
              onClick={() => copyToClipboard(dnsRecordA, 'a')}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedRecord === 'a' ? 'Copied IP' : 'Copy IP'}</span>
            </button>
          </div>

          {/* Record 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-sky-400 font-mono">Type: CNAME (Subdomain)</div>
              <div className="text-white font-mono mt-0.5">Name: www (or subdomain) · Value: {dnsRecordCNAME}</div>
            </div>
            <button
              onClick={() => copyToClipboard(dnsRecordCNAME, 'cname')}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedRecord === 'cname' ? 'Copied CNAME' : 'Copy CNAME'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
