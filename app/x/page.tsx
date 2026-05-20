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
  { href: '/x/history', icon: FaClockRotateLeft, label: 'Draw History' },
  { href: '/x/leaderboard', icon: FaTrophy, label: 'Leaderboard' },
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
      router.push(`/x/draw/${res.drawId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize draw.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaXTwitter className="text-2xl text-text-bright" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
            Giveaway Hub
          </h1>
        </div>
        <p className="text-text-muted">
          Paste your tweet link, choose an engagement mode, and let the provably fair draw begin.
        </p>
      </header>

      <div className="glass-card p-6 md:p-8 mb-8">
        <h2 className="text-lg font-semibold text-text-bright mb-4">Initialize a New Draw</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Tweet URL</label>
            <input
              type="text"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="https://x.com/user/status/..."
              className="w-full bg-white/5 border border-white/10 focus:border-teal
                         rounded-xl px-4 py-3 text-sm outline-none transition-colors
                         placeholder:text-text-muted/40"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1.5">Engagement Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-teal
                         rounded-xl px-4 py-3 text-sm outline-none transition-colors
                         appearance-none cursor-pointer"
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value} disabled={m.disabled} className="bg-bg-card">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleInit}
            disabled={loading || !tweetUrl.trim()}
            className="btn-teal w-full sm:w-auto"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Initializing…
              </span>
            ) : (
              'Initialize Draw'
            )}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUB_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div className="glass-card p-5 hover:scale-[1.02] hover:shadow-[0_0_16px_rgba(0,150,136,0.12)] transition-all duration-300 cursor-pointer">
                <Icon className="text-2xl text-teal-light mb-2" />
                <span className="font-medium text-text-bright">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
