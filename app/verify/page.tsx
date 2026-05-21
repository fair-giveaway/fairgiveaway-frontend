'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMagnifyingGlass, FaShieldHalved } from 'react-icons/fa6';
import { searchDraw } from '@/lib/api';

export default function VerifyPage() {
  const router = useRouter();
  const [drawId, setDrawId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!drawId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await searchDraw(drawId.trim());
      if (res.found && res.platform) {
        router.push(`/${res.platform.toLowerCase()}/draw/${drawId.trim()}`);
      } else {
        setError('Draw not found. Please check the ID and try again.');
      }
    } catch {
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-fade-in-up">
      <div className="mb-10 text-center">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/15 text-3xl text-violet-500">
          <FaShieldHalved />
        </div>
        <h1 className="mb-4 pb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Verify a Draw
        </h1>
        <p className="mx-auto max-w-md text-slate-500 dark:text-white/45 leading-relaxed">
          Every draw on FairGiveaway is permanently recorded and publicly verifiable. Paste a Draw ID below to inspect the results.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none">
        <label className="block text-sm text-slate-600 dark:text-white/50 mb-2 font-medium">
          Draw ID (UUID)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={drawId}
            onChange={(e) => setDrawId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            className="flex-1 w-full bg-white border border-slate-200 focus:border-teal rounded-xl px-4 py-3 text-sm outline-none transition-colors text-slate-900 placeholder:text-slate-400 dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-white dark:focus:border-teal dark:placeholder:text-white/25"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !drawId.trim()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-light hover:shadow-teal-light/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaMagnifyingGlass className="text-sm" />
            )}
            Search
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );
}
