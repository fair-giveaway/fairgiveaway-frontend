'use client';

import Link from 'next/link';
import { FaTrophy, FaXTwitter, FaFacebook, FaInstagram, FaTiktok, FaFileCsv } from 'react-icons/fa6';

const PLATFORMS = [
  { id: 'x', name: 'X / Twitter', icon: FaXTwitter, active: true },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, active: false },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, active: false },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, active: false },
  { id: 'csv', name: 'CSV Import', icon: FaFileCsv, active: false },
];

export default function LeaderboardHubPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="neo-container max-w-5xl animate-fade-in-up">
        
        <header className="mb-16 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-bgElevated border border-borderStrong text-3xl text-textPrimary mb-6 shadow-sm">
            <FaTrophy className="text-[#fbbf24]" />
          </div>
          <h1 className="neo-title mb-6">
            Global Leaderboards
          </h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            Discover the most active giveaway hosts and top winners across platforms.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORMS.map((platform, i) => {
            const Icon = platform.icon;
            
            if (!platform.active) {
              return (
                <div 
                  key={platform.id} 
                  className="neo-card p-8 flex flex-col items-center justify-center text-center opacity-60 grayscale cursor-not-allowed"
                >
                  <Icon className="text-4xl text-textMuted mb-4" />
                  <h3 className="text-lg font-bold text-textPrimary mb-2">{platform.name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-textMuted bg-borderSubtle px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              );
            }

            return (
              <Link key={platform.id} href={`/leaderboard/${platform.id}`} className="group block">
                <div 
                  className="neo-card p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accentPrimary/50"
                  style={{ animationDelay: `${0.1 * i}s` }}
                >
                  <div className="h-16 w-16 rounded-2xl bg-bgBase border border-borderSubtle flex items-center justify-center mb-6 text-textSecondary transition-colors group-hover:text-accentPrimary group-hover:bg-accentPrimary/5">
                    <Icon className="text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold text-textPrimary mb-2">{platform.name}</h3>
                  <span className="text-sm text-textSecondary">View Rankings →</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
