'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/shared';

export function HomeHero() {
  const router = useRouter();
  
  return (
    <section className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6 py-12 text-center animate-fade-in-up">
      <div className="mb-6 flex justify-center animate-float">
        <Image src="/logo.png" alt="FairGiveaway" width={80} height={80} className="rounded-2xl shadow-xl shadow-teal/10 dark:shadow-teal/20" priority />
      </div>
      <h1 className="mx-auto max-w-3xl font-mono text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 pb-1">
        FairGiveaway.online
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-white/60 mb-8">
        {siteConfig.description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => router.push('/platforms')}
          className="rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-light hover:shadow-teal-light/30"
        >
          Start a Draw →
        </button>
        <button
          onClick={() => router.push('/verify')}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-white dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
        >
          Verify a Draw
        </button>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-white dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
