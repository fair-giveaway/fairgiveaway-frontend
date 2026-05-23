import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Leaderboard | FairGiveaway',
  description: 'See the most active giveaway hosts and top winners across the FairGiveaway platform.',
  alternates: { canonical: `${siteConfig.url}/leaderboard` },
  openGraph: {
    title: 'Leaderboard | FairGiveaway',
    description: 'Top giveaway hosts and winners on FairGiveaway.',
    images: [siteConfig.ogImage],
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
