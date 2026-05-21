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
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inline script to prevent FOUC on theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else if(!t&&!window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-slate-50 text-slate-900 dark:bg-[#0a0a0f] dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
