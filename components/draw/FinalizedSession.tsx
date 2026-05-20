'use client';

import { FaLock, FaTrophy, FaMedal, FaLink } from 'react-icons/fa6';
import type { GiveawayDoc } from '@/lib/api';

interface Props {
  data: GiveawayDoc;
  drawId: string;
}

export default function FinalizedSession({ data, drawId }: Props) {
  const primaryWinners = data.winners.filter((w) => w.type === 'primary');
  const secondaryWinners = data.winners.filter((w) => w.type === 'secondary');
  const drawUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/x/draw/${drawId}`
    : '';

  function copyUrl() {
    navigator.clipboard.writeText(drawUrl);
  }

  return (
    <div className="animate-fade-in">
      <div className="rounded-2xl bg-teal/10 border border-teal/30 p-4 mb-8 text-center">
        <p className="text-teal-light font-semibold text-lg flex items-center justify-center gap-2">
          <FaLock /> PROVABLY FAIR & LOCKED
        </p>
        <p className="text-text-muted text-xs mt-1">
          This draw is permanently recorded and cannot be modified.
        </p>
      </div>

      <div className="text-sm text-text-muted mb-6">
        {data.createdAt && (
          <p className="mb-1">
            Drawn: {new Date(data.createdAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="glass-card p-5 mb-6">
        <h3 className="font-medium text-text-bright mb-3">Draw Info</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-text-muted">Draw ID:</span>
            <p className="text-text-primary text-xs break-all">{drawId}</p>
          </div>
          <div>
            <span className="text-text-muted">Tweet ID:</span>
            <p className="text-text-primary">{data.tweetId}</p>
          </div>
          <div>
            <span className="text-text-muted">Mode:</span>
            <p className="text-teal-light capitalize">{data.mode}</p>
          </div>
          <div>
            <span className="text-text-muted">Host:</span>
            <p className="text-text-primary">@{data.hostUsername}</p>
          </div>
          <div>
            <span className="text-text-muted">Participants:</span>
            <p className="text-text-primary">{data.totalParticipants}</p>
          </div>
        </div>
      </div>

      {primaryWinners.length > 0 && (
        <div className="glass-card p-5 mb-4">
          <h3 className="font-semibold text-text-bright mb-3 flex items-center gap-2">
            <FaTrophy className="text-yellow-400" /> Primary Winners
          </h3>
          <div className="flex flex-wrap gap-2">
            {primaryWinners.map((w) => (
              <span key={w.username} className="px-3 py-1.5 rounded-lg bg-teal/15 text-teal-light text-sm font-medium border border-teal/30">
                @{w.username}
              </span>
            ))}
          </div>
        </div>
      )}

      {secondaryWinners.length > 0 && (
        <div className="glass-card p-5 mb-4">
          <h3 className="font-semibold text-text-muted mb-3 flex items-center gap-2">
            <FaMedal className="text-gray-400" /> Secondary (Backup) Winners
          </h3>
          <div className="flex flex-wrap gap-2">
            {secondaryWinners.map((w) => (
              <span key={w.username} className="px-3 py-1.5 rounded-lg bg-white/5 text-text-muted text-sm border border-white/10">
                @{w.username}
              </span>
            ))}
          </div>
        </div>
      )}

      <button onClick={copyUrl} className="btn-teal mt-4 flex items-center gap-2">
        <FaLink /> Copy Draw URL
      </button>
    </div>
  );
}
