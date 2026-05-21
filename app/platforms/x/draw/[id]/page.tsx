'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { getDrawStatus, type DrawStatusResult } from '@/lib/api';
import ActiveSession from '@/components/draw/ActiveSession';
import FinalizedSession from '@/components/draw/FinalizedSession';

function Skeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] h-48 animate-shimmer" />
          <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] h-64 animate-shimmer" />
        </div>
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] h-96 animate-shimmer" />
        </div>
      </div>
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
      <div className="max-w-2xl mx-auto rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 p-8 text-center animate-fade-in-up">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">⚠️ Error Loading Draw</p>
        <p className="text-slate-600 dark:text-white/50">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.02] p-8 text-center animate-fade-in-up">
        <p className="text-slate-600 dark:text-white/50 text-lg">Draw not found or expired.</p>
      </div>
    );
  }

  if (data.status === 'finalized' && data.data) {
    return <FinalizedSession data={data.data} drawId={id} />;
  }

  return <ActiveSession drawId={id} data={data} onFinalized={fetchStatus} />;
}
