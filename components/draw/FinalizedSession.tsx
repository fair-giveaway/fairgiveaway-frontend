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
      <div className="mb-12 rounded-2xl border border-accentPrimary/30 bg-accentPrimary/5 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-accentPrimary/5 blur-[50px] pointer-events-none" />
        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accentPrimary/10 text-2xl text-accentPrimary">
            <FaLock />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary">
            Provably Fair & Locked
          </h2>
          <p className="mt-2 text-textSecondary font-medium">
            This draw has been finalized. The results are permanently recorded and cannot be altered.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Info */}
        <div className="neo-card p-8 space-y-6">
          <h3 className="text-xl font-bold text-textPrimary border-b border-borderSubtle pb-4">
            Draw Details
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="neo-label-sm mb-2 block">Target Tweet</span>
              <a href={`https://x.com/i/status/${data.tweetId}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accentPrimary hover:underline break-all">
                {data.tweetId}
              </a>
            </div>
            <div>
              <span className="neo-label-sm mb-2 block">Host</span>
              <span className="text-sm font-semibold text-textPrimary">@{data.hostUsername || 'Unknown'}</span>
            </div>
            <div>
              <span className="neo-label-sm mb-2 block">Mode</span>
              <span className="text-sm font-semibold capitalize text-textPrimary">{data.mode}</span>
            </div>
            <div>
              <span className="neo-label-sm mb-2 block">Date Finalized</span>
              <span className="text-sm font-semibold text-textPrimary">
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-borderSubtle">
            <p className="text-xs font-mono text-textSecondary break-all">
              <strong className="text-textPrimary font-sans">Draw ID:</strong> {drawId}
            </p>
          </div>
        </div>

        {/* Right: Winners */}
        <div className="neo-card p-8">
          <div className="flex items-center justify-between mb-6 border-b border-borderSubtle pb-4">
            <h3 className="text-xl font-bold text-textPrimary">
              Official Winners
            </h3>
            <span className="text-xs uppercase font-bold px-3 py-1.5 rounded-full bg-accentPrimary/15 text-accentPrimary">
              {data.winners.length} total
            </span>
          </div>
          
          <div className="flex flex-col gap-4">
            {primaryWinners.map((w, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-accentPrimary/30 bg-accentPrimary/5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold bg-accentPrimary/20 text-accentPrimary">
                  {i + 1}
                </span>
                <span className="font-bold text-lg text-textPrimary">
                  @{w.username}
                </span>
                <span className="ml-auto neo-label-sm text-accentPrimary">Primary</span>
              </div>
            ))}
            {secondaryWinners.map((w, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-borderStrong bg-bgBase"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold bg-bgElevated border border-borderStrong text-textSecondary">
                  {primaryWinners.length + i + 1}
                </span>
                <span className="font-semibold text-textSecondary">
                  @{w.username}
                </span>
                <span className="ml-auto neo-label-sm text-textMuted">Secondary</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={copyUrl}
              className="neo-button-primary w-full h-14 gap-2"
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
