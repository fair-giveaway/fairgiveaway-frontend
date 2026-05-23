import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Verify a Draw | FairGiveaway',
  description: 'Look up any giveaway draw by its unique ID. Inspect participants, winners, and verification results — all publicly auditable.',
  alternates: { canonical: `${siteConfig.url}/verify` },
  openGraph: {
    title: 'Verify a Draw | FairGiveaway',
    description: 'Look up any giveaway draw by its unique ID.',
    images: [siteConfig.ogImage],
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
