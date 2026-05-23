import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Contact Us | FairGiveaway',
  description: 'Get in touch with the FairGiveaway team — report bugs, request features, or ask questions.',
  alternates: { canonical: `${siteConfig.url}/contact` },
};

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact FairGiveaway',
  url: `${siteConfig.url}/contact`,
  mainEntity: {
    '@type': 'Organization',
    name: 'FairGiveaway',
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
    ],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />
      {children}
    </>
  );
}

