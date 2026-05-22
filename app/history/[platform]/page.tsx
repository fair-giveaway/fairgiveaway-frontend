'use client';

import { useEffect, useState, use, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaClockRotateLeft, FaXTwitter, FaTrophy, FaCube, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { getHistory, type GiveawayDoc } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';

const PER_PAGE = 10;

export default function PlatformHistoryPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draws, setDraws] = useState<GiveawayDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

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
    document.title = `${platform.toUpperCase()} History${page > 1 ? ` — Page ${page}` : ''} | FairGiveaway.online`;
  }, [platform, page]);

  const totalPages = Math.max(1, Math.ceil(draws.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(
    () => draws.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE),
    [draws, safePage],
  );

  const goToPage = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set('page', String(p));
    router.push(`/history/${platform}${p > 1 ? `?${params}` : ''}`);
  };

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
            paged.map((draw) => (
              <a 
                key={draw._id} 
                href={`/history/${platform}/${draw._id}`}
                className="group block"
              >
                <div 
                  className="neo-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-accentPrimary"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0">
                      {draw.hostUsername ? (
                        <Avatar username={draw.hostUsername} src={draw.hostAvatarUrl} size="lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-bgElevated border border-borderStrong flex items-center justify-center text-textMuted"><FaCube /></div>
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
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accentPrimary/10 border border-accentPrimary/20 text-accentPrimary font-bold text-xs uppercase tracking-wide">
                        <FaTrophy /> {draw.winners.length} {draw.winners.length === 1 ? 'Winner' : 'Winners'}
                      </div>
                    </div>
                    
                    {draw.winners.length > 0 && (
                      <div className="flex -space-x-2">
                        {draw.winners.slice(0, 3).map((w, idx) => (
                          <div
                            key={w.username}
                            className="relative"
                            style={{ zIndex: 10 - idx }}
                            title={`Winner: @${w.username}`}
                          >
                            <Avatar username={w.username} src={w.avatarUrl} size="sm" />
                          </div>
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
              className="h-10 w-10 rounded-lg flex items-center justify-center border border-borderStrong bg-bgElevated text-textPrimary hover:border-accentPrimary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                  p === safePage
                    ? 'bg-accentPrimary text-white border border-accentPrimary'
                    : 'border border-borderStrong bg-bgElevated text-textSecondary hover:border-accentPrimary hover:text-textPrimary'
                }`}
                aria-current={p === safePage ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className="h-10 w-10 rounded-lg flex items-center justify-center border border-borderStrong bg-bgElevated text-textPrimary hover:border-accentPrimary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </nav>
        )}

      </div>
    </div>
  );
}
