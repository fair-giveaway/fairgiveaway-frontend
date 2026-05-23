import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fairgiveaway.online'),
  title: 'FairGiveaway',
  description: 'Provably fair giveaways backed by immutable public records.',
  openGraph: {
    title: 'FairGiveaway',
    description: 'Provably fair giveaways backed by immutable public records.',
    siteName: 'FairGiveaway',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FairGiveaway',
    description: 'Provably fair giveaways backed by immutable public records.',
  },
  appleWebApp: {
    title: 'FairGiveaway',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col selection:bg-accentPrimary selection:text-bgBase`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
