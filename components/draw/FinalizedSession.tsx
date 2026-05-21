'use client';

import { useState, useEffect } from 'react';
import { FaLock, FaClipboard, FaCheck, FaXTwitter, FaClockRotateLeft } from 'react-icons/fa6';
import { type GiveawayDoc, getDrawsByTweetId } from '@/lib/api';

export default function FinalizedSession({ data, drawId }: { data: GiveawayDoc; drawId: string }) {
  const [copied, setCopied] = useState(false);
  const [pastDraws, setPastDraws] = useState<GiveawayDoc[]>([]);

  useEffect(() => {
    // Fetch past draws for the same tweet to enable transparency auditing
    if (data.tweetId) {
      getDrawsByTweetId(data.tweetId).then((draws) => {
        // Exclude the current draw from the list
        setPastDraws(draws.filter((d) => d._id !== data._id));
      });
    }
  }, [data.tweetId, data._id]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToX = () => {
    const url = window.location.href;
    const primary = data.winners.filter(w => w.type === 'primary');
    
    let text = `The giveaway winners have been drawn fairly using fairgiveaway.online! 🎯🎉\n\nVerified Winners:\n`;
    primary.forEach((w, i) => {
      text += `${i + 1}. @${w.username}\n`;
    });
    text += `\nCheck the full verification proof here: ${url}`;
    
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const primaryWinners = data.winners.filter(w => w.type === 'primary');
  const secondaryWinners = data.winners.filter(w => w.type === 'secondary');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Anti-Cheat Banner */}
      {pastDraws.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-400 font-medium text-sm flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <strong>Notice for Participants:</strong> This post has been drawn {pastDraws.length} time(s) previously. Scroll down to verify past draw history.
          </div>
        </div>
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
              <div className="flex items-center gap-2">
                {data.hostUsername && data.hostUsername !== 'Anonymous' && (
                  <img src={`https://unavatar.io/twitter/${data.hostUsername}`} alt={data.hostUsername} className="w-6 h-6 rounded-full object-cover border border-borderStrong bg-bgElevated" />
                )}
                <span className="text-sm font-semibold text-textPrimary">
                  {data.hostUsername === 'Anonymous' ? 'Anonymous Host' : `@${data.hostUsername}`}
                </span>
              </div>
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
                <img src={`https://unavatar.io/twitter/${w.username}`} alt={w.username} className="w-12 h-12 rounded-full object-cover border-2 border-bgBase bg-bgElevated shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-textPrimary leading-tight">
                    @{w.username}
                  </span>
                  <span className="text-xs font-semibold text-accentPrimary flex items-center gap-1.5 mt-1.5 uppercase tracking-wide">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accentPrimary/20 text-[10px]">{i + 1}</span>
                    Primary Winner
                  </span>
                </div>
              </div>
            ))}
            {secondaryWinners.map((w, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-borderStrong bg-bgBase"
              >
                <img src={`https://unavatar.io/twitter/${w.username}`} alt={w.username} className="w-10 h-10 rounded-full object-cover border-2 border-bgElevated bg-bgBase shrink-0 opacity-80" />
                <div className="flex flex-col">
                  <span className="font-semibold text-textSecondary leading-tight">
                    @{w.username}
                  </span>
                  <span className="text-[11px] font-semibold text-textMuted flex items-center gap-1.5 mt-1.5 uppercase tracking-wide">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-borderStrong text-[10px]">{primaryWinners.length + i + 1}</span>
                    Secondary
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={shareToX}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
            >
              <FaXTwitter /> Share Results to X
            </button>
            <button
              onClick={copyUrl}
              className="neo-button-primary w-full h-14 gap-2 bg-transparent border-2 border-borderStrong text-textPrimary hover:border-accentPrimary hover:text-accentPrimary hover:bg-bgBase shadow-none"
            >
              {copied ? <FaCheck /> : <FaClipboard />}
              {copied ? 'Link Copied!' : 'Copy Verification Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Past Draw Logs */}
      {pastDraws.length > 0 && (
        <div className="neo-card p-8 mt-8 border-amber-500/30">
          <h3 className="text-xl font-bold text-textPrimary border-b border-borderSubtle pb-4 flex items-center gap-2 mb-6">
            <FaClockRotateLeft className="text-amber-500" /> Past Draw Logs for this Post
          </h3>
          <div className="space-y-4">
            {pastDraws.map(past => (
              <a 
                key={past._id} 
                href={`/history/x/${past._id}`}
                className="block p-4 rounded-xl border border-borderStrong bg-bgBase hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-textPrimary">Draw: {past._id.slice(0, 8)}</span>
                  <span className="text-xs text-textSecondary">{new Date(past.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-xs text-textSecondary truncate">
                  Winners: {past.winners.map(w => `@${w.username}`).join(', ')}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
