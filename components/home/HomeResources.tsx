import { FaGithub } from 'react-icons/fa6';
import { siteConfig } from '@/lib/shared';

export function HomeResources() {
  return (
    <section className="relative border-t border-slate-200 px-6 py-24 dark:border-white/[0.06]">
      <div className="mx-auto max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80">
            Resources
          </p>
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
            Support Open Source
          </h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-slate-500 dark:text-white/45">
            FairGiveaway is completely open-source. We welcome community contributors to help make giveaways transparent for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none dark:hover:border-white/[0.15] dark:hover:bg-white/[0.05]"
          >
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-2xl text-slate-700 dark:bg-white/[0.06] dark:text-white/70">
                <FaGithub />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal transition-colors">Frontend Repository</h3>
              <p className="text-sm text-slate-500 dark:text-white/45 leading-relaxed">
                Next.js application powering the FairGiveaway user interface and web cryptography.
              </p>
            </div>
          </a>
          <a
            href={siteConfig.links.backend}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none dark:hover:border-white/[0.15] dark:hover:bg-white/[0.05]"
          >
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-2xl text-slate-700 dark:bg-white/[0.06] dark:text-white/70">
                <FaGithub />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal transition-colors">Backend Repository</h3>
              <p className="text-sm text-slate-500 dark:text-white/45 leading-relaxed">
                Express.js server and database managing the immutable storage of giveaway results.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
