'use client';

import { useEffect, useState, use } from 'react';
import { FaTrophy, FaMedal, FaXTwitter, FaCube } from 'react-icons/fa6';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/api';

export default function PlatformLeaderboardPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = use(params);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (platform !== 'x') {
        setEntries([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getLeaderboard();
        setEntries(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    document.title = `${platform.toUpperCase()} Leaderboard | FairGiveaway.online`;
  }, [platform]);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="neo-container max-w-4xl animate-fade-in-up">
        
        <header className="mb-12">
          <p className="neo-label-sm mb-3 flex items-center gap-2">
            <FaTrophy /> Global Rankings
          </p>
          <h1 className="neo-title flex items-center gap-4">
            {platform === 'x' ? <FaXTwitter /> : <FaCube />}
            <span className="capitalize">{platform} Hosts</span>
          </h1>
        </header>

        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="neo-card p-6 h-20 animate-pulse-slow opacity-50" />
            ))
          ) : entries.length === 0 ? (
            <div className="neo-card p-12 text-center">
              <p className="text-textSecondary">No data available for this platform yet.</p>
            </div>
          ) : (
            entries.map((entry, i) => {
              const isTop3 = i < 3;
              return (
                <div 
                  key={entry._id} 
                  className={`neo-card p-6 flex items-center gap-5 transition-all ${
                    isTop3 ? 'border-accentPrimary/50 bg-accentPrimary/5' : ''
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-lg ${
                    i === 0 ? 'bg-[#fbbf24] text-[#78350f]' :
                    i === 1 ? 'bg-[#94a3b8] text-[#1e293b]' :
                    i === 2 ? 'bg-[#b45309] text-[#fffbeb]' :
                    'bg-bgBase border border-borderStrong text-textSecondary'
                  }`}>
                    {i < 3 ? <FaMedal /> : i + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-textPrimary mb-1">
                      @{entry._id}
                    </h3>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-textPrimary">
                      {entry.totalGiveaways} Draws
                    </div>
                    <div className="text-xs text-textSecondary">
                      {entry.totalParticipants} Participants
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
