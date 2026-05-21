import { FaLock, FaShieldHalved, FaBolt, FaChartLine } from 'react-icons/fa6';
import { FEATURES } from '@/lib/home-data';

const icons = [FaLock, FaShieldHalved, FaBolt, FaChartLine];

export function HomeFeaturesSection() {
  return (
    <section className="relative border-t border-slate-200 px-6 py-24 dark:border-white/[0.06]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center animate-fade-in-up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80">
            Why FairGiveaway?
          </p>
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
            Trust Built into the Code
          </h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-slate-500 dark:text-white/45">
            Traditional giveaway pickers are easily manipulated behind closed doors. We solve this by making the random selection process cryptographically secure and publicly auditable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal dark:text-teal-light">
                  <Icon className="text-lg" />
                </div>
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-white/45">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
