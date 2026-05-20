import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'FairGiveaway.online — Provably Fair Giveaway Draws',
    template: '%s | FairGiveaway.online',
  },
  description:
    'Transparent, provably fair giveaway winner selection powered by Web Crypto API. Zero manipulation, 100% verifiable.',
  keywords: [
    'giveaway',
    'provably fair',
    'random winner picker',
    'twitter giveaway',
    'transparent draw',
  ],
  openGraph: {
    title: 'FairGiveaway.online — Provably Fair Giveaway Draws',
    description:
      'Transparent, provably fair giveaway winner selection powered by Web Crypto API.',
    url: 'https://fairgiveaway.online',
    siteName: 'FairGiveaway.online',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FairGiveaway.online — Provably Fair Giveaway Draws',
    description:
      'Transparent, provably fair giveaway winner selection powered by Web Crypto API.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FairGiveaway.online',
  url: 'https://fairgiveaway.online',
  description:
    'Transparent, provably fair giveaway winner selection powered by Web Crypto API.',
  applicationCategory: 'UtilityApplication',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-deep text-text-primary font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
