import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';
import { FaShieldHalved, FaCode, FaUsers, FaGithub, FaXTwitter, FaEnvelope } from 'react-icons/fa6';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | FairGiveaway',
  description: 'Learn about FairGiveaway — an open-source, provably fair giveaway platform built for transparency and trust.',
  alternates: { canonical: `${siteConfig.url}/about` },
};

const values = [
  {
    icon: FaShieldHalved,
    title: 'Provably Fair',
    description: 'Every draw uses the Web Crypto API for cryptographically secure randomness. No manipulation, no bias — just math.',
  },
  {
    icon: FaCode,
    title: '100% Open Source',
    description: 'Both the frontend and backend are fully open source under the MIT license. Anyone can audit, fork, or contribute.',
  },
  {
    icon: FaUsers,
    title: 'Community First',
    description: 'Built by the community, for the community. We don\'t sell data, run ads, or charge hidden fees. Ever.',
  },
];

const techStack = [
  { name: 'Next.js', desc: 'Frontend framework' },
  { name: 'ElysiaJS', desc: 'Backend API' },
  { name: 'MongoDB', desc: 'Permanent storage' },
  { name: 'Redis (Upstash)', desc: 'Session cache' },
  { name: 'Puppeteer', desc: 'Twitter scraping' },
  { name: 'Docker', desc: 'Containerization' },
];

export default function AboutPage() {
  return (
    <main className="w-full pt-32 pb-20">
      <div className="neo-container max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in-up opacity-0">
          <span className="neo-label-sm text-accentPrimary mb-4 block">About Us</span>
          <h1 className="neo-title mb-6">
            Transparency is Not Optional
          </h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            FairGiveaway is an open-source platform that makes giveaway winner selection 
            provably fair, publicly verifiable, and completely transparent.
          </p>
        </div>

        {/* Mission */}
        <section className="neo-card p-8 md:p-12 mb-12 animate-fade-in-up opacity-0 stagger-1">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Our Mission</h2>
          <div className="space-y-4 text-textSecondary leading-relaxed">
            <p>
              Social media giveaways have a trust problem. Winners are often selected behind closed doors, 
              leaving participants wondering if the process was truly random and fair.
            </p>
            <p>
              We built FairGiveaway to solve this. Every draw produces a permanent, publicly accessible record 
              — complete with the full participant list, anti-bot verification results, and the winners. 
              Anyone can verify that the selection was fair by checking the immutable records we store.
            </p>
            <p>
              No black boxes. No &quot;trust me, bro.&quot; Just cryptographically verifiable results that anyone 
              can audit.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-textPrimary mb-8 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={v.title} className={`neo-card p-6 text-center animate-fade-in-up opacity-0 stagger-${i + 1}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accentPrimary/10 mb-4">
                  <v.icon className="text-xl text-accentPrimary" />
                </div>
                <h3 className="text-lg font-semibold text-textPrimary mb-2">{v.title}</h3>
                <p className="text-sm text-textSecondary leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="neo-card p-8 md:p-12 mb-12 animate-fade-in-up opacity-0 stagger-2">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">How It Works</h2>
          <ol className="space-y-6">
            {[
              { step: '1', title: 'Scrape Participants', desc: 'We scrape all likers or retweeters from your giveaway tweet using authenticated Twitter APIs.' },
              { step: '2', title: 'Draw Winners', desc: 'Winners are randomly selected using the Web Crypto API — the same cryptographic engine banks use.' },
              { step: '3', title: 'Verify & Filter', desc: 'Each winner is verified against configurable anti-bot filters: profile picture, bio, account age, activity, and comment checks.' },
              { step: '4', title: 'Permanent Record', desc: 'The finalized draw is saved permanently with the full participant list, verification results, and timestamps.' },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accentPrimary text-bgBase flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-textPrimary mb-1">{item.title}</h3>
                  <p className="text-sm text-textSecondary">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Tech Stack */}
        <section className="mb-12 animate-fade-in-up opacity-0 stagger-3">
          <h2 className="text-2xl font-bold text-textPrimary mb-8 text-center">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="neo-card p-4 text-center">
                <p className="font-semibold text-textPrimary text-sm">{tech.name}</p>
                <p className="text-xs text-textMuted mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="text-center animate-fade-in-up opacity-0 stagger-4">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">Get in Touch</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="neo-button-secondary gap-2 text-sm">
              <FaGithub /> GitHub
            </a>
            <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="neo-button-secondary gap-2 text-sm">
              <FaXTwitter /> @FairGiveaway
            </a>
            <Link href="/contact" className="neo-button-primary gap-2 text-sm">
              <FaEnvelope /> Contact Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
