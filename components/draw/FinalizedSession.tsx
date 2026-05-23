'use client';

import { useState, useEffect } from 'react';
import { FaLock, FaClipboard, FaCheck, FaClockRotateLeft, FaCopy, FaQuoteRight, FaCommentDots } from 'react-icons/fa6';
import { type GiveawayDoc, getDrawsByTweetId } from '@/lib/api';
import Avatar from '../ui/Avatar';

function CopyableText({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 cursor-pointer group ${className}`}
      title="Click to copy"
    >
      <span className="break-all">{text}</span>
      <span className="shrink-0 text-textMuted group-hover:text-accentPrimary transition-colors">
        {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
      </span>
    </div>
  );
}

export default function FinalizedSession({ data, drawId }: { data: GiveawayDoc; drawId: string }) {
  const [copied, setCopied] = useState(false);
  const [pastDraws, setPastDraws] = useState<GiveawayDoc[]>([]);

  useEffect(() => {
    if (data.tweetId) {
      getDrawsByTweetId(data.tweetId).then((draws) => {
        setPastDraws(draws.filter((d) => d._id !== data._id));
      });
    }
  }, [data.tweetId, data._id]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateShareText = () => {
    const url = window.location.href;
    const primary = data.winners.filter(w => w.type === 'primary' && w.status !== 'failed');
    let text = `The giveaway winners have been drawn fairly using fairgiveaway.online! 🎯🎉\n\nVerified Winners:\n`;
    primary.forEach((w, i) => {
      text += `${i + 1}. @${w.username}\n`;
    });
    text += `\nCheck the full verification proof here: ${url}`;
    return encodeURIComponent(text);
  };

  const shareToXAsQuote = () => {
    const text = generateShareText();
    const quoteUrl = encodeURIComponent(`https://x.com/i/status/${data.tweetId}`);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${quoteUrl}`, '_blank');
  };

  const shareToXAsComment = () => {
    const text = generateShareText();
    window.open(`https://x.com/intent/tweet?in_reply_to=${data.tweetId}&text=${text}`, '_blank');
  };

  const primaryWinners = data.winners.filter(w => w.type === 'primary' && w.status !== 'failed');
  const secondaryWinners = data.winners.filter(w => w.type === 'secondary' && w.status !== 'failed');
  const rejectedUsers = data.winners.filter(w => w.status === 'failed');

  const hasNewFeatures = !!data.engagementTasks || !!data.antiBotFilters;
  const hasLegacyFeatures = data.enabledFeatures && data.enabledFeatures.length > 0;
  
  const hasEngagement = data.engagementTasks && (data.engagementTasks.mustLike || data.engagementTasks.mustComment || data.engagementTasks.mustFollow || data.engagementTasks.mustExternal);
  const hasAntiBot = data.antiBotFilters && (data.antiBotFilters.mustPfp || data.antiBotFilters.mustBio || data.antiBotFilters.mustAge || data.antiBotFilters.mustActivity);

  const featuresBoxContent = (
    <>
      <h3 className="text-xl font-bold text-textPrimary border-b border-borderSubtle pb-4 mb-6">
        Enabled Features & Filters
      </h3>
      {hasNewFeatures ? (
        <div className="flex flex-col gap-6">
          {hasEngagement && (
            <div>
              <span className="neo-label-sm mb-3 block">Engagement Tasks</span>
              <ul className="space-y-2 text-sm text-textSecondary">
                {data.engagementTasks?.mustLike && <li className="flex items-center gap-2"><FaCheck className="text-emerald-500" /> Must Like Target Post</li>}
                {data.engagementTasks?.mustComment && <li className="flex items-center gap-2"><FaCheck className="text-emerald-500" /> Must Comment</li>}
                {data.engagementTasks?.mustFollow && data.engagementTasks.followUsernames && data.engagementTasks.followUsernames.length > 0 && (
                  <li className="flex items-center gap-2"><FaCheck className="text-emerald-500" /> Follow: {data.engagementTasks.followUsernames.map(u => `@${u}`).join(', ')}</li>
                )}
                {data.engagementTasks?.mustExternal && data.engagementTasks.externalUrl && (
                  <li className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-emerald-500" /> External Post Interaction
                    </div>
                    <a href={data.engagementTasks.externalUrl} target="_blank" rel="noopener noreferrer" className="ml-6 text-xs font-semibold text-accentPrimary hover:underline break-all">
                      {data.engagementTasks.externalUrl}
                    </a>
                    <div className="ml-6 mt-0.5 flex flex-wrap gap-1.5">
                      {data.engagementTasks.extMustLike && <span className="text-[10px] uppercase font-bold bg-borderStrong text-textPrimary px-2 py-0.5 rounded">Like</span>}
                      {data.engagementTasks.extMustRepost && <span className="text-[10px] uppercase font-bold bg-borderStrong text-textPrimary px-2 py-0.5 rounded">Repost</span>}
                      {data.engagementTasks.extMustComment && <span className="text-[10px] uppercase font-bold bg-borderStrong text-textPrimary px-2 py-0.5 rounded">Comment</span>}
                      {data.engagementTasks.extMustQuote && <span className="text-[10px] uppercase font-bold bg-borderStrong text-textPrimary px-2 py-0.5 rounded">Quote</span>}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {hasEngagement && hasAntiBot && <hr className="border-borderSubtle" />}

          {hasAntiBot && (
            <div>
              <span className="neo-label-sm mb-3 block">Anti-Bot Filters</span>
              <ul className="space-y-2 text-sm text-textSecondary">
                {data.antiBotFilters?.mustPfp && <li className="flex items-center gap-2"><FaCheck className="text-emerald-500" /> Profile Picture & Banner</li>}
                {data.antiBotFilters?.mustBio && <li className="flex items-center gap-2"><FaCheck className="text-emerald-500" /> Custom Bio Text</li>}
                {data.antiBotFilters?.mustAge && <li className="flex items-center gap-2"><FaCheck className="text-emerald-500" /> Min. Account Age: {data.antiBotFilters.minMonths} months</li>}
                {data.antiBotFilters?.mustActivity && <li className="flex items-center gap-2"><FaCheck className="text-emerald-500" /> Min. Post Count: {data.antiBotFilters.minPosts} posts</li>}
              </ul>
            </div>
          )}
        </div>
      ) : hasLegacyFeatures ? (
        <div className="flex flex-wrap gap-2">
          {data.enabledFeatures!.map((feat, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-borderStrong text-textPrimary rounded-md">
              {feat}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-textSecondary italic">
          Host did not enable any additional features.
        </p>
      )}
    </>
  );

  const participantsBoxContent = (
    <>
      <h3 className="text-xl font-bold text-textPrimary border-b border-borderSubtle pb-4 mb-6">
        Participant Ledger
      </h3>
      {data.participants && data.participants.length > 0 && (
        <div className="mb-6">
          <span className="neo-label-sm mb-2 block">All Valid Participants</span>
          <div className="max-h-32 overflow-y-auto p-3 bg-bgElevated border border-borderSubtle rounded-lg flex flex-wrap gap-1.5 custom-scrollbar">
            {data.participants.map((p, i) => (
              <span key={i} className="text-[10px] font-mono text-textSecondary bg-bgBase border border-borderStrong px-1.5 py-0.5 rounded">
                @{p}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-textSecondary leading-snug">
        <strong className="text-textPrimary">Note:</strong> Only valid public accounts are accepted. Private accounts or those hidden by the X anti-spam system cannot be included.
      </p>
    </>
  );

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
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="mb-3 flex items-center justify-center text-xl text-accentPrimary">
          <FaLock />
        </div>
        <h2 className="text-xl font-bold text-textPrimary">
          Provably Fair & Locked
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          This draw has been finalized. Results are permanently recorded and cannot be altered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Info & Features */}
        <div className="flex flex-col gap-8">
          {/* Draw Details */}
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
                {data.hostUsername && !['unknown', 'Anonymous', 'simulated_user'].includes(data.hostUsername) && (
                  <Avatar username={data.hostUsername} src={data.hostAvatarUrl} size="sm" />
                )}
                <span className="text-sm font-semibold text-textPrimary">
                  {(!data.hostUsername || ['unknown', 'Anonymous', 'simulated_user'].includes(data.hostUsername)) ? 'Unknown' : `@${data.hostUsername}`}
                </span>
              </div>
            </div>
            <div>
              <span className="neo-label-sm mb-2 block">Mode</span>
              <span className="text-sm font-semibold capitalize text-textPrimary">{data.mode}</span>
            </div>
            <div>
              <span className="neo-label-sm mb-2 block">Participants</span>
              <span className="text-sm font-semibold text-textPrimary">
                {data.totalParticipants ? data.totalParticipants.toLocaleString() : data.winners.length}
              </span>
            </div>
            <div>
              <span className="neo-label-sm mb-2 block">Date Finalized</span>
              <span className="text-sm font-semibold text-textPrimary">
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-borderSubtle">
            <div className="text-xs font-mono text-textSecondary flex flex-col sm:flex-row sm:items-center gap-2">
              <strong className="text-textPrimary font-sans shrink-0">Draw ID:</strong> 
              <CopyableText text={drawId} className="hover:text-accentPrimary" />
            </div>
          </div>
        </div>

        {/* Enabled Features Box (Desktop Only) */}
        <div className="neo-card p-8 h-fit hidden md:block">
          {featuresBoxContent}
        </div>
        </div>

        {/* Right Column: Winners & Participants */}
        <div className="flex flex-col gap-8">
          {/* Official Winners */}
          <div className="neo-card p-8 h-fit">
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
                <Avatar username={w.username} src={w.avatarUrl} size="lg" />
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-lg text-textPrimary leading-tight">
                    @{w.username}
                  </span>
                  <span className="text-xs font-semibold text-accentPrimary flex items-center gap-1.5 mt-1.5 uppercase tracking-wide">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accentPrimary/20 text-[10px]">{i + 1}</span>
                    Primary Winner
                  </span>
                  {w.commentProofUrl && (
                    <a 
                      href={w.commentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 self-start bg-emerald-500/10 px-2 py-1 rounded-md transition-colors"
                    >
                      🔗 View Comment Proof
                    </a>
                  )}
                </div>
              </div>
            ))}
            {secondaryWinners.map((w, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-borderStrong bg-bgBase"
              >
                <Avatar username={w.username} src={w.avatarUrl} size="md" />
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-textSecondary leading-tight">
                    @{w.username}
                  </span>
                  <span className="text-[11px] font-semibold text-textMuted flex items-center gap-1.5 mt-1.5 uppercase tracking-wide">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-borderStrong text-[10px]">{primaryWinners.length + i + 1}</span>
                    Secondary
                  </span>
                  {w.commentProofUrl && (
                    <a 
                      href={w.commentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-[10px] font-bold text-emerald-500/70 hover:text-emerald-500 flex items-center gap-1 self-start transition-colors"
                    >
                      🔗 Comment Proof
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={shareToXAsQuote}
                className="neo-button-primary w-full h-14 text-sm gap-2 font-bold"
              >
                <FaQuoteRight /> Share to Quote
              </button>
              <button
                onClick={shareToXAsComment}
                className="neo-button-primary w-full h-14 text-sm gap-2 font-bold"
              >
                <FaCommentDots /> Share as Comment
              </button>
            </div>
            <button
              onClick={copyUrl}
              className="neo-button-primary w-full h-14 gap-2 bg-transparent border-2 border-borderStrong text-textPrimary hover:border-accentPrimary hover:text-accentPrimary hover:bg-bgBase shadow-none"
            >
              {copied ? <FaCheck /> : <FaClipboard />}
              {copied ? 'Link Copied!' : 'Copy Verification Link'}
            </button>
          </div>
        </div>
        
        {/* Participants Box (Desktop Only) */}
        <div className="neo-card p-8 h-fit hidden md:block">
          {participantsBoxContent}
        </div>
      </div>
      </div>

      {/* Rejected Users */}
      {rejectedUsers.length > 0 && (
        <div className="neo-card p-8 mb-8 border-red-500/30">
          <div className="flex items-center justify-between mb-6 border-b border-borderSubtle pb-4">
            <h3 className="text-xl font-bold text-textPrimary flex items-center gap-2">
              <span className="text-red-500">✕</span> Rejected Candidates
            </h3>
            <span className="text-xs uppercase font-bold px-3 py-1.5 rounded-full bg-red-500/15 text-red-500">
              {rejectedUsers.length} total
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto md:max-h-none md:overflow-visible pr-2 md:pr-0 styled-scrollbar">
            {rejectedUsers.map((w, i) => (
              <div 
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl border border-red-500/30 bg-red-500/5 opacity-80"
              >
                <Avatar username={w.username} src={w.avatarUrl} size="md" />
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-textSecondary leading-tight line-through">
                    @{w.username}
                  </span>
                  <div className="mt-2 text-xs font-medium text-red-500/80 bg-red-500/10 px-2 py-1.5 rounded-md inline-block">
                    <span className="block text-[10px] uppercase tracking-wider mb-0.5 opacity-80">Reason for rejection</span>
                    {w.failReason || "Failed Verification"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enabled Features Box (Mobile Only) */}
      <div className="neo-card p-8 h-fit block md:hidden mb-8">
        {featuresBoxContent}
      </div>

      {/* Participants Box (Mobile Only) */}
      <div className="neo-card p-8 h-fit block md:hidden mb-8">
        {participantsBoxContent}
      </div>

      {/* Tip Section */}
      <div className="neo-card p-8 mb-8 text-center border-accentPrimary/30 bg-accentPrimary/5">
        <h3 className="text-xl font-bold text-textPrimary mb-4 tracking-wider uppercase">
          THANK YOU FOR USING FAIRGIVEAWAY!
        </h3>
        <p className="text-sm text-textSecondary mb-6 max-w-xl mx-auto">
          If you found this tool helpful for running your giveaway, consider leaving a tip. Your support keeps the platform provably fair and free for everyone!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex flex-col items-center p-4 bg-bgBase border border-borderStrong rounded-xl w-full sm:w-auto hover:border-accentPrimary/50 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-textMuted mb-2">EVM Address</span>
            <CopyableText text="0x6e9b40a8fe85e7dcff40cfc9aa526106fe8e0546" className="text-xs font-mono text-accentPrimary" />
          </div>
          <div className="flex flex-col items-center p-4 bg-bgBase border border-borderStrong rounded-xl w-full sm:w-auto hover:border-accentPrimary/50 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Solana Address</span>
            <CopyableText text="AnBiWNPW68djMF6ERBpueF8tWmcvHr6iCYzriXwGh9k6" className="text-xs font-mono text-accentPrimary" />
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
                  Winners: {past.winners.filter(w => w.status !== 'failed').map(w => `@${w.username}`).join(', ')}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
