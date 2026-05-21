import { FaLock, FaGlobe, FaCubes, FaWandMagicSparkles } from 'react-icons/fa6';

const features = [
  {
    icon: FaLock,
    title: 'Cryptographic Proof',
    description: 'Every draw is powered by verifiable randomness. The mathematical proof is stored immutably, ensuring results cannot be tampered with.',
  },
  {
    icon: FaGlobe,
    title: 'Public Ledger',
    description: 'Results are permanently recorded on our public ledger. Anyone can verify the authenticity of a draw at any time using the Draw ID.',
  },
  {
    icon: FaCubes,
    title: 'Multi-Platform',
    description: 'Seamlessly integrate with X (Twitter), Instagram, Facebook, and more. Or import your own CSV of entries for custom giveaways.',
  },
  {
    icon: FaWandMagicSparkles,
    title: 'Elegant Experience',
    description: 'A beautiful, frictionless interface designed for both hosts and participants. Running a fair giveaway has never been this easy.',
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="neo-container">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="neo-label-sm mb-4">Why FairGiveaway</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-textPrimary mb-6">
            Trust through mathematics.
          </h3>
          <p className="neo-subtitle max-w-2xl mx-auto">
            We remove the guesswork from giveaways by replacing black-box selections with cryptographic certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="neo-card p-8 lg:p-10 group"
              >
                <div className="h-12 w-12 rounded-xl bg-bgBase border border-borderStrong flex items-center justify-center mb-6 text-textPrimary">
                  <Icon className="text-xl" />
                </div>
                <h4 className="text-xl font-bold text-textPrimary mb-3">
                  {feature.title}
                </h4>
                <p className="text-textSecondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
