'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { getDrawStatus, type DrawStatusResult } from '@/lib/api';
import FinalizedSession from '@/components/draw/FinalizedSession';
import { useRouter } from 'next/navigation';

function Skeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="neo-card h-48 animate-pulse-slow opacity-50 bg-bgElevated" />
          <div className="neo-card h-64 animate-pulse-slow opacity-50 bg-bgElevated" />
        </div>
        <div className="lg:col-span-8">
          <div className="neo-card h-96 animate-pulse-slow opacity-50 bg-bgElevated" />
        </div>
      </div>
    </div>
  );
}

export default function HistoryDrawPage({ params }: { params: Promise<{ platform: string, id: string }> }) {
  const { platform, id } = use(params);
  const router = useRouter();
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatus();
    document.title = `Historical Draw ${id.slice(0, 8)} | FairGiveaway.online`;
  }, [fetchStatus, id]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="py-32 px-6">
        <div className="max-w-2xl mx-auto neo-card border-red-500/30 bg-red-500/5 p-12 text-center animate-fade-in-up">
          <p className="text-red-500 text-xl font-bold mb-3">⚠️ Error Loading Draw</p>
          <p className="text-textSecondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.status !== 'finalized' || !data.data) {
    return (
      <div className="py-32 px-6">
        <div className="max-w-2xl mx-auto neo-card p-12 text-center animate-fade-in-up">
          <p className="text-textSecondary text-lg font-medium mb-4">This draw is either not found or has not been finalized yet.</p>
          <button onClick={() => router.push(`/platforms/${platform}/draw/${id}`)} className="neo-button-primary">
            Go to Active Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 px-6 max-w-7xl mx-auto">
      <FinalizedSession data={data.data} drawId={id} />
    </div>
  );
}
