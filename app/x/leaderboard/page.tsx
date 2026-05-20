'use client';

import { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa6';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/api';

function rankIcon(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}`;
}

function ShimmerCards() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="glass-card h-20 animate-shimmer rounded-2xl" />
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Leaderboard | FairGiveaway.online';
    getLeaderboard()
      .then(setEntries)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-text-bright mb-6 flex items-center gap-3">
        <FaTrophy className="text-yellow-400" /> X Giveaway Leaderboard
      </h1>

      {loading && <ShimmerCards />}

      {error && (
        <div className="glass-card p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-text-muted">No hosts on the leaderboard yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div
            key={entry._id}
            className={`glass-card p-5 flex items-center gap-4 hover:scale-[1.01] transition-all duration-300
              ${idx < 3 ? 'border border-teal/20' : ''}`}
          >
            <span className="text-2xl w-10 text-center shrink-0">{rankIcon(idx + 1)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-bright truncate">@{entry._id}</p>
              <div className="flex gap-4 text-xs text-text-muted mt-1">
                <span>{entry.totalGiveaways} giveaway{entry.totalGiveaways !== 1 ? 's' : ''}</span>
                <span>{entry.totalParticipants.toLocaleString()} total participants</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
