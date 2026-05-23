import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';
import Link from 'next/link';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Documentation | FairGiveaway',
  description: 'Learn how to use FairGiveaway — step-by-step guides, anti-bot filter explanations, and API documentation.',
  alternates: { canonical: `${siteConfig.url}/docs` },
};

const steps = [
  {
    step: '1',
    title: 'Pick Your Platform',
    desc: 'Go to the Platforms page and select X (Twitter). More platforms will be supported in the future.',
  },
  {
    step: '2',
    title: 'Enter the Tweet URL',
    desc: 'Paste the full URL or tweet ID of your giveaway post. Choose whether to draw from likers or retweeters.',
  },
  {
    step: '3',
    title: 'Configure Anti-Bot Filters',
    desc: 'Enable filters to ensure only real accounts win: profile picture check, bio check, minimum account age, minimum post count, and comment verification.',
  },
  {
    step: '4',
    title: 'Draw Winners',
    desc: 'Click "Draw" to randomly select winners using the Web Crypto API. Each winner is automatically verified against your filters.',
  },
  {
    step: '5',
    title: 'Finalize & Share',
    desc: 'Review your results, then save the draw permanently. Share the results as a quote tweet or comment on the original post.',
  },
];

const filters = [
  {
    name: 'Profile Picture',
    desc: 'Rejects accounts using the default Twitter avatar (egg/silhouette). Real users almost always upload a custom photo.',
  },
  {
    name: 'Bio Check',
    desc: 'Rejects accounts with an empty bio/description. Bot accounts often skip filling out their profile.',
  },
  {
    name: 'Account Age',
    desc: 'Rejects accounts younger than a configurable threshold (default: 1 month). Prevents newly created bot farms.',
  },
  {
    name: 'Activity Check',
    desc: 'Rejects accounts with fewer than a configurable number of posts (default: 10). Ensures the account has real activity.',
  },
  {
    name: 'Comment Verification',
    desc: 'Requires the winner to have commented on the giveaway tweet. Proves genuine engagement with the post.',
  },
];

const engagementTasks = [
  { name: 'Must Like', desc: 'Require candidates to have liked the giveaway tweet.' },
  { name: 'Must Comment', desc: 'Require candidates to have commented on the giveaway tweet.' },
  { name: 'Must Follow', desc: 'Require candidates to follow one or more specified accounts.' },
  { name: 'External Tweet', desc: 'Require engagement (like, repost, comment, or quote) on a second tweet.' },
];

const tocItems = [
  { id: 'quick-start', label: 'Quick Start Guide' },
  { id: 'anti-bot-filters', label: 'Anti-Bot Filters' },
  { id: 'engagement-tasks', label: 'Engagement Tasks' },
  { id: 'api-docs', label: 'API Documentation' },
];

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteConfig.url,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Documentation',
      item: `${siteConfig.url}/docs`,
    },
  ],
};

export default function DocsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="w-full pt-32 pb-20">
        <div className="neo-container max-w-4xl">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8 animate-fade-in-up opacity-0">
            <ol className="flex items-center gap-2 text-sm text-textMuted">
              <li><Link href="/" className="hover:text-textPrimary transition-colors">Home</Link></li>
              <li className="text-borderStrong">/</li>
              <li className="text-textPrimary font-medium" aria-current="page">Documentation</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="text-center mb-16 animate-fade-in-up opacity-0">
            <span className="neo-label-sm text-accentPrimary mb-4 block">Documentation</span>
            <h1 className="neo-title mb-6">How to Use FairGiveaway</h1>
            <p className="neo-subtitle max-w-2xl mx-auto">
              Everything you need to know to run provably fair giveaways on X (Twitter).
            </p>
          </div>

          {/* Table of Contents */}
          <nav aria-label="Table of Contents" className="neo-card p-6 mb-12 animate-fade-in-up opacity-0 stagger-1">
            <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider mb-4">On This Page</h2>
            <ul className="space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-textSecondary hover:text-accentPrimary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-borderStrong inline-block" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Start */}
          <section id="quick-start" className="neo-card p-8 md:p-12 mb-12 animate-fade-in-up opacity-0 stagger-1 scroll-mt-24">
            <h2 className="text-2xl font-bold text-textPrimary mb-8">Quick Start Guide</h2>
            <ol className="space-y-8">
              {steps.map((item) => (
                <li key={item.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accentPrimary text-bgBase flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-textPrimary mb-1">{item.title}</h3>
                    <p className="text-sm text-textSecondary leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Anti-Bot Filters */}
          <section id="anti-bot-filters" className="mb-12 animate-fade-in-up opacity-0 stagger-2 scroll-mt-24">
            <h2 className="text-2xl font-bold text-textPrimary mb-8 text-center">Anti-Bot Filters</h2>
            <p className="text-center text-textSecondary mb-8 max-w-2xl mx-auto">
              These filters are applied during winner verification to ensure only legitimate accounts win. 
              All filters are optional — enable the ones that suit your giveaway.
            </p>
            <div className="space-y-4">
              {filters.map((f) => (
                <div key={f.name} className="neo-card p-6">
                  <h3 className="font-semibold text-textPrimary mb-1">{f.name}</h3>
                  <p className="text-sm text-textSecondary">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Engagement Tasks */}
          <section id="engagement-tasks" className="mb-12 animate-fade-in-up opacity-0 stagger-3 scroll-mt-24">
            <h2 className="text-2xl font-bold text-textPrimary mb-8 text-center">Engagement Tasks</h2>
            <p className="text-center text-textSecondary mb-8 max-w-2xl mx-auto">
              Organizers can require participants to complete engagement tasks beyond just liking or retweeting. 
              These are checked during the verification phase.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {engagementTasks.map((t) => (
                <div key={t.name} className="neo-card p-6">
                  <h3 className="font-semibold text-textPrimary mb-1">{t.name}</h3>
                  <p className="text-sm text-textSecondary">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* API Docs */}
          <section id="api-docs" className="neo-card p-8 md:p-12 text-center animate-fade-in-up opacity-0 stagger-4 scroll-mt-24">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">API Documentation</h2>
            <p className="text-textSecondary mb-6 max-w-lg mx-auto">
              FairGiveaway exposes a RESTful API for programmatic access. Explore the interactive 
              Scalar documentation for all available endpoints, schemas, and examples.
            </p>
            <a
              href={siteConfig.links.apiDocs}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button-primary gap-2"
            >
              Open API Docs <FaArrowUpRightFromSquare className="text-xs" />
            </a>
          </section>
        </div>
      </main>
    </>
  );
}

