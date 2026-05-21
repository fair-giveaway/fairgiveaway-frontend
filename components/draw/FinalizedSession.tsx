'use client';

import { useState } from 'react';
import { FaLock, FaClipboard, FaCheck } from 'react-icons/fa6';
import type { GiveawayDoc } from '@/lib/api';

export default function FinalizedSession({ data, drawId }: { data: GiveawayDoc; drawId: string }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryWinners = data.winners.filter(w => w.type === 'primary');
  const secondaryWinners = data.winners.filter(w => w.type === 'secondary');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Locked Banner */}
      <div className="mb-8 rounded-2xl border border-teal/25 bg-teal/5 dark:bg-teal/10 p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/20 text-xl text-teal dark:text-teal-light">
          <FaLock />
        </div>
        <h2 className="text-lg font-semibold text-teal-dark dark:text-teal-light">
          Provably Fair & Locked
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/45">
          This draw has been finalized. The results are permanently recorded and cannot be altered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none space-y-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-white/[0.06]">
            Draw Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1">Target Tweet</span>
              <a href={`https://x.com/i/status/${data.tweetId}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-teal hover:underline break-all">
                {data.tweetId}
              </a>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1">Host</span>
              <span className="text-sm font-medium text-slate-800 dark:text-white/70">@{data.hostUsername || 'Unknown'}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1">Mode</span>
              <span className="text-sm font-medium capitalize text-slate-800 dark:text-white/70">{data.mode}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1">Date Finalized</span>
              <span className="text-sm font-medium text-slate-800 dark:text-white/70">
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
            <p className="text-xs text-slate-500 dark:text-white/40 break-all">
              <strong className="text-slate-700 dark:text-white/60">Draw ID:</strong> {drawId}
            </p>
          </div>
        </div>

        {/* Right: Winners */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3 dark:border-white/[0.06]">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Official Winners
            </h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal/15 text-teal dark:text-teal-light">
              {data.winners.length} total
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            {primaryWinners.map((w, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border bg-teal/5 border-teal/20 dark:bg-teal/10"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-teal/20 text-teal dark:text-teal-light">
                  {i + 1}
                </span>
                <span className="font-medium text-teal-dark dark:text-teal-light">
                  @{w.username}
                </span>
                <span className="ml-auto text-[10px] uppercase font-bold text-teal dark:text-teal-light/70 bg-teal/10 px-2 py-0.5 rounded">Primary</span>
              </div>
            ))}
            {secondaryWinners.map((w, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 border-slate-100 dark:bg-white/[0.02] dark:border-white/[0.04]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-slate-200 text-slate-500 dark:bg-white/[0.08] dark:text-white/40">
                  {primaryWinners.length + i + 1}
                </span>
                <span className="font-medium text-slate-700 dark:text-white/70">
                  @{w.username}
                </span>
                <span className="ml-auto text-[10px] uppercase font-bold text-slate-500 dark:text-white/40 bg-slate-100 dark:bg-white/[0.06] px-2 py-0.5 rounded">Secondary</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={copyUrl}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-light hover:shadow-teal-light/30"
            >
              {copied ? <FaCheck /> : <FaClipboard />}
              {copied ? 'Link Copied!' : 'Copy Verification Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
