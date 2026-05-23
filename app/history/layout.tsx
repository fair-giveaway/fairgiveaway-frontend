import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Draw History | FairGiveaway',
  description: 'Browse all past giveaway draws with full transparency. Every result is publicly verifiable and permanently recorded.',
  alternates: { canonical: `${siteConfig.url}/history` },
  openGraph: {
    title: 'Draw History | FairGiveaway',
    description: 'Browse all past giveaway draws — fully transparent and verifiable.',
    images: [siteConfig.ogImage],
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
