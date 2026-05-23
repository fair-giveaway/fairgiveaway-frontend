import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Contact Us | FairGiveaway',
  description: 'Get in touch with the FairGiveaway team — report bugs, request features, or ask questions.',
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
