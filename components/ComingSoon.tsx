import Link from 'next/link';
import { FaClockRotateLeft } from 'react-icons/fa6';

export default function ComingSoon({ platform }: { platform: string }) {
  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center p-6 text-center animate-fade-in-up">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-4xl text-slate-400 dark:bg-white/[0.04] dark:text-white/20">
        <FaClockRotateLeft />
      </div>
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {platform} Support is Coming Soon
      </h1>
      <p className="mx-auto mb-8 max-w-md text-slate-500 dark:text-white/45">
        We're working hard to bring provably fair giveaways to {platform}. 
        Check back later or join our community for updates!
      </p>
      <Link
        href="/platforms"
        className="rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-light hover:shadow-teal-light/30"
      >
        View Available Platforms
      </Link>
    </div>
  );
}
