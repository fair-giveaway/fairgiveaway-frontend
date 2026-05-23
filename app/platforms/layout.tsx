import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Select Platform | FairGiveaway',
  description: 'Choose a social media platform to start a provably fair giveaway draw. Currently supporting X (Twitter) with more platforms coming soon.',
  alternates: { canonical: `${siteConfig.url}/platforms` },
  openGraph: {
    title: 'Select Platform | FairGiveaway',
    description: 'Choose a platform to start a provably fair draw.',
    images: [siteConfig.ogImage],
  },
};

export default function PlatformsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
