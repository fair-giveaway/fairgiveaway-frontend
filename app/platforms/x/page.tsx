'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaXTwitter, FaClockRotateLeft, FaTrophy, FaArrowRight, FaRetweet, FaHeart } from 'react-icons/fa6';
import { initDraw } from '@/lib/api';
import InteractiveLoadingModal from '@/components/ui/InteractiveLoadingModal';

function extractTweetId(url: string): string | null {
  if (!url.trim()) return null;
  const match = url.match(/status\/(\d+)/);
  if (match) return match[1];
  const numbers = url.match(/(\d+)/);
  return numbers ? numbers[1] : url.trim();
}

function extractUsername(url: string): string {
  const match = url.match(/(?:x\.com|twitter\.com)\/([^/]+)\/status/);
  return match ? match[1] : 'unknown';
}

const SUB_NAV = [
  { href: '/history/x', icon: FaClockRotateLeft, label: 'Draw History' },
  { href: '/leaderboard/x', icon: FaTrophy, label: 'Leaderboard' },
];

export default function XHubPage() {
  const router = useRouter();
  const [postUrl, setPostUrl] = useState('');
  const [mode, setMode] = useState<'reposts' | 'likes'>('reposts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    document.title = '𝕏 Giveaway Hub | FairGiveaway.online';
  }, []);

  async function handleInit() {
    const tweetId = extractTweetId(postUrl);
    if (!tweetId) {
      setError('Please paste a valid X/Twitter post URL.');
      return;
    }

    const host = extractUsername(postUrl);
    setLoading(true);
    setModalOpen(true);
    setModalSuccess(false);
    setError('');
    
    try {
      const res = await initDraw(tweetId, mode, host);
      setModalSuccess(true);
      setTimeout(() => {
        router.push(`/platforms/x/draw/${res.drawId}`);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize draw.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <InteractiveLoadingModal
        isOpen={modalOpen}
        isError={!!error}
        errorMessage={error}
        isSuccess={modalSuccess}
        onCloseError={() => {
          setModalOpen(false);
          setError('');
        }}
      />
      
      <div className="neo-container max-w-3xl animate-fade-in-up">
        
        <header className="mb-12 text-center">
          <p className="neo-label-sm mb-4 flex items-center justify-center gap-2">
            <FaXTwitter className="text-accentPrimary text-lg" /> X / Twitter Platform
          </p>
          <h1 className="neo-title mb-6">
            Start a Giveaway Draw
          </h1>
          <p className="neo-subtitle max-w-xl mx-auto">
            Paste your post link below to initialize a provably fair draw session.
          </p>
        </header>

        <div className="neo-card p-6 md:p-10 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-textPrimary mb-3">
                Post URL
              </label>
              <input
                type="text"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInit()}
                placeholder="https://x.com/username/status/1234567890"
                className="neo-input"
              />
              <p className="mt-3 text-xs text-textMuted leading-relaxed">
                💡 Note: For optimal performance, the system first retrieves the primary list of participants based on your selected interaction ({mode === 'reposts' ? 'Reposts' : 'Likes'}). You can configure advanced anti-bot filters and additional verification tasks on the next step.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-textPrimary mb-3">
                Primary Scrape Target
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setMode('reposts')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${
                    mode === 'reposts' 
                      ? 'bg-accentPrimary text-white border-accentPrimary shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)]' 
                      : 'bg-bgElevated border-borderSubtle text-textSecondary hover:border-accentPrimary/50 hover:text-textPrimary'
                  }`}
                >
                  <FaRetweet /> Reposts
                </button>
                <button
                  onClick={() => setMode('likes')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium border flex items-center justify-center gap-2 transition-all ${
                    mode === 'likes' 
                      ? 'bg-accentPrimary text-white border-accentPrimary shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)]' 
                      : 'bg-bgElevated border-borderSubtle text-textSecondary hover:border-accentPrimary/50 hover:text-textPrimary'
                  }`}
                >
                  <FaHeart /> Likes
                </button>
              </div>
            </div>

            <button
              onClick={handleInit}
              disabled={loading || !postUrl.trim()}
              className="neo-button-primary w-full h-14 text-base flex items-center justify-center gap-2"
            >
              Initialize Draw <FaArrowRight />
            </button>
            {error && !modalOpen && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SUB_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group block">
                <div 
                  className="neo-card p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-accentPrimary/50 group"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bgBase border border-borderSubtle text-2xl text-textSecondary transition-colors group-hover:text-accentPrimary">
                    <Icon />
                  </div>
                  <span className="font-bold text-lg text-textPrimary transition-colors group-hover:text-accentPrimary">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
