'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { ThemeToggle } from './ThemeToggle';
import { siteConfig } from '@/lib/shared';

const NAV_LINKS = [
  { href: '/platforms', label: 'Platforms' },
  { href: '/history', label: 'History' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="neo-container">
        <nav 
          className={`relative flex items-center justify-between rounded-full px-6 transition-all duration-300 ${
            scrolled 
              ? 'bg-bgFloat backdrop-blur-xl border border-borderSubtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]' 
              : 'bg-transparent py-2 border border-transparent'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <Image src="/logo.png" alt="FairGiveaway Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-textPrimary">
              FairGiveaway
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-textSecondary rounded-full transition-colors hover:text-textPrimary hover:bg-borderSubtle"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/verify" className="neo-button-primary text-sm px-5 py-2">
              Verify Draw
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-textSecondary hover:bg-borderSubtle transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaXmark className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute left-4 right-4 top-full mt-2 rounded-2xl bg-bgElevated border border-borderSubtle p-4 shadow-xl transition-all duration-300 transform origin-top ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-2 mb-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-medium text-textSecondary rounded-xl transition-colors hover:bg-borderSubtle hover:text-textPrimary"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3 pt-4 border-t border-borderSubtle">
          <div className="flex items-center justify-between px-4">
            <span className="text-sm font-medium text-textSecondary">Theme</span>
            <ThemeToggle />
          </div>
          <Link 
            href="/verify" 
            onClick={() => setIsOpen(false)}
            className="w-full neo-button-primary"
          >
            Verify Draw
          </Link>
        </div>
      </div>
    </header>
  );
}
