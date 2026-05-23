import { siteConfig } from './shared';

export const PLATFORMS = [
  { id: 'x', name: 'X / Twitter', active: true },
  { id: 'facebook', name: 'Facebook', active: false },
  { id: 'instagram', name: 'Instagram', active: false },
  { id: 'tiktok', name: 'TikTok', active: false },
  { id: 'csv', name: 'CSV Import', active: false },
];

export const CREATOR_SOCIALS = [
  { href: 'https://isaacnewton.store', label: 'Website' },
  { href: 'https://github.com/isaacnewton123', label: 'GitHub' },
];

export const FEATURES = [
  {
    title: 'Cryptographically Secure',
    description: 'We use the native Web Crypto API to ensure that random number generation cannot be tampered with or manipulated by the host or our servers.',
  },
  {
    title: '100% Provably Fair',
    description: 'Every draw generates a unique cryptographic hash. This seed is permanently recorded in our database, making the entire selection process fully transparent.',
  },
  {
    title: 'Instant & Verifiable',
    description: 'Results are calculated instantly and locked forever. Anyone can take the public Draw ID and independently verify the winners on our platform at any time.',
  },
  {
    title: 'SEO Optimized Draws',
    description: 'Public draw pages rank well in search engines, giving hosts more visibility for their giveaways and boosting trust among their communities.',
  },
];

export const FAQS = [
  {
    q: 'How does the random winner selection work?',
    a: "We use the browser's native Web Crypto API (crypto.getRandomValues) to generate secure randomness. This prevents any predictable patterns or manipulation that can happen with standard Math.random().",
  },
  {
    q: 'Is it completely free to use?',
    a: 'Yes! FairGiveaway is an open-source, free-to-use tool built to bring transparency to social media giveaways.',
  },
  {
    q: 'Can a host change the winners after a draw?',
    a: 'No. Once a draw is finalized, the results and the cryptographic seed are locked in our database. The public Draw ID serves as an immutable receipt of the event.',
  },
  {
    q: 'Do participants need to connect their accounts?',
    a: 'No, our tool analyzes public data based on the link provided by the host. Participants do not need to connect their X (Twitter) or other social accounts to our platform.',
  },
];

export const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FairGiveaway",
  "operatingSystem": "Web",
  "applicationCategory": "UtilitiesApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": siteConfig.description,
  "url": siteConfig.url
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": siteConfig.url
  }]
};

export const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": siteConfig.title,
  "description": siteConfig.description,
  "url": siteConfig.url
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "FairGiveaway",
  "url": siteConfig.url,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteConfig.url}/verify?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

