'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaFileCsv,
  FaGlobe,
  FaGithub,
  FaLinkedinIn,
  FaShieldHalved,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';

interface Platform {
  id: string;
  icon: IconType;
  name: string;
  active: boolean;
}

const PLATFORMS: Platform[] = [
  { id: 'x', icon: FaXTwitter, name: 'X / Twitter', active: true },
  { id: 'facebook', icon: FaFacebook, name: 'Facebook', active: false },
  { id: 'instagram', icon: FaInstagram, name: 'Instagram', active: false },
  { id: 'tiktok', icon: FaTiktok, name: 'TikTok', active: false },
  { id: 'csv', icon: FaFileCsv, name: 'CSV Import', active: false },
];

const CREATOR_SOCIALS = [
  { icon: FaGlobe, href: 'https://eslint-ai-guardrails.vercel.app/', label: 'Website' },
  { icon: FaGithub, href: 'https://github.com/isaacnewton123', label: 'GitHub' },
  { icon: FaXTwitter, href: 'https://x.com/isaac_newton252', label: 'X' },
  { icon: FaFacebook, href: 'https://www.facebook.com/hanif.maulana.108/', label: 'Facebook' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/hanif-maulana-210b4721b/', label: 'LinkedIn' },
  { icon: FaInstagram, href: 'https://www.instagram.com/hanifmaulana2/', label: 'Instagram' },
];

function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center pt-16 pb-10 animate-fade-in">
      <div className="animate-pulse-glow rounded-full p-1 mb-6">
        <Image src="/logo.png" alt="FairGiveaway" width={80} height={80} className="rounded-full" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent mb-3">
        FairGiveaway.online
      </h1>
      <p className="text-text-muted text-lg mb-2">Provably Fair Giveaway Winner Selection</p>
      <p className="text-text-muted/60 text-sm max-w-md">
        Powered by the Web Crypto API for cryptographically secure, fully transparent draws.
      </p>
    </section>
  );
}

function PlatformPortals() {
  const router = useRouter();

  return (
    <section className="max-w-4xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.15s' }}>
      <h2 className="text-xl font-semibold text-center mb-6 text-text-bright">Choose a Platform</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              onClick={() => p.active && router.push(`/${p.id}`)}
              className={`glass-card p-6 text-center transition-all duration-300 relative
                ${p.active
                  ? 'cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(0,150,136,0.15)] border border-teal/20'
                  : 'opacity-40 blur-[1px] pointer-events-none'
                }`}
            >
              <Icon className="text-3xl mx-auto mb-3 text-text-bright" />
              <h3 className="font-semibold text-text-bright mb-2">{p.name}</h3>
              {p.active ? (
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              ) : (
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-teal/20 text-teal-light border border-teal/30">
                  Coming Soon
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VerifyBanner() {
  const router = useRouter();

  return (
    <section className="max-w-2xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div
        onClick={() => router.push('/verify')}
        className="glass-card p-6 flex items-center gap-4 cursor-pointer
                   hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,150,136,0.12)]
                   transition-all duration-300 border border-teal/10"
      >
        <div className="shrink-0 w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
          <FaShieldHalved className="text-teal-light text-xl" />
        </div>
        <div>
          <h3 className="font-semibold text-text-bright mb-0.5">Verify a Draw</h3>
          <p className="text-text-muted text-sm">
            Paste any Draw ID to inspect and verify past results →
          </p>
        </div>
      </div>
    </section>
  );
}

function CreatorSection() {
  return (
    <section className="max-w-2xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-xl font-semibold text-center mb-6 text-text-bright">
        Meet the Creator
      </h2>
      <div className="glass-card p-6 md:p-8 text-center">
        <h3 className="text-lg font-bold text-text-bright mb-1">
          Hanif Maulana
        </h3>
        <p className="text-teal-light text-sm mb-5">Isaac Newton</p>

        <div className="flex flex-wrap justify-center gap-3">
          {CREATOR_SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10
                           flex items-center justify-center
                           hover:border-teal/40 hover:bg-teal/10
                           transition-all duration-300 text-text-muted hover:text-teal-light"
              >
                <Icon className="text-lg" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="px-4">
      <HeroSection />
      <VerifyBanner />
      <PlatformPortals />
      <CreatorSection />
    </div>
  );
}
