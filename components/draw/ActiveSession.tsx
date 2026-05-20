'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaDice, FaLock, FaCopy, FaTrophy, FaMedal } from 'react-icons/fa6';
import { selectWinners, type DrawResult } from '@/lib/fairDraw';
import { saveDraw, type DrawStatusResult } from '@/lib/api';

interface Props {
  drawId: string;
  data: DrawStatusResult;
  onFinalized: () => void;
}

function ParticipantList({ participants }: { participants: string[] }) {
  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-muted">Participants</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-teal/20 text-teal-light">
          {participants.length} loaded
        </span>
      </div>
      <div className="max-h-[200px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
        {participants.map((p) => (
          <span key={p} className="text-xs text-text-muted truncate px-2 py-1 rounded bg-white/5">
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
    <div className="glass-card p-6 mb-6 text-center">
      <p className="text-text-muted text-sm mb-3 flex items-center justify-center gap-2">
        <FaDice className="animate-spin" /> Rolling…
      </p>
      <div className="text-2xl font-bold text-teal-light animate-pulse-glow inline-block px-6 py-3 rounded-xl">
        @{displayName}
      </div>
    </div>
  );
}

function WinnerDisplay({ winners }: { winners: DrawResult }) {
  return (
    <div className="space-y-4 mb-6">
      <div className="glass-card p-5">
        <h3 className="font-semibold text-text-bright mb-3 flex items-center gap-2">
          <FaTrophy className="text-yellow-400" /> Primary Winners
        </h3>
        <div className="flex flex-wrap gap-2">
          {winners.primary.map((w) => (
            <span key={w} className="px-3 py-1.5 rounded-lg bg-teal/15 text-teal-light text-sm font-medium border border-teal/30">
              @{w}
            </span>
          ))}
        </div>
      </div>
      {winners.secondary.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-semibold text-text-muted mb-3 flex items-center gap-2">
            <FaMedal className="text-gray-400" /> Secondary (Backup) Winners
          </h3>
          <div className="flex flex-wrap gap-2">
            {winners.secondary.map((w) => (
              <span key={w} className="px-3 py-1.5 rounded-lg bg-white/5 text-text-muted text-sm border border-white/10">
                @{w}
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

  const maxWinners = participants.length;

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
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-text-bright">Draw Session</h1>
        <button
          onClick={() => navigator.clipboard.writeText(drawId)}
          className="text-xs px-2 py-1 rounded bg-white/5 text-text-muted hover:text-teal-light transition-colors flex items-center gap-1"
          title="Copy Draw ID"
        >
          {drawId.slice(0, 8)}… <FaCopy />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-text-muted">
        <span>Tweet: <span className="text-text-primary">{data.tweetId}</span></span>
        <span>Mode: <span className="text-teal-light capitalize">{data.mode}</span></span>
      </div>

      <ParticipantList participants={participants} />
      <SlotDisplay participants={participants} isRolling={isRolling} />

      {!winners && !isRolling && (
        <div className="glass-card p-6 mb-6">
          <h3 className="font-medium text-text-bright mb-4">Winner Configuration</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Primary Winners</label>
              <input
                type="number" min={1} max={maxWinners} value={primaryCount}
                onChange={(e) => setPrimaryCount(Math.max(1, +e.target.value))}
                className="w-full bg-white/5 border border-white/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Secondary (Backup)</label>
              <input
                type="number" min={0} max={maxWinners} value={secondaryCount}
                onChange={(e) => setSecondaryCount(Math.max(0, +e.target.value))}
                className="w-full bg-white/5 border border-white/10 focus:border-teal rounded-xl px-3 py-2 text-sm outline-none transition-colors"
              />
            </div>
          </div>
          <button onClick={handleRoll} disabled={isRolling} className="btn-teal w-full text-lg py-4 flex items-center justify-center gap-2">
            <FaDice /> Roll Fair Winners
          </button>
        </div>
      )}

      {winners && !isRolling && (
        <>
          <WinnerDisplay winners={winners} />
          <div className="glass-card p-6 mb-6">
            <label className="block text-sm text-text-muted mb-2">Host Username (required)</label>
            <input
              type="text" value={hostUsername}
              onChange={(e) => setHostUsername(e.target.value)}
              placeholder="@your_username"
              className="w-full bg-white/5 border border-white/10 focus:border-teal rounded-xl px-4 py-3 text-sm outline-none transition-colors mb-4 placeholder:text-text-muted/40"
            />
            <button onClick={handleFinalize} disabled={saving || !hostUsername.trim()} className="btn-teal w-full flex items-center justify-center gap-2">
              <FaLock /> {saving ? 'Saving…' : 'Finalize & Lock to Database'}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
