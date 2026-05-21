import Link from 'next/link';
import { FaWandMagicSparkles, FaArrowLeft } from 'react-icons/fa6';

export default function ComingSoon({ platform }: { platform: string }) {
  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="neo-container max-w-lg text-center animate-fade-in-up">
        <div className="neo-card p-10 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bgElevated border border-borderStrong text-2xl text-accentPrimary mb-6 shadow-sm">
            <FaWandMagicSparkles />
          </div>
          
          <h1 className="neo-title mb-4 capitalize">
            {platform}
          </h1>
          
          <p className="neo-subtitle mb-8">
            We are currently crafting a provably fair experience for {platform}. 
            It will be available very soon. Stay tuned for updates!
          </p>

          <Link
            href="/platforms"
            className="neo-button-secondary w-full"
          >
            <FaArrowLeft className="mr-2" />
            Back to Platforms
          </Link>
        </div>
      </div>
    </div>
  );
}
