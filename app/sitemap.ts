import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fairgiveaway.online';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/verify`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/x`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/x/history`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
    { url: `${base}/x/leaderboard`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
  ];
}
