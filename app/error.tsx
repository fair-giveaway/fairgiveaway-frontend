'use client';

import { useEffect } from 'react';
import { FaArrowRotateRight, FaHouse, FaTriangleExclamation } from 'react-icons/fa6';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error(error);
  }, [error]);

  return (
    <main className="w-full pt-32 pb-20 flex items-center justify-center min-h-[70vh]">
      <div className="neo-container text-center max-w-2xl">
        <div className="mb-8 animate-fade-in-up opacity-0">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-500/10 mb-6">
            <FaTriangleExclamation className="text-5xl text-red-500 animate-float" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 animate-fade-in-up opacity-0 stagger-1">
          Something Went Wrong
        </h1>

        <p className="text-textSecondary text-lg mb-10 max-w-md mx-auto animate-fade-in-up opacity-0 stagger-2">
          An unexpected error occurred. Don&apos;t worry — you can try again or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 stagger-3">
          <button onClick={() => reset()} className="neo-button-primary gap-2">
            <FaArrowRotateRight className="text-sm" />
            Try Again
          </button>
          <Link href="/" className="neo-button-secondary gap-2">
            <FaHouse className="text-sm" />
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
