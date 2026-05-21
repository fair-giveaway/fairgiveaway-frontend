'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaCopy, FaDice, FaLock, FaMedal, FaTrophy, FaUserGroup, FaXTwitter, FaCheck } from 'react-icons/fa6';
import { selectWinners, type DrawResult } from '@/lib/fairDraw';
import { saveDraw, type DrawStatusResult } from '@/lib/api';

interface Props {
  drawId: string;
  data: DrawStatusResult;
  onFinalized: () => void;
}

function ParticipantList({ participants }: { participants: string[] }) {
  return (
    <div className="h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
      <div className="flex flex-wrap gap-2">
        {participants.map((p, i) => (
          <span key={i} className="text-xs text-slate-600 dark:text-white/50 truncate px-2 py-1 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.02]">
            @{p}
          </span>
        ))}
      </div>
    </div>
  );
}

function SlotDisplay({ participants, isRolling }: { participants: string[]; isRolling: boolean }) {
  const [displayName, setDisplayName] = useState(participants[0] || '');

  useEffect(() => {
    if (!isRolling || participants.length === 0) return;

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * participants.length);
      setDisplayName(participants[idx]);
    }, 60);

    return () => clearInterval(interval);
  }, [isRolling, participants]);

  if (!isRolling) return null;

  return (
    <div className="flex flex-col h-32 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none relative mb-6">
      <p className="text-slate-500 dark:text-white/40 text-sm mb-3 flex items-center justify-center gap-2">
        <FaDice className="animate-spin text-teal dark:text-teal-light" /> Rolling…
      </p>
      <div className="text-2xl font-bold text-teal dark:text-teal-light animate-subtle-glow">
        @{displayName}
      </div>
    </div>
  );
}

function WinnerDisplay({ winners }: { winners: DrawResult }) {
  return (
    <div className="space-y-4 mb-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <FaTrophy className="text-yellow-400" /> Primary Winners
        </h3>
        <div className="flex flex-wrap gap-2">
          {winners.primary.map((w, i) => (
            <span
              key={w}
              className="px-3 py-1.5 rounded-lg bg-teal/10 text-teal dark:text-teal-light text-sm font-medium border border-teal/25"
            >
              {i + 1}. @{w}
            </span>
          ))}
        </div>
      </div>
      {winners.secondary.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FaMedal className="text-slate-400 dark:text-slate-500" /> Secondary (Backup) Winners
          </h3>
          <div className="flex flex-wrap gap-2">
            {winners.secondary.map((w, i) => (
              <span
                key={w}
                className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 dark:bg-white/[0.04] dark:text-white/50 text-sm border border-slate-200 dark:border-white/10"
              >
                {i + 1}. @{w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActiveSession({ drawId, data, onFinalized }: Props) {
  const participants = data.participants || [];
  const [primaryCount, setPrimaryCount] = useState(1);
  const [secondaryCount, setSecondaryCount] = useState(0);
  const [winners, setWinners] = useState<DrawResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hostUsername, setHostUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const maxWinners = participants.length;

  const copyUrl = () => {
    navigator.clipboard.writeText(drawId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoll = useCallback(() => {
    if (primaryCount + secondaryCount > maxWinners) {
      setError('Total winners exceed participant count.');
      return;
    }
    setError('');
    setIsRolling(true);
    setWinners(null);

    setTimeout(() => {
      const result = selectWinners(participants, primaryCount, secondaryCount);
      setWinners(result);
      setIsRolling(false);
    }, 4000);
  }, [participants, primaryCount, secondaryCount, maxWinners]);

  async function handleFinalize() {
    if (!winners || !hostUsername.trim()) {
      setError('Please enter the host username before finalizing.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const allWinners = [
        ...winners.primary.map((u) => ({ username: u, type: 'primary', status: 'verified' })),
        ...winners.secondary.map((u) => ({ username: u, type: 'secondary', status: 'verified' })),
      ];
      await saveDraw({
        drawId,
        tweetId: data.tweetId || '',
        hostUsername: hostUsername.trim(),
        mode: data.mode || 'likes',
        totalParticipants: participants.length,
        winners: allWinners,
      });
      onFinalized();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
      {/* Left: Metadata & Participants */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaXTwitter /> Draw Session
            </h2>
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/50 hover:border-teal/30 hover:text-teal dark:hover:text-teal-light transition-colors"
              title="Copy Draw ID"
            >
              {drawId.slice(0, 8)}… {copied ? <FaCheck className="text-teal" /> : <FaCopy />}
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 dark:text-white/40 mb-1 block uppercase tracking-wider">Target Tweet</span>
              <a href={`https://x.com/i/status/${data.tweetId}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-teal hover:underline break-all">
                {data.tweetId}
              </a>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-white/40 mb-1 block uppercase tracking-wider">Mode</span>
              <span className="text-sm font-medium capitalize text-slate-700 dark:text-white/70">{data.mode}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
          <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2"><FaUserGroup /> Eligible Entries</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal/15 text-teal font-medium dark:text-teal-light">
              {participants.length}
            </span>
          </h3>
          <ParticipantList participants={participants} />
        </div>
      </div>

      {/* Right: Roll Controller */}
      <div className="lg:col-span-8">
        <SlotDisplay participants={participants} isRolling={isRolling} />

        {!winners && !isRolling && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-white/[0.06]">
              Winner Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-600 dark:text-white/50 mb-1.5 font-medium">Primary Winners</label>
                <input
                  type="number" min={1} max={maxWinners} value={primaryCount}
                  onChange={(e) => setPrimaryCount(Math.max(1, +e.target.value))}
                  className="w-full bg-white border border-slate-200 focus:border-teal rounded-xl px-4 py-3 text-sm outline-none transition-colors text-slate-900 dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-white/50 mb-1.5 font-medium">Secondary (Backup)</label>
                <input
                  type="number" min={0} max={maxWinners} value={secondaryCount}
                  onChange={(e) => setSecondaryCount(Math.max(0, +e.target.value))}
                  className="w-full bg-white border border-slate-200 focus:border-teal rounded-xl px-4 py-3 text-sm outline-none transition-colors text-slate-900 dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-white"
                />
              </div>
            </div>
            <button onClick={handleRoll} disabled={isRolling || participants.length === 0} className="rounded-xl bg-teal w-full text-lg py-4 text-white font-semibold shadow-lg shadow-teal/20 hover:bg-teal-light hover:shadow-teal-light/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <FaDice /> Roll Fair Winners
            </button>
          </div>
        )}

        {winners && !isRolling && (
          <>
            <WinnerDisplay winners={winners} />
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                Finalize Details
              </h3>
              <label className="block text-sm text-slate-600 dark:text-white/50 mb-1.5 font-medium">Host Username (required)</label>
              <input
                type="text" value={hostUsername}
                onChange={(e) => setHostUsername(e.target.value)}
                placeholder="@your_username"
                className="w-full bg-white border border-slate-200 focus:border-teal rounded-xl px-4 py-3 text-sm outline-none transition-colors text-slate-900 dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-white mb-6 placeholder:text-slate-400 dark:placeholder:text-white/25"
              />
              <button onClick={handleFinalize} disabled={saving || !hostUsername.trim()} className="rounded-xl bg-teal w-full text-lg py-4 text-white font-semibold shadow-lg shadow-teal/20 hover:bg-teal-light hover:shadow-teal-light/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <FaLock /> {saving ? 'Saving…' : 'Finalize & Lock to Database'}
              </button>
            </div>
          </>
        )}

        {error && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );
}
