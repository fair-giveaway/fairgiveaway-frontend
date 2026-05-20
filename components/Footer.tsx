'use client';

import { SiKofi } from 'react-icons/si';
import { FaGift, FaHeart } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

interface DonationLink {
  icon: IconType;
  label: string;
  href: string;
}

const DONATION_LINKS: DonationLink[] = [
  {
    icon: SiKofi,
    label: 'Ko-fi',
    href: 'https://ko-fi.com/isaacnewton1',
  },
  {
    icon: FaGift,
    label: 'Trakteer',
    href: 'https://trakteer.id/isaacnewton1/link',
  },
  {
    icon: FaHeart,
    label: 'GitHub Sponsors',
    href: 'https://github.com/sponsors/isaacnewton123',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-4">
          {DONATION_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card px-5 py-3 flex items-center gap-2.5 text-sm
                           hover:border-teal/40 transition-all duration-300
                           hover:shadow-[0_0_16px_rgba(0,150,136,0.15)]"
              >
                <Icon className="text-lg text-teal-light" />
                <span className="text-text-muted">{link.label}</span>
              </a>
            );
          })}
        </div>

        <p className="text-text-muted text-sm text-center">
          © 2025 FairGiveaway.online — Provably Fair Giveaways
        </p>

        <p className="text-text-muted/50 text-xs text-center">
          Built with transparency. Powered by Web Crypto API.
        </p>
      </div>
    </footer>
  );
}
