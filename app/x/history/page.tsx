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
        <div key={i} className="glass-card h-28 animate-shimmer rounded-2xl" />
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
    <div className="animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-text-bright mb-6 flex items-center gap-3">
        <FaClockRotateLeft className="text-teal-light" /> X Giveaway History
      </h1>

      {loading && <ShimmerCards />}

      {error && (
        <div className="glass-card p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-text-muted">No draws recorded yet. Be the first!</p>
        </div>
      )}

      <div className="space-y-3">
        {history.map((g) => (
          <Link key={g._id} href={`/x/draw/${g._id}`}>
            <div className="glass-card p-5 hover:scale-[1.01] hover:shadow-[0_0_16px_rgba(0,150,136,0.1)] transition-all duration-300 cursor-pointer mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-bright">@{g.hostUsername}</span>
                <span className="text-xs text-text-muted">{formatDate(g.createdAt)}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                <span>ID: {g._id.slice(0, 8)}…</span>
                <span className="capitalize text-teal-light">{g.mode}</span>
                <span>{g.totalParticipants} participants</span>
                <span>{g.winners.length} winner{g.winners.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
