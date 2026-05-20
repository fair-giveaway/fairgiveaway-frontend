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
    <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 border border-teal/20 mb-5">
          <FaShieldHalved className="text-teal-light text-2xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-bright mb-3">
          Verify a Draw
        </h1>
        <p className="text-text-muted max-w-md mx-auto">
          Every draw on FairGiveaway is permanently recorded and publicly
          verifiable. Paste a Draw ID below to inspect the results.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8">
        <label className="block text-sm text-text-muted mb-3 font-medium">
          Draw ID (UUID)
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={drawId}
            onChange={(e) => setDrawId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            className="flex-1 bg-white/5 border border-white/10 focus:border-teal
                       rounded-xl px-4 py-3 text-sm outline-none transition-colors
                       placeholder:text-text-muted/40"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !drawId.trim()}
            className="btn-teal flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaMagnifyingGlass className="text-sm" />
            )}
            Search
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
