'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SiKofi } from 'react-icons/si';
import { FaGift, FaHeart } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Start a Draw', href: '/platforms' },
      { label: 'Verify Results', href: '/verify' },
      { label: 'Draw History', href: '/history' },
      { label: 'Leaderboard', href: '/leaderboard' },
    ],
  },
  {
    title: 'Platforms',
    links: [
      { label: 'X / Twitter', href: '/platforms/x' },
      { label: 'Facebook', href: '/platforms/facebook' },
      { label: 'Instagram', href: '/platforms/instagram' },
      { label: 'TikTok', href: '/platforms/tiktok' },
      { label: 'CSV Import', href: '/platforms/csv' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/isaacnewton123/FairGiveaway', external: true },
      { label: 'Report Issue', href: 'https://github.com/isaacnewton123/FairGiveaway/issues', external: true },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'X / Twitter', href: 'https://x.com/isaac_newton252', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hanif-maulana-210b4721b/', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/hanifmaulana2/', external: true },
      { label: 'Facebook', href: 'https://www.facebook.com/hanif.maulana.108/', external: true },
    ],
  },
];

const supportLinks: { icon: IconType; label: string; emoji: string; href: string }[] = [
  { icon: SiKofi, label: 'Ko-fi', emoji: '☕', href: 'https://ko-fi.com/isaacnewton1' },
  { icon: FaGift, label: 'Trakteer', emoji: '💜', href: 'https://trakteer.id/isaacnewton1/link' },
  { icon: FaHeart, label: 'Sponsors', emoji: '❤️', href: 'https://github.com/sponsors/isaacnewton123' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 px-6 pb-8 pt-16 dark:border-white/[0.06]">
      {/* Gradient accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3" aria-label="Home">
              <Image
                src="/logo.png"
                alt="FairGiveaway logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-white/80">
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Fair
                </span>
                Giveaway
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-white/35">
              Provably fair giveaway winner selection powered by Web Crypto API.
              Zero manipulation, 100% verifiable.
            </p>

            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-white/20">
                Support the project
              </span>
              <div className="flex items-center gap-2.5">
                {supportLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition-all duration-300 hover:border-teal/25 hover:bg-teal-light/5 hover:text-teal-dark dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-white/45 dark:hover:bg-teal/10 dark:hover:text-teal-light"
                    aria-label={`${link.label} (opens in new tab)`}
                  >
                    {link.emoji} {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-white/40">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-white/30 dark:hover:text-white/65"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-slate-200 pt-6 dark:border-white/[0.04]">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-slate-400 dark:text-white/20">
              MIT License · © {new Date().getFullYear()} FairGiveaway.online
            </p>
            <p className="text-xs text-slate-400 dark:text-white/20">
              Built by{' '}
              <a
                href="https://github.com/isaacnewton123"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-slate-800 dark:text-white/35 dark:hover:text-white/60"
              >
                Hanif Maulana
              </a>
            </p>
          </div>

          {/* Social share */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:mt-6 sm:justify-start">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">
              Share:
            </span>
            {[
              { label: 'X / Twitter', href: 'https://x.com/intent/tweet?text=Check%20out%20FairGiveaway.online!&url=https://fairgiveaway.online' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/sharing/share-offsite/?url=https://fairgiveaway.online' },
              { label: 'Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=https://fairgiveaway.online' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 transition-colors hover:text-teal dark:text-white/40 dark:hover:text-teal-light"
                aria-label={`Share on ${s.label}`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
