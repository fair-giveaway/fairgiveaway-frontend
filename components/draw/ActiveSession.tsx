'use client';

import { useState, useCallback } from 'react';
import {
  FaCopy, FaCheck, FaUserGroup, FaDice,
  FaTrophy,
} from 'react-icons/fa6';
import { type DrawStatusResult } from '@/lib/api';
import { type Phase, type VerifyStep } from './types';
import ParticipantList from './ParticipantList';
import ConfigurationPhase from './ConfigurationPhase';
import VerificationPhase from './VerificationPhase';
import { useVerification } from './useVerification';
import Stepper from '../ui/Stepper';

interface Props {
  drawId: string;
  data: DrawStatusResult;
  onFinalized: () => void;
}

export default function ActiveSession({ drawId, data }: Props) {
  const participants = data.participants || [];
  const maxWinners = participants.length;

  const [phase, setPhase] = useState<Phase>('configure');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [primaryCount, setPrimaryCount] = useState(1);
  const [secondaryCount, setSecondaryCount] = useState(0);

  const [mustLike, setMustLike] = useState(false);
  const [mustComment, setMustComment] = useState(false);
  const [mustFollow, setMustFollow] = useState(false);
  const [followUsernames, setFollowUsernames] = useState<string[]>(['']);
  const [mustExternal, setMustExternal] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [extMustLike, setExtMustLike] = useState(false);
  const [extMustRepost, setExtMustRepost] = useState(false);
  const [extMustComment, setExtMustComment] = useState(false);
  const [extMustQuote, setExtMustQuote] = useState(false);
  const [mustPfp, setMustPfp] = useState(false);
  const [mustBio, setMustBio] = useState(false);
  const [mustAge, setMustAge] = useState(false);
  const [minMonths, setMinMonths] = useState(3);
  const [mustActivity, setMustActivity] = useState(false);
  const [minPosts, setMinPosts] = useState(10);

  const copyUrl = () => {
    navigator.clipboard.writeText(drawId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildSteps = useCallback((): VerifyStep[] => {
    const steps: VerifyStep[] = [];
    
    // 1. Anti-Bot Filters First
    if (mustPfp) steps.push({ label: 'PFP & Banner', status: 'pending' });
    if (mustBio) steps.push({ label: 'Bio text', status: 'pending' });
    if (mustAge) steps.push({ label: 'Account age', status: 'pending' });
    if (mustActivity) steps.push({ label: 'Post count', status: 'pending' });

    // 2. Engagement Tasks
    if (mustLike) steps.push({ label: 'Checking Like...', status: 'pending' });
    if (mustComment) steps.push({ label: 'Checking Comment...', status: 'pending' });
    if (mustExternal && externalUrl.trim()) {
      if (extMustLike) steps.push({ label: 'External Like', status: 'pending' });
      if (extMustRepost) steps.push({ label: 'External Repost', status: 'pending' });
      if (extMustComment) steps.push({ label: 'External Comment', status: 'pending' });
      if (extMustQuote) steps.push({ label: 'External Quote', status: 'pending' });
      if (!extMustLike && !extMustRepost && !extMustComment && !extMustQuote) {
        steps.push({ label: 'External interaction', status: 'pending' });
      }
    }
    
    return steps;
  }, [mustLike, mustComment, mustExternal, externalUrl, extMustLike, extMustRepost, extMustComment, extMustQuote, mustPfp, mustBio, mustAge, mustActivity]);

  const configState = {
    mustLike, mustComment, mustFollow, followUsernames,
    mustExternal, externalUrl, extMustLike, extMustRepost, extMustComment, extMustQuote,
    mustPfp, mustBio, mustAge, minMonths, mustActivity, minPosts
  };

  const { slots, saving, handleRoll } = useVerification({
    drawId, data, primaryCount, secondaryCount, buildSteps, setPhase, setError, phase, configState,
  });

  const configProps = {
    mustLike, setMustLike, mustComment, setMustComment,
    mustFollow, setMustFollow, followUsernames, setFollowUsernames,
    mustExternal, setMustExternal, externalUrl, setExternalUrl,
    extMustLike, setExtMustLike, extMustRepost, setExtMustRepost,
    extMustComment, setExtMustComment, extMustQuote, setExtMustQuote,
    mustPfp, setMustPfp, mustBio, setMustBio,
    mustAge, setMustAge, minMonths, setMinMonths,
    mustActivity, setMustActivity, minPosts, setMinPosts,
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accentPrimary/10 text-accentPrimary text-xs font-bold uppercase tracking-widest border border-accentPrimary/20">
            <span className="inline-flex h-2 w-2 rounded-full bg-accentPrimary" />
            Live
          </div>
          <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">Draw Workstation</h1>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-bgElevated text-accentPrimary font-mono px-2.5 py-1 rounded-lg border border-borderStrong">
            {drawId.slice(0, 8)}…
          </code>
          <button onClick={copyUrl} className="p-1.5 rounded-lg bg-bgElevated border border-borderStrong text-textSecondary hover:text-textPrimary hover:border-accentPrimary transition-colors" title="Copy ID">
            {copied ? <FaCheck className="text-emerald-400 text-xs" /> : <FaCopy className="text-xs" />}
          </button>
        </div>
      </div>

      {/* Two-column dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left sidebar */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Participant pool */}
          <div className="neo-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                <FaUserGroup className="text-accentPrimary text-xs" /> Participants
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-bgBase border border-borderSubtle text-xs font-bold text-textPrimary">
                {participants.length}
              </span>
            </div>
            <ParticipantList participants={participants} />
          </div>

          {/* Winner config + Roll button */}
          {phase === 'configure' && (
            <div className="neo-card p-5">
              <h3 className="text-sm font-bold text-textPrimary mb-4 flex items-center gap-2">
                <FaTrophy className="text-accentPrimary text-xs" /> Winners
              </h3>
              <div className="space-y-4 mb-5">
                <Stepper label="Primary" value={primaryCount} min={1} max={maxWinners} onChange={setPrimaryCount} />
                <Stepper label="Backup" value={secondaryCount} min={0} max={maxWinners} onChange={setSecondaryCount} />
              </div>
              <button onClick={handleRoll} disabled={participants.length === 0} className="neo-button-primary w-full h-12 text-sm flex items-center justify-center gap-2 font-bold">
                <FaDice /> Roll Fair Winners
              </button>
              {error && <p className="mt-3 text-red-500 font-medium text-xs">{error}</p>}
            </div>
          )}
        </div>

        {/* Right main area */}
        <div className="lg:col-span-8">
          {phase === 'configure' && (
            <div className="neo-card p-5">
              <ConfigurationPhase {...configProps} />
            </div>
          )}
          {phase !== 'configure' && (
            <div className="mb-5 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium flex items-center gap-3 animate-fade-in">
              <span className="text-lg">⚠️</span>
              Please do not exit or refresh this page. Doing so will interrupt the live session and the verification process will need to be restarted.
            </div>
          )}
          <VerificationPhase phase={phase} slots={slots} primaryCount={primaryCount} saving={saving} participants={participants} />
          {phase !== 'configure' && error && <p className="mt-4 text-red-500 font-medium text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
