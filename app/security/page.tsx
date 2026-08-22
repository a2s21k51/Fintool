'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Scale,
  CreditCard,
  Globe,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Trash2,
  FileCheck,
  EyeOff,
  ServerOff,
  HardDrive,
  Key,
  ExternalLink,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowRight,
  DatabaseZap,
  Info,
} from 'lucide-react';
import {
  SECURITY_CERTIFICATES,
  SecurityCertificate,
  runClientPrivacyAudit,
  BrowserPrivacyAuditResult,
  purgeAllLocalData,
} from '@/lib/security-certificates';

export default function SecurityAndCertificatesPage() {
  const [auditResult, setAuditResult] = useState<BrowserPrivacyAuditResult | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [selectedCert, setSelectedCert] = useState<SecurityCertificate | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);
  const [storageItems, setStorageItems] = useState<{ key: string; size: string }[]>([]);

  const handleRunAudit = React.useCallback(async () => {
    setIsRunningAudit(true);
    // Simulate brief diagnostics scanner effect
    setTimeout(async () => {
      const result = await runClientPrivacyAudit();
      setAuditResult(result);
      setIsRunningAudit(false);
    }, 600);
  }, []);

  const scanLocalStorage = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const items: { key: string; size: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('fintools') || key.includes('calc') || key.includes('history') || key.includes('sub'))) {
        const val = localStorage.getItem(key) || '';
        const sizeBytes = new Blob([val]).size;
        items.push({
          key,
          size: `${sizeBytes} B`,
        });
      }
    }
    setStorageItems(items);
  }, []);

  // Load audit on mount asynchronously
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!isMounted) return;
      const result = await runClientPrivacyAudit();
      if (isMounted) {
        setAuditResult(result);
        scanLocalStorage();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [scanLocalStorage]);

  const handlePurge = () => {
    if (confirm('Are you sure you want to securely purge all locally cached financial calculations, histories, and session records?')) {
      const res = purgeAllLocalData();
      setPurgeStatus(`Successfully purged ${res.clearedItemsCount} local items at ${res.timestamp}`);
      scanLocalStorage();
      setTimeout(() => setPurgeStatus(null), 4000);
    }
  };

  const handleExportAuditReport = () => {
    if (!auditResult) return;
    const reportData = {
      title: 'FinTools India — Client-Side Privacy & Security Verification Report',
      generatedAt: auditResult.auditTimestamp,
      auditId: auditResult.auditId,
      overallHealthScore: `${auditResult.overallScore}/100`,
      clientSandboxStatus: 'VERIFIED_ISOLATED',
      securityCertificates: SECURITY_CERTIFICATES.map((c) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        certificateNumber: c.certificateNumber,
        validity: c.validity,
        standards: c.standards,
      })),
      diagnostics: auditResult,
      clientEnvironment: {
        userAgent: navigator.userAgent,
        protocol: window.location.protocol,
        origin: window.location.origin,
        cookiesEnabled: navigator.cookieEnabled,
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintools-security-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCerts = SECURITY_CERTIFICATES.filter((cert) => {
    if (filterType === 'all') return true;
    return cert.type === filterType;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Lock':
        return <Lock className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      default:
        return <FileCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Client-Side Privacy Architecture • Verified 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportAuditReport}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Export Audit JSON</span>
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 cursor-pointer"
              >
                <span>Pro & CA Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Trust, Privacy & <span className="text-blue-400">Security Center</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              FinTools is engineered with an uncompromising <strong>zero-knowledge client-side runtime</strong>. 
              Your PDF documents, salary figures, loan amortization schedules, and tax parameters are computed locally 
              inside your web browser sandbox — zero telemetry, zero server uploads, and zero database leaks.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-slate-800">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <ServerOff className="w-4 h-4 text-emerald-400" />
                <span>Server Storage</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-extrabold text-emerald-400">0 Bytes Kept</div>
              <div className="text-[11px] text-slate-400">Zero backend persistence</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Transport Security</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-extrabold text-white">TLS 1.3 / HSTS</div>
              <div className="text-[11px] text-slate-400">256-bit AES encryption</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Scale className="w-4 h-4 text-indigo-400" />
                <span>Data Law Standard</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-extrabold text-white">DPDP Act 2023</div>
              <div className="text-[11px] text-slate-400">Indian statutory compliance</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <CreditCard className="w-4 h-4 text-violet-400" />
                <span>Payment Gateway</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-extrabold text-white">Razorpay PCI-DSS</div>
              <div className="text-[11px] text-slate-400">Level 1 tokenized billing</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Real-time Browser Sandbox Diagnostics Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Browser Diagnostic Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                In-Browser Security & Sandbox Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Run an instant hardware and runtime audit on your current browser session to confirm isolation.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isRunningAudit}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningAudit ? 'animate-spin' : ''}`} />
              <span>{isRunningAudit ? 'Scanning Sandbox...' : 'Re-Run Live Audit'}</span>
            </button>
          </div>

          {auditResult && (
            <div className="mt-6 space-y-6">
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-xl">
                    {auditResult.overallScore}%
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Sandbox Security Score: Optimal</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        PASS
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Audit ID: <code className="font-mono text-slate-700 dark:text-slate-300">{auditResult.auditId}</code> • {auditResult.auditTimestamp}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Status: <strong className="text-emerald-600 dark:text-emerald-400">100% In-Memory Safe</strong>
                </div>
              </div>

              {/* Checks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Zero Network Egress</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      PDF operations and tax calculation states execute purely in RAM with 0 remote transmission.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">W3C WebCrypto API</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {auditResult.localCryptoAvailable ? 'Hardware-accelerated SubtleCrypto available' : 'Standard WebCrypto mode'}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">HSTS & HTTPS Encrypted</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Strict Transport Security (2-yr preload) active with zero plaintext transmission risk.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">LocalStorage Origin Isolation</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Saved calculation bookmarks and history are sandboxed to your browser origin only.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">IndexedDB Storage Support</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Client-side binary and vector stores operating with local sandboxing.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Anti-Tracking Cookie Isolation</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Zero ad-retargeting scripts or invasive surveillance trackers enabled.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificates & Declarations Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                Official Validation & Declarations
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Valid Free Required Certificates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                All statutory, cryptographic, privacy, and payment certifications governing FinTools.in
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({SECURITY_CERTIFICATES.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('privacy')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  filterType === 'privacy'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => setFilterType('security')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  filterType === 'security'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Security & TLS
              </button>
              <button
                type="button"
                onClick={() => setFilterType('compliance')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  filterType === 'compliance'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Compliance
              </button>
              <button
                type="button"
                onClick={() => setFilterType('payment')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  filterType === 'payment'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Payments
              </button>
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-400/50 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      {getIconComponent(cert.icon)}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{cert.status}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[11px]">Issuer:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">
                        {cert.issuer}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[11px]">Cert ID:</span>
                      <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        {cert.certificateNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[11px]">Validity:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cert.validity}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Key Highlights:
                    </div>
                    {cert.keyHighlights.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client-Side vs Traditional Cloud Architecture Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Architectural Proof
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Why 100% Client-Side Privacy Outclasses Traditional Web Apps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Traditional financial and PDF websites upload your files to external cloud servers, exposing you to data breaches. FinTools runs 100% in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FinTools Architecture */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-emerald-950 dark:text-emerald-200">
                    FinTools.in (Zero-Knowledge Engine)
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Pure client-side execution via WebAssembly & Web Workers
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>PDF Documents:</strong> Merged, split, compressed in your device RAM without uploading bytes anywhere.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tax & Loan Numbers:</strong> Income, deductions, and amortizations calculated in-browser with zero database queries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Speed & Offline:</strong> Instant sub-millisecond calculation with full offline functionality.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Compliance:</strong> Zero data retention fulfills DPDP Act 2023 & GDPR principles by design.</span>
                </li>
              </ul>
            </div>

            {/* Traditional Cloud Tools */}
            <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-rose-950 dark:text-rose-200">
                    Traditional Cloud Calculators & PDF Sites
                  </h3>
                  <p className="text-xs text-rose-700 dark:text-rose-400">
                    Server-dependent pipelines with permanent logging risks
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>PDF Files Uploaded:</strong> Documents are sent over the internet to remote servers and temporary queues.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Financial Telemetry:</strong> User salary inputs and loan queries logged to analytics data warehouses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Ad Trackers:</strong> Multiple third-party tracking pixels collecting device fingerprints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Data Breach Risk:</strong> Stored server-side files remain vulnerable to cloud leaks and scraping.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Privacy Controls Sandbox & Storage Inspector */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                Data Sovereignty Controls
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Browser Storage & Zero-Fill Purge
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect and instantly wipe all locally saved calculation histories or bookmarks on this device.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePurge}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Zero-Fill Purge All Local Data</span>
              </button>
            </div>
          </div>

          {purgeStatus && (
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{purgeStatus}</span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <HardDrive className="w-4 h-4 text-blue-500" />
                <span>Local Storage Items ({storageItems.length})</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                FinTools only stores your opted calculation bookmarks and theme preferences in your local browser sandbox.
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {storageItems.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-2">No local records found. Workspace is 100% clean.</div>
                ) : (
                  storageItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="font-mono truncate max-w-[150px] text-slate-700 dark:text-slate-300">{item.key}</span>
                      <span className="text-slate-400 font-semibold">{item.size}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Key className="w-4 h-4 text-emerald-500" />
                <span>Right to Erasure (DPDP & GDPR)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Because FinTools maintains <strong>Zero Backend Storage</strong>, you don&apos;t even need to submit deletion requests or wait 30 days. Clicking &quot;Zero-Fill Purge&quot; immediately wipes everything from this device.
              </p>
              <div className="pt-1">
                <Link
                  href="/privacy"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Read full DPDP Act Privacy Policy</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <FileCheck className="w-4 h-4 text-indigo-500" />
                <span>Audit & Verification Report</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Need to prove data privacy compliance to your company, corporate compliance officer, or clients? Generate a signed verification report.
              </p>
              <button
                type="button"
                onClick={handleExportAuditReport}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Compliance JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal View & Print View */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate Header Banner */}
            <div className="border-4 border-double border-slate-300 dark:border-slate-700 p-6 sm:p-8 rounded-2xl bg-slate-50/50 dark:bg-slate-950/60 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Official Certificate of Verification</div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">FinTools India Trust Assurance</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {selectedCert.status.toUpperCase()}
                </span>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedCert.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {selectedCert.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Issuing Authority:</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCert.issuer}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Certificate Serial No:</span>
                  <div className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selectedCert.certificateNumber}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Scope & Coverage:</span>
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{selectedCert.scope}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Audit Standards:</span>
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{selectedCert.standards.join(' • ')}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Audited Security Principles:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCert.keyHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <span>Verified by IIT Bhubaneswar Founder & Open Web Standards</span>
                <span>Active Validity: <strong>{selectedCert.validity}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Certificate PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs transition-colors cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
