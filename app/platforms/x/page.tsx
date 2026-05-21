'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaXTwitter, FaHeart, FaRetweet, FaComment, FaQuoteLeft, FaClockRotateLeft, FaTrophy } from 'react-icons/fa6';
import { initDraw } from '@/lib/api';

function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

const MODES = [
  { value: 'likes', label: 'Likes', icon: FaHeart, disabled: false },
  { value: 'reposts', label: 'Reposts', icon: FaRetweet, disabled: false },
  { value: 'comments', label: 'Comments (Coming Soon)', icon: FaComment, disabled: true },
  { value: 'quotes', label: 'Quotes (Coming Soon)', icon: FaQuoteLeft, disabled: true },
];

const SUB_NAV = [
  { href: '/history/x', icon: FaClockRotateLeft, label: 'Draw History' },
  { href: '/leaderboard/x', icon: FaTrophy, label: 'Leaderboard' },
];

export default function XHubPage() {
  const router = useRouter();
  const [tweetUrl, setTweetUrl] = useState('');
  const [mode, setMode] = useState('likes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = '𝕏 Giveaway Hub | FairGiveaway.online';
  }, []);

  async function handleInit() {
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      setError('Invalid tweet URL. Please paste a valid X/Twitter post link.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await initDraw(tweetId, mode);
      router.push(`/platforms/x/draw/${res.drawId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize draw.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="neo-container max-w-4xl animate-fade-in-up">
        
        <header className="mb-12 text-center">
          <p className="neo-label-sm mb-4 flex items-center justify-center gap-2">
            <FaXTwitter className="text-accentPrimary text-lg" /> X / Twitter Platform
          </p>
          <h1 className="neo-title mb-6">
            Giveaway Hub
          </h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            Paste your tweet link, choose an engagement mode, and let the provably fair draw begin.
          </p>
        </header>

        <div className="neo-card p-6 md:p-10 mb-8">
          <h2 className="text-xl font-bold text-textPrimary mb-8 border-b border-borderSubtle pb-4">
            Initialize a New Draw
          </h2>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-textSecondary mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-borderSubtle text-[10px] text-textPrimary">1</span>
                Tweet URL
              </label>
              <input
                type="text"
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                placeholder="https://x.com/user/status/..."
                className="neo-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-textSecondary mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-borderSubtle text-[10px] text-textPrimary">2</span>
                Engagement Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mode === m.value;
                  return (
                    <button
                      key={m.value}
                      disabled={m.disabled}
                      onClick={() => setMode(m.value)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200
                        ${isSelected 
                          ? 'border-accentPrimary bg-accentPrimary/5' 
                          : 'border-borderStrong bg-transparent hover:bg-bgBase'}
                        ${m.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                      `}
                    >
                      <Icon className={`text-xl ${isSelected ? 'text-accentPrimary' : 'text-textMuted'}`} />
                      <span className={`text-sm font-semibold ${isSelected ? 'text-textPrimary' : 'text-textSecondary'}`}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-borderSubtle">
              <button
                onClick={handleInit}
                disabled={loading || !tweetUrl.trim()}
                className="neo-button-primary w-full sm:w-auto h-14"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-bgBase/30 border-t-bgBase rounded-full animate-spin" />
                    Initializing…
                  </span>
                ) : (
                  'Initialize Draw'
                )}
              </button>
              {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SUB_NAV.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group block">
                <div 
                  className="neo-card p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-accentPrimary/50"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
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
