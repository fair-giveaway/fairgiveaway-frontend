'use client';

import { useEffect, useState, use } from 'react';
import { FaClockRotateLeft, FaXTwitter, FaTrophy, FaCube } from 'react-icons/fa6';
import { getHistory, type GiveawayDoc } from '@/lib/api';

export default function PlatformHistoryPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = use(params);
  const [draws, setDraws] = useState<GiveawayDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (platform !== 'x') {
        setDraws([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getHistory();
        setDraws(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    document.title = `${platform.toUpperCase()} History | FairGiveaway.online`;
  }, [platform]);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="neo-container max-w-4xl animate-fade-in-up">
        
        <header className="mb-12 text-center">
          <p className="neo-label-sm mb-3 flex items-center justify-center gap-2">
            <FaClockRotateLeft /> Draw History
          </p>
          <h1 className="neo-title flex items-center justify-center gap-4 mb-4">
            {platform === 'x' ? <FaXTwitter /> : <FaCube />}
          </h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            Browse all finalized giveaway draws and results for {platform === 'x' ? 'X / Twitter' : <span className="capitalize">{platform}</span>}.
          </p>
        </header>

        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="neo-card p-6 h-24 animate-pulse-slow opacity-50" />
            ))
          ) : draws.length === 0 ? (
            <div className="neo-card p-12 text-center">
              <p className="text-textSecondary">No finalized draws found for this platform yet.</p>
            </div>
          ) : (
            draws.map((draw, i) => (
              <a 
                key={draw._id} 
                href={`/history/${platform}/${draw._id}`}
                className="group block"
              >
                <div 
                  className="neo-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-accentPrimary"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-bgElevated shrink-0 border border-borderStrong">
                      {draw.hostUsername ? (
                        <img src={`https://unavatar.io/twitter/${draw.hostUsername}`} alt={draw.hostUsername} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-textMuted"><FaCube /></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-textPrimary mb-1">
                        @{draw.hostUsername || 'Unknown'}
                      </h3>
                      <p className="text-sm text-textSecondary">
                        {new Date(draw.createdAt).toLocaleDateString()} at {new Date(draw.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-3 mt-4 sm:mt-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold bg-bgBase border border-borderStrong text-textPrimary px-3 py-1 rounded-full capitalize">
                        {draw.mode}
                      </span>
                      <span className="text-xs font-semibold bg-accentPrimary/10 text-accentPrimary px-3 py-1 rounded-full flex items-center gap-1">
                        <FaTrophy /> {draw.winners.length} Winners
                      </span>
                    </div>
                    
                    {draw.winners.length > 0 && (
                      <div className="flex -space-x-2">
                        {draw.winners.slice(0, 3).map((w, idx) => (
                          <img 
                            key={w.username}
                            src={`https://unavatar.io/twitter/${w.username}`} 
                            alt={w.username}
                            className="w-8 h-8 rounded-full border-2 border-bgBase bg-bgElevated object-cover shadow-sm relative"
                            style={{ zIndex: 10 - idx }}
                            title={`Winner: @${w.username}`}
                          />
                        ))}
                        {draw.winners.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-bgBase bg-bgElevated text-[10px] font-bold text-textSecondary flex items-center justify-center relative shadow-sm" style={{ zIndex: 0 }}>
                            +{draw.winners.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
