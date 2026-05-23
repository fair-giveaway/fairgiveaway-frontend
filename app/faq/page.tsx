import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | FairGiveaway',
  description: 'Frequently asked questions about FairGiveaway — fairness, security, data, supported platforms, anti-bot filters, and more.',
  alternates: { canonical: `${siteConfig.url}/faq` },
};

const faqCategories = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is FairGiveaway?',
        a: 'FairGiveaway is an open-source platform for running provably fair giveaways on social media. We scrape participants from tweets, randomly draw winners using cryptographically secure algorithms, and store results as permanent public records.',
      },
      {
        q: 'Is FairGiveaway free?',
        a: 'Yes, completely free. We are an open-source project under the MIT license. No hidden fees, no premium tiers, no ads.',
      },
      {
        q: 'Which platforms are supported?',
        a: 'Currently, we support X (Twitter). We plan to add support for more platforms in the future.',
      },
    ],
  },
  {
    category: 'Fairness & Security',
    questions: [
      {
        q: 'How do you ensure the draw is fair?',
        a: 'Winners are selected using the Web Crypto API (crypto.getRandomValues), the same cryptographic randomness engine used by banks and security systems. The selection is mathematically unbiased and cannot be manipulated.',
      },
      {
        q: 'Can the host manipulate the results?',
        a: 'No. Once participants are scraped, the random selection algorithm runs independently. The host cannot influence which participants are drawn. Additionally, all finalized results are stored as immutable public records that anyone can audit.',
      },
      {
        q: 'How can I verify that a draw was fair?',
        a: 'Every finalized draw has a unique ID. You can look up any draw in our History page or use the Verify Draw feature to see the complete participant list, winner verification results, and draw configuration.',
      },
    ],
  },
  {
    category: 'Anti-Bot Protection',
    questions: [
      {
        q: 'What are anti-bot filters?',
        a: 'Anti-bot filters are optional checks applied to each drawn winner to ensure they are a real person, not a bot account. Filters include: profile picture check, bio check, minimum account age, minimum post count, and comment verification.',
      },
      {
        q: 'What happens if a winner fails verification?',
        a: 'If a winner fails any enabled anti-bot filter, they are marked as "failed" with a reason, and a backup winner is automatically drawn in their place. The failed candidate and the reason are still recorded in the public record for transparency.',
      },
      {
        q: 'Can I customize which filters are applied?',
        a: 'Yes. All filters are optional and configurable. You can enable/disable each one individually and adjust thresholds (like minimum account age in months or minimum post count) to suit your giveaway.',
      },
    ],
  },
  {
    category: 'Data & Privacy',
    questions: [
      {
        q: 'What data do you collect?',
        a: 'We collect publicly available Twitter data: usernames, avatar URLs, and tweet engagement data (likes/reposts). We do not collect passwords, personal information, or use tracking cookies. See our Privacy Policy for full details.',
      },
      {
        q: 'Do you store my Twitter cookies?',
        a: 'No. Twitter session cookies (auth_token, ct0) are used in-memory only during the scraping process and are never saved to disk or any database.',
      },
      {
        q: 'Can I delete my data?',
        a: 'You can request data deletion by contacting us. However, finalized giveaway records are designed to be immutable public audit trails, so individual participant entries from completed draws may not be removable without compromising record integrity.',
      },
      {
        q: 'How long is data stored?',
        a: 'Active draw sessions expire after 15 minutes. Finalized giveaway records are stored permanently as public audit trails. Contact form submissions are only in our email inbox.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'Is FairGiveaway open source?',
        a: 'Yes! Both the frontend and backend are fully open source under the MIT license. You can view, audit, fork, or contribute to the code on GitHub.',
      },
      {
        q: 'Do you have an API?',
        a: 'Yes. FairGiveaway has a RESTful API with interactive Scalar documentation. You can access it for programmatic draw creation, verification, and history queries.',
      },
      {
        q: 'What tech stack does FairGiveaway use?',
        a: 'Frontend: Next.js with TailwindCSS. Backend: ElysiaJS (Bun runtime). Database: MongoDB Atlas. Cache: Upstash Redis. Scraping: Puppeteer. Containerization: Docker.',
      },
    ],
  },
];

// Build FAQPage JSON-LD from all categories
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqCategories.flatMap((cat) =>
    cat.questions.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main className="w-full pt-32 pb-20">
      <div className="neo-container max-w-4xl">
        <div className="text-center mb-16 animate-fade-in-up opacity-0">
          <span className="neo-label-sm text-accentPrimary mb-4 block">Support</span>
          <h1 className="neo-title mb-6">Frequently Asked Questions</h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            Everything you need to know about FairGiveaway. Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="text-accentPrimary hover:underline font-medium">Contact us</Link>.
          </p>
        </div>

        <div className="space-y-12">
          {faqCategories.map((cat, catIdx) => (
            <section key={cat.category} className={`animate-fade-in-up opacity-0 stagger-${Math.min(catIdx + 1, 4)}`}>
              <h2 className="text-xl font-bold text-textPrimary mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-accentPrimary inline-block" />
                {cat.category}
              </h2>
              <div className="space-y-4">
                {cat.questions.map((faq) => (
                  <div key={faq.q} className="neo-card p-6">
                    <h3 className="font-semibold text-textPrimary mb-2">{faq.q}</h3>
                    <p className="text-sm text-textSecondary leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 neo-card p-8 text-center animate-fade-in-up opacity-0">
          <h2 className="text-xl font-bold text-textPrimary mb-3">Still have questions?</h2>
          <p className="text-textSecondary mb-6 text-sm">
            We&apos;re here to help. Reach out via email, X, or GitHub Discussions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="neo-button-primary text-sm">Contact Us</Link>
            <a href={siteConfig.links.discussions} target="_blank" rel="noopener noreferrer" className="neo-button-secondary text-sm">
              GitHub Discussions
            </a>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
