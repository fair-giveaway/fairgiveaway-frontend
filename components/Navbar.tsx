'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaXTwitter, FaGithub, FaShieldHalved, FaBars, FaXmark } from 'react-icons/fa6';

const NAV_LINKS = [
  { href: '/x', label: 'X Hub', icon: FaXTwitter },
  { href: '/verify', label: 'Verify', icon: FaShieldHalved },
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
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="FairGiveaway logo"
            width={36}
            height={36}
            className="rounded-lg transition-transform group-hover:scale-105"
          />
          <span className="text-white font-bold text-lg tracking-tight">
            FairGiveaway
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="flex items-center gap-1.5 text-sm text-text-muted hover:text-teal-light transition-colors"
              >
                <Icon className="text-xs" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-text-muted hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaXmark className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 flex flex-col gap-3">
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
                className="flex items-center gap-2 text-sm text-text-muted hover:text-teal-light transition-colors py-1"
              >
                <Icon className="text-xs" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
