import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaXTwitter, FaGlobe } from 'react-icons/fa6';
import { siteConfig } from '@/lib/shared';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-borderSubtle bg-bgBase mt-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-glow opacity-30 pointer-events-none" />
      
      <div className="neo-container py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="FairGiveaway Logo" width={32} height={32} className="object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-textPrimary">
                FairGiveaway
              </span>
            </Link>
            <p className="text-textSecondary text-sm leading-relaxed mb-6">
              Provably fair, immutable giveaway platform. Transparent results for everyone.
            </p>
            <div className="flex gap-4">
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-textPrimary transition-colors" aria-label="GitHub">
                <FaGithub className="text-xl" />
              </a>
              <a href="https://x.com/isaac_newton252" target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-textPrimary transition-colors" aria-label="X (Twitter)">
                <FaXTwitter className="text-xl" />
              </a>
              <a href="https://eslint-ai-guardrails.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-textPrimary transition-colors" aria-label="Website">
                <FaGlobe className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="neo-label-sm mb-5">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/platforms" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Start a Draw</Link></li>
              <li><Link href="/verify" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Verify Results</Link></li>
              <li><Link href="/history" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Draw History</Link></li>
              <li><Link href="/leaderboard" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Leaderboards</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="neo-label-sm mb-5">Resources</h3>
            <ul className="space-y-4">
              <li><a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Frontend Repository</a></li>
              <li><a href={siteConfig.links.backend} target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Backend Repository</a></li>
              <li><Link href="/#faq" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="neo-label-sm mb-5">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-textSecondary hover:text-textPrimary text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-borderSubtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-textMuted">
            &copy; {currentYear} FairGiveaway. Open source under MIT License.
          </p>
          <div className="flex items-center gap-2 text-sm text-textMuted">
            Built by Isaac Newton
          </div>
        </div>
      </div>
    </footer>
  );
}
