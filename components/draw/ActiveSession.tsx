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
    <div className="h-48 overflow-y-auto rounded-xl border border-borderStrong bg-bgBase p-4 shadow-inner">
      <div className="flex flex-wrap gap-2">
        {participants.map((p, i) => (
          <span key={i} className="text-xs text-textSecondary truncate px-2 py-1 rounded-lg bg-bgElevated border border-borderSubtle">
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
    <div className="flex flex-col h-32 items-center justify-center overflow-hidden rounded-xl border border-borderStrong bg-bgBase relative mb-6">
      <p className="text-textSecondary text-sm mb-3 flex items-center justify-center gap-2">
        <FaDice className="animate-spin text-accentPrimary" /> Rolling…
      </p>
      <div className="text-3xl font-bold text-accentPrimary">
        @{displayName}
      </div>
    </div>
  );
}

function WinnerDisplay({ winners }: { winners: DrawResult }) {
  return (
    <div className="space-y-4 mb-6">
      <div className="neo-card p-6">
        <h3 className="mb-4 text-sm font-bold text-textPrimary flex items-center gap-2">
          <FaTrophy className="text-[#fbbf24]" /> Primary Winners
        </h3>
        <div className="flex flex-wrap gap-2">
          {winners.primary.map((w, i) => (
            <span
              key={w}
              className="px-3 py-1.5 rounded-lg bg-accentPrimary/10 text-accentPrimary text-sm font-bold border border-accentPrimary/30"
            >
              {i + 1}. @{w}
            </span>
          ))}
        </div>
      </div>
      {winners.secondary.length > 0 && (
        <div className="neo-card p-6">
          <h3 className="mb-4 text-sm font-bold text-textPrimary flex items-center gap-2">
            <FaMedal className="text-textMuted" /> Secondary (Backup) Winners
          </h3>
          <div className="flex flex-wrap gap-2">
            {winners.secondary.map((w, i) => (
              <span
                key={w}
                className="px-3 py-1.5 rounded-lg bg-bgBase text-textSecondary text-sm font-semibold border border-borderStrong"
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
        <div className="neo-card p-6">
          <div className="flex items-center justify-between mb-6 border-b border-borderSubtle pb-4">
            <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2">
              <FaXTwitter className="text-accentPrimary" /> Draw Session
            </h2>
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 rounded-lg border border-borderStrong bg-bgBase px-3 py-1.5 text-xs font-semibold text-textSecondary hover:border-accentPrimary hover:text-accentPrimary transition-colors"
              title="Copy Draw ID"
            >
              {drawId.slice(0, 8)}… {copied ? <FaCheck className="text-accentPrimary" /> : <FaCopy />}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <span className="neo-label-sm mb-1 block">Target Tweet</span>
              <a href={`https://x.com/i/status/${data.tweetId}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accentPrimary hover:underline break-all">
                {data.tweetId}
              </a>
            </div>
            <div>
              <span className="neo-label-sm mb-1 block">Mode</span>
              <span className="text-sm font-semibold capitalize text-textPrimary">{data.mode}</span>
            </div>
          </div>
        </div>

        <div className="neo-card p-6">
          <h3 className="mb-4 flex items-center justify-between text-sm font-bold text-textPrimary">
            <span className="flex items-center gap-2"><FaUserGroup className="text-textMuted" /> Eligible Entries</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-accentPrimary/15 text-accentPrimary font-bold border border-accentPrimary/30">
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
          <div className="neo-card p-8">
            <h3 className="mb-6 text-xl font-bold text-textPrimary border-b border-borderSubtle pb-4">
              Winner Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2">Primary Winners</label>
                <input
                  type="number" min={1} max={maxWinners} value={primaryCount}
                  onChange={(e) => setPrimaryCount(Math.max(1, +e.target.value))}
                  className="neo-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2">Secondary (Backup)</label>
                <input
                  type="number" min={0} max={maxWinners} value={secondaryCount}
                  onChange={(e) => setSecondaryCount(Math.max(0, +e.target.value))}
                  className="neo-input"
                />
              </div>
            </div>
            <button onClick={handleRoll} disabled={isRolling || participants.length === 0} className="neo-button-primary w-full h-14 text-lg flex items-center justify-center gap-2">
              <FaDice /> Roll Fair Winners
            </button>
          </div>
        )}

        {winners && !isRolling && (
          <>
            <WinnerDisplay winners={winners} />
            <div className="neo-card p-8">
              <h3 className="mb-6 text-xl font-bold text-textPrimary border-b border-borderSubtle pb-4">
                Finalize Details
              </h3>
              <label className="block text-sm font-semibold text-textSecondary mb-2">Host Username (required)</label>
              <input
                type="text" value={hostUsername}
                onChange={(e) => setHostUsername(e.target.value)}
                placeholder="@your_username"
                className="neo-input mb-8"
              />
              <button onClick={handleFinalize} disabled={saving || !hostUsername.trim()} className="neo-button-primary w-full h-14 text-lg flex items-center justify-center gap-2">
                <FaLock /> {saving ? 'Saving…' : 'Finalize & Lock to Database'}
              </button>
            </div>
          </>
        )}

        {error && <p className="mt-4 text-red-500 font-medium text-sm">{error}</p>}
      </div>
    </div>
  );
}
