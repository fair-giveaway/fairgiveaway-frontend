'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { getHistory, type GiveawayDoc } from '@/lib/api';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function ShimmerCards() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] h-24 animate-shimmer" />
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState<GiveawayDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Draw History | FairGiveaway.online';
    getHistory()
      .then(setHistory)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in-up">
      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80 flex items-center gap-2">
          <FaClockRotateLeft /> Draw History
        </p>
        <h1 className="pb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Past X Giveaways
        </h1>
      </header>

      {loading && <ShimmerCards />}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 p-6 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] p-8 text-center">
          <p className="text-slate-500 dark:text-white/45">No draws recorded yet. Be the first!</p>
        </div>
      )}

      <div className="space-y-3">
        {history.map((g, i) => (
          <Link key={g._id} href={`/x/draw/${g._id}`}>
            <div 
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none dark:hover:border-white/[0.15] dark:hover:bg-white/[0.05] cursor-pointer"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">@{g.hostUsername}</span>
                <span className="text-xs text-slate-400 dark:text-white/30">{formatDate(g.createdAt)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-white/40">
                <span className="font-mono bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded text-slate-600 dark:text-white/50">ID: {g._id.slice(0, 8)}…</span>
                <span className="capitalize text-teal dark:text-teal-light font-medium bg-teal/5 dark:bg-teal/10 px-2 py-0.5 rounded">{g.mode}</span>
                <span className="flex items-center gap-1"><span className="text-slate-700 dark:text-white/70 font-medium">{g.totalParticipants}</span> participants</span>
                <span className="flex items-center gap-1"><span className="text-slate-700 dark:text-white/70 font-medium">{g.winners.length}</span> winner{g.winners.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
