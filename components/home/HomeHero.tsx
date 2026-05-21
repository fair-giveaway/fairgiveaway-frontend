'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa6';
import { siteConfig } from '@/lib/shared';

export function HomeHero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-[100%] bg-gradient-glow blur-[100px] pointer-events-none" />
      
      <div className="neo-container relative z-10 text-center flex flex-col items-center">
        <div className="mb-8 animate-fade-in-up">
          <Image src="/logo.png" alt="FairGiveaway Logo" width={96} height={96} className="mx-auto" />
        </div>

        <h1 className="neo-title mb-8 max-w-4xl mx-auto animate-fade-in-up stagger-1">
          Immutable giveaways.
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentPrimary to-teal-400"> Transparent results.</span>
        </h1>
        
        <p className="neo-subtitle mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-2">
          Run your giveaways with cryptographically verifiable randomness. Results are permanently recorded and publicly verifiable by anyone.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto animate-fade-in-up stagger-3">
          <Link href="/platforms" className="neo-button-primary w-full sm:w-auto h-14 px-8 text-lg">
            Start a Draw
          </Link>
          <Link href="/verify" className="neo-button-secondary w-full sm:w-auto h-14 px-8 text-lg">
            Verify Results
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-textSecondary animate-fade-in-up stagger-4 max-w-xl mx-auto">
          <FaGithub className="text-xl shrink-0" />
          <span>
            100% Open Source. <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-accentPrimary hover:underline font-medium transition-colors">Inspect the code</a> and verify the transparency yourself.
          </span>
        </div>
      </div>
    </section>
  );
}
