'use client';

import { useRouter } from 'next/navigation';
import { PLATFORMS } from '@/lib/home-data';
import { FaXTwitter, FaFacebook, FaInstagram, FaTiktok, FaFileCsv } from 'react-icons/fa6';

const ICONS: Record<string, any> = {
  'x': FaXTwitter,
  'facebook': FaFacebook,
  'instagram': FaInstagram,
  'tiktok': FaTiktok,
  'csv': FaFileCsv,
};

export default function PlatformsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80">
            Platforms
          </p>
          <h1 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
            Choose a Platform
          </h1>
          <p className="mx-auto max-w-2xl leading-relaxed text-slate-500 dark:text-white/45">
            Select the platform where you hosted your giveaway to get started. More platforms are coming soon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORMS.map((p, i) => {
            const Icon = ICONS[p.id];
            return (
              <div
                key={p.id}
                onClick={() => p.active && router.push(`/platforms/${p.id}`)}
                className={`group relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none animate-fade-in-up
                  ${p.active
                    ? 'cursor-pointer hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:hover:border-white/[0.15] dark:hover:bg-white/[0.05]'
                    : 'opacity-60 grayscale'
                  }`}
                style={{ animationDelay: `${0.15 + i * 0.05}s` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 text-2xl text-violet-500">
                  {Icon && <Icon />}
                </div>
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                {p.active ? (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-teal/10 text-teal dark:text-teal-light border border-teal/20">
                    Active
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/[0.06] dark:text-white/40 dark:border-white/10">
                    Coming Soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
