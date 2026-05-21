import { FaGithub } from 'react-icons/fa6';
import { siteConfig } from '@/lib/shared';

export function HomeResources() {
  return (
    <section className="py-24 border-t border-borderSubtle bg-bgBase">
      <div className="neo-container max-w-4xl text-center">
        <div className="mb-16">
          <h2 className="neo-label-sm mb-4">Resources</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-textPrimary mb-6">Support Open Source</h3>
          <p className="neo-subtitle max-w-2xl mx-auto">
            FairGiveaway is completely open-source. We welcome community contributors to help make giveaways transparent for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group neo-card p-8 text-left"
          >
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-bgBase border border-borderStrong text-textPrimary transition-transform group-hover:-translate-y-1">
                <FaGithub className="text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-3 group-hover:underline decoration-borderStrong underline-offset-4">Frontend Repository</h4>
              <p className="text-textSecondary text-sm leading-relaxed">
                Next.js application powering the FairGiveaway user interface and web cryptography.
              </p>
            </div>
          </a>
          
          <a
            href={siteConfig.links.backend}
            target="_blank"
            rel="noopener noreferrer"
            className="group neo-card p-8 text-left"
          >
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-bgBase border border-borderStrong text-textPrimary transition-transform group-hover:-translate-y-1">
                <FaGithub className="text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-3 group-hover:underline decoration-borderStrong underline-offset-4">Backend Repository</h4>
              <p className="text-textSecondary text-sm leading-relaxed">
                Express.js server and database managing the immutable storage of giveaway results.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
