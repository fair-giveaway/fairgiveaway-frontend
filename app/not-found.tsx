import Link from 'next/link';
import { FaHouse, FaMagnifyingGlass } from 'react-icons/fa6';

export default function NotFound() {
  return (
    <main className="w-full pt-32 pb-20 flex items-center justify-center min-h-[70vh]">
      <div className="neo-container text-center max-w-2xl">
        <div className="mb-8 animate-fade-in-up opacity-0">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-accentPrimary/10 mb-6">
            <span className="text-7xl font-black text-accentPrimary animate-float">404</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 animate-fade-in-up opacity-0 stagger-1">
          Page Not Found
        </h1>

        <p className="text-textSecondary text-lg mb-10 max-w-md mx-auto animate-fade-in-up opacity-0 stagger-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Maybe the draw ID you&apos;re searching for is elsewhere?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 stagger-3">
          <Link href="/" className="neo-button-primary gap-2">
            <FaHouse className="text-sm" />
            Go Home
          </Link>
          <Link href="/verify" className="neo-button-secondary gap-2">
            <FaMagnifyingGlass className="text-sm" />
            Verify a Draw
          </Link>
        </div>
      </div>
    </main>
  );
}
