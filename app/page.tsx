import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';
import { softwareAppSchema, faqSchema, breadcrumbSchema, webPageSchema, webSiteSchema } from '@/lib/home-data';

import { HomeHero } from '@/components/home/HomeHero';
import { HomeFeaturesSection } from '@/components/home/HomeFeaturesSection';
import { HomeContributors } from '@/components/home/HomeContributors';
import { HomeResources } from '@/components/home/HomeResources';
import { HomeFaq } from '@/components/home/HomeFaq';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/og-image.webp'],
  },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />

      <main className="w-full pt-20">
        <HomeHero />
        <HomeFeaturesSection />
        <HomeContributors />
        <HomeResources />
        <HomeFaq />
      </main>
    </>
  );
}
