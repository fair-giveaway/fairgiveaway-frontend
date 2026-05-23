import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fairgiveaway.online';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/verify`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/x`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/x/history`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
    { url: `${base}/x/leaderboard`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
