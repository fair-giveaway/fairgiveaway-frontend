import { FaHeart, FaGithub } from 'react-icons/fa6';

export function HomeContributors() {
  return (
    <section className="py-24 border-t border-borderSubtle bg-bgBase">
      <div className="neo-container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="neo-label-sm mb-4">Sponsors</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-textPrimary">
            Support the Project
          </h3>
          <p className="neo-subtitle max-w-2xl mx-auto mt-4">
            FairGiveaway is an open-source project. If you find it useful, consider sponsoring the development.
          </p>
        </div>

        <div className="flex justify-center">
          <a 
            href="https://github.com/sponsors/isaacnewton123"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center neo-card p-10 w-full max-w-[500px]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bgBase border border-borderSubtle text-textPrimary mb-6 transition-colors group-hover:border-accentPrimary group-hover:bg-accentPrimary/5">
              <FaHeart className="text-3xl transition-colors group-hover:text-accentPrimary" />
            </div>
            
            <h4 className="text-xl font-bold text-textPrimary mb-2">
              Become a Sponsor
            </h4>
            
            <p className="text-textSecondary text-center text-sm mb-8 leading-relaxed">
              Help maintain our infrastructure and fund the development of new features by sponsoring the project on GitHub.
            </p>
            
            <div className="neo-button-primary w-full sm:w-auto text-sm">
              <FaGithub className="mr-2 text-lg" /> Sponsor via GitHub
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
