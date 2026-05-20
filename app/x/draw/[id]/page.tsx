'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { getDrawStatus, type DrawStatusResult } from '@/lib/api';
import ActiveSession from '@/components/draw/ActiveSession';
import FinalizedSession from '@/components/draw/FinalizedSession';

function Skeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card h-24 animate-shimmer rounded-2xl" />
      ))}
    </div>
  );
}

export default function DrawPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<DrawStatusResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getDrawStatus(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load draw.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStatus();
    document.title = `Draw ${id.slice(0, 8)} | FairGiveaway.online`;
  }, [fetchStatus, id]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <p className="text-red-400 text-lg mb-2">⚠️ Error</p>
        <p className="text-text-muted text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <p className="text-text-muted text-lg">Draw not found or expired.</p>
      </div>
    );
  }

  if (data.status === 'finalized' && data.data) {
    return <FinalizedSession data={data.data} drawId={id} />;
  }

  return <ActiveSession drawId={id} data={data} onFinalized={fetchStatus} />;
}
