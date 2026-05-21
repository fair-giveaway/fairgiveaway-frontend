import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';
import { softwareAppSchema, faqSchema, breadcrumbSchema, webPageSchema } from '@/lib/home-data';

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
  },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen">
        <main>
          <HomeHero />
          <HomeFeaturesSection />
          <HomeContributors />
          <HomeResources />
        </main>
        <HomeFaq />
      </div>
    </>
  );
}
