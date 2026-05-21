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
        router.push(`/history/${res.platform.toLowerCase()}/${drawId.trim()}`);
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
    <div className="min-h-screen pt-32 pb-24 flex flex-col items-center">
      <div className="neo-container max-w-3xl animate-fade-in-up">
        
        <header className="mb-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-bgElevated border border-borderStrong text-3xl text-textPrimary mb-6 shadow-sm">
            <FaShieldHalved />
          </div>
          <h1 className="neo-title mb-6">
            Verify a Draw
          </h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            Every draw on FairGiveaway is permanently recorded and publicly verifiable. Paste a Draw ID below to inspect the results.
          </p>
        </header>

        <div className="neo-card p-8 md:p-10">
          <label className="block text-sm font-semibold text-textSecondary mb-3">
            Draw ID (UUID)
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={drawId}
              onChange={(e) => setDrawId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
              className="neo-input flex-1"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !drawId.trim()}
              className="neo-button-primary w-full sm:w-auto h-[50px] whitespace-nowrap"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-bgBase/30 border-t-bgBase rounded-full animate-spin" />
              ) : (
                <>
                  <FaMagnifyingGlass className="mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-4 text-sm font-medium text-red-500">{error}</p>}
        </div>

      </div>
    </div>
  );
}
