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
        <div key={i} className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] h-20 animate-shimmer" />
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
    <div className="animate-fade-in-up">
      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80 flex items-center gap-2">
          <FaTrophy /> Rankings
        </p>
        <h1 className="pb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Top X Hosts
        </h1>
      </header>

      {loading && <ShimmerCards />}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 p-6 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] p-8 text-center">
          <p className="text-slate-500 dark:text-white/45">No hosts on the leaderboard yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div
            key={entry._id}
            className={`flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 dark:bg-white/[0.02] dark:shadow-none
              ${idx < 3 ? 'border-l-4 border-l-teal/60 border-y-slate-200 border-r-slate-200 dark:border-y-white/[0.08] dark:border-r-white/[0.08]' : 'border-slate-200 dark:border-white/[0.08]'}`}
            style={{ animationDelay: `${0.05 * idx}s` }}
          >
            <span className={`text-2xl w-10 text-center shrink-0 ${idx > 2 ? 'text-slate-400 dark:text-white/20 font-bold text-lg' : ''}`}>
              {rankIcon(idx + 1)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">@{entry._id}</p>
              <div className="flex gap-4 text-xs text-slate-500 dark:text-white/40 mt-1.5">
                <span className="flex items-center gap-1"><span className="text-slate-700 dark:text-white/70 font-medium">{entry.totalGiveaways}</span> giveaway{entry.totalGiveaways !== 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1"><span className="text-slate-700 dark:text-white/70 font-medium">{entry.totalParticipants.toLocaleString()}</span> participants</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
