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
    <div className="animate-fade-in-up">
      <header className="mb-10 text-center md:text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80 flex items-center justify-center md:justify-start gap-2">
          <FaXTwitter /> X / Twitter Platform
        </p>
        <h1 className="mb-4 pb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Giveaway Hub
        </h1>
        <p className="text-slate-500 dark:text-white/45 leading-relaxed max-w-2xl">
          Paste your tweet link, choose an engagement mode, and let the provably fair draw begin.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none mb-8">
        <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 pb-4 dark:border-white/[0.06]">
          Initialize a New Draw
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 flex items-center text-sm text-slate-600 dark:text-white/50 font-medium">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-500">1</span>
              Tweet URL
            </label>
            <input
              type="text"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="https://x.com/user/status/..."
              className="w-full bg-white border border-slate-200 focus:border-teal rounded-xl px-4 py-3 text-sm outline-none transition-colors text-slate-900 placeholder:text-slate-400 dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-white dark:focus:border-teal dark:placeholder:text-white/25"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm text-slate-600 dark:text-white/50 font-medium">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-500">2</span>
              Engagement Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        ? 'border-teal bg-teal/5 dark:bg-teal/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-white/[0.15]'}
                      ${m.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                    `}
                  >
                    <Icon className={`text-xl ${isSelected ? 'text-teal dark:text-teal-light' : 'text-slate-400 dark:text-white/40'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/60'}`}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              onClick={handleInit}
              disabled={loading || !tweetUrl.trim()}
              className="rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-light hover:shadow-teal-light/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none w-full sm:w-auto"
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
            {error && <p className="mt-3 text-red-500 dark:text-red-400 text-sm">{error}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUB_NAV.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md cursor-pointer dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none dark:hover:border-white/[0.15] dark:hover:bg-white/[0.05]"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xl text-violet-500">
                  <Icon />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
