'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaXTwitter, FaGithub, FaShieldHalved, FaBars, FaXmark, FaClockRotateLeft, FaTrophy } from 'react-icons/fa6';
import ThemeToggle from '@/components/ThemeToggle';

const NAV_LINKS = [
  { href: '/platforms/x', label: 'X Hub', icon: FaXTwitter },
  { href: '/history', label: 'History', icon: FaClockRotateLeft },
  { href: '/leaderboard', label: 'Leaderboard', icon: FaTrophy },
  {
    href: 'https://github.com/isaacnewton123/FairGiveaway',
    label: 'GitHub',
    icon: FaGithub,
    external: true,
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.06] dark:bg-[#0a0a0f]/70">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-semibold text-slate-700 transition-colors hover:text-slate-900 dark:text-white/90 dark:hover:text-white"
          aria-label="FairGiveaway home"
        >
          <Image
            src="/logo.png"
            alt="FairGiveaway logo"
            width={32}
            height={32}
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="text-sm tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Fair
            </span>
            Giveaway
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <Icon className="text-xs" />
                {link.label}
              </Link>
            );
          })}

          <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-white/10" />

          <ThemeToggle />

          <Link
            href="/platforms"
            className="ml-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-light hover:shadow-teal-light/30"
          >
            Draw Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaXmark className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-slate-100 px-6 pb-4 pt-2 dark:border-white/[0.06]">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white/60 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <Icon className="text-sm" />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/platforms"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-lg bg-teal px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-light"
          >
            Draw Now
          </Link>
        </div>
      </div>
    </header>
  );
}
