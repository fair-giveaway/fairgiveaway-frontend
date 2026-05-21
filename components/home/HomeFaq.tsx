import { FAQS } from '@/lib/home-data';
import { FaChevronDown } from 'react-icons/fa6';

export function HomeFaq() {
  return (
    <section className="relative border-t border-slate-200 px-6 py-24 dark:border-white/[0.06]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details 
              key={i} 
              className="group rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-none animate-fade-in-up [&_summary::-webkit-details-marker]:hidden"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 md:p-8 text-lg font-semibold text-slate-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-teal/50 rounded-xl">
                {faq.q}
                <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-white/[0.04] transition duration-300 group-open:rotate-180">
                  <FaChevronDown className="text-sm text-slate-500 dark:text-white/40" />
                </span>
              </summary>
              <div className="px-6 pb-6 md:px-8 md:pb-8 text-slate-500 dark:text-white/45 leading-relaxed border-t border-slate-100 dark:border-white/[0.04] pt-4 mt-2">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
