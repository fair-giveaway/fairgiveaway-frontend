'use client';

import { useEffect, useState, use, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaTrophy, FaMedal, FaXTwitter, FaCube, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';

const PER_PAGE = 10;

export default function PlatformLeaderboardPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

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
    document.title = `${platform.toUpperCase()} Leaderboard${page > 1 ? ` — Page ${page}` : ''} | FairGiveaway.online`;
  }, [platform, page]);

  const totalPages = Math.max(1, Math.ceil(entries.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(
    () => entries.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE),
    [entries, safePage],
  );

  const goToPage = (p: number) => {
    const query = new URLSearchParams();
    if (p > 1) query.set('page', String(p));
    router.push(`/leaderboard/${platform}${p > 1 ? `?${query}` : ''}`);
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="neo-container max-w-4xl animate-fade-in-up">
        
        <header className="mb-12 text-center">
          <p className="neo-label-sm mb-3 flex items-center justify-center gap-2">
            <FaTrophy /> Global Rankings
          </p>
          <h1 className="neo-title flex items-center justify-center gap-4 mb-4">
            {platform === 'x' ? <FaXTwitter /> : <FaCube />}
          </h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            Top hosts ranked by total giveaways and participants on {platform === 'x' ? 'X / Twitter' : <span className="capitalize">{platform}</span>}.
          </p>
        </header>

        <div className="space-y-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="neo-card p-6 h-20 animate-pulse-slow opacity-50" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="neo-card p-12 text-center">
              <p className="text-textSecondary">No data available for this platform yet.</p>
            </div>
          ) : (
            <>
              {/* TOP 3 - Only visible on page 1 */}
              {safePage === 1 && paged.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {paged.slice(0, 3).map((entry, i) => (
                    <div 
                      key={`top-${entry._id}`} 
                      className="neo-card p-6 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-lg border-accentPrimary/50 bg-accentPrimary/5"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-xl mb-4 shadow-sm ${
                        i === 0 ? 'bg-[#fbbf24] text-[#78350f] border border-[#f59e0b]' :
                        i === 1 ? 'bg-[#94a3b8] text-[#1e293b] border border-[#64748b]' :
                        'bg-[#b45309] text-[#fffbeb] border border-[#92400e]'
                      }`}>
                        <FaMedal /> {i + 1}
                      </div>
                      <div className="mb-3">
                        <Avatar username={entry._id} src={entry.avatarUrl} size="lg" />
                      </div>
                      <h3 className="text-xl font-bold text-textPrimary mb-1">
                        @{entry._id}
                      </h3>
                      <div className="w-full h-px bg-borderSubtle my-4" />
                      <div className="flex w-full justify-between px-2 text-left">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold">Draws</span>
                          <span className="text-lg font-bold text-accentPrimary">{entry.totalGiveaways}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold">Participants</span>
                          <span className="text-lg font-bold text-textPrimary">{entry.totalParticipants.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* REMAINING */}
              <div className="space-y-3">
                {paged.slice(safePage === 1 ? 3 : 0).map((entry, i) => {
                  const globalIndex = (safePage - 1) * PER_PAGE + (safePage === 1 ? i + 3 : i);
                  return (
                    <div 
                      key={`rest-${entry._id}`} 
                      className="neo-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-accentPrimary/30"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm bg-bgBase border border-borderStrong text-textSecondary">
                          {globalIndex + 1}
                        </div>
                        <Avatar username={entry._id} src={entry.avatarUrl} size="md" />
                        <h3 className="text-base font-bold text-textPrimary truncate">
                          @{entry._id}
                        </h3>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 pl-14 sm:pl-0">
                        <div className="text-sm font-semibold text-textPrimary">
                          {entry.totalGiveaways} Draws
                        </div>
                        <div className="text-xs text-textSecondary">
                          {entry.totalParticipants.toLocaleString()} Participants
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
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
