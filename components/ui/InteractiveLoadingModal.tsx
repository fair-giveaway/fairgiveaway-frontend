import { useState, useEffect, useRef } from 'react';
import { FaXmark, FaCheck } from 'react-icons/fa6';

const TIPS = [
  'Connecting to server X...',
  'Filtering bot and spam accounts...',
  'Did you know? Private accounts are automatically ignored by the system for transparency',
  'Preparing data for roulette...'
];

interface InteractiveLoadingModalProps {
  isOpen: boolean;
  isError: boolean;
  errorMessage: string;
  isSuccess: boolean;
  onCloseError: () => void;
}

export default function InteractiveLoadingModal({
  isOpen,
  isError,
  errorMessage,
  isSuccess,
  onCloseError,
}: InteractiveLoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // We use refs to avoid dependency cycle in interval
  const progressRef = useRef(0);
  const successRef = useRef(false);
  const errorRef = useRef(false);

  useEffect(() => {
    successRef.current = isSuccess;
  }, [isSuccess]);

  useEffect(() => {
    errorRef.current = isError;
  }, [isError]);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(0);
      progressRef.current = 0;
      setTipIndex(0);
      return;
    }

    // Interval for progress: 0 to 90 over 20 seconds.
    // 20s = 20000ms. We update every 200ms -> 100 steps.
    // 90% in 100 steps -> 0.9% per step.
    const progressInterval = setInterval(() => {
      if (errorRef.current) {
        clearInterval(progressInterval);
        return;
      }
      if (successRef.current) {
        setProgress(100);
        progressRef.current = 100;
        clearInterval(progressInterval);
        return;
      }
      
      if (progressRef.current < 90) {
        const next = Math.min(90, progressRef.current + 0.9);
        progressRef.current = next;
        setProgress(next);
      }
    }, 200);

    // Interval for tips: Every 3.5 seconds
    const tipsInterval = setInterval(() => {
      if (errorRef.current || successRef.current) return;
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipsInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* We do NOT attach an onClick to the backdrop to prevent closing */}
      <div className="neo-card p-8 w-full max-w-md relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Success Confetti/Background Effects */}
        {isSuccess && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse-slow" />
        )}
        {isError && (
          <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
        )}

        {isSuccess ? (
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pop-in">
            <FaCheck />
          </div>
        ) : isError ? (
          <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-3xl mb-4 animate-pop-in">
            <FaXmark />
          </div>
        ) : (
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-bgElevated rounded-full" />
            <div className="absolute inset-0 border-4 border-accentPrimary rounded-full border-t-transparent animate-spin" />
          </div>
        )}

        <h3 className="text-xl font-bold text-textPrimary mb-6">
          {isSuccess ? 'Data Successfully Loaded!' : isError ? 'Failed to Fetch Data' : 'Initializing Draw...'}
        </h3>

        {/* Progress Bar Container */}
        <div className="w-full h-3 bg-bgElevated rounded-full overflow-hidden mb-6 border border-borderSubtle relative">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full relative overflow-hidden ${
              isError ? 'bg-red-500' : isSuccess ? 'bg-emerald-500' : 'bg-accentPrimary'
            }`}
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect inside progress bar */}
            {!isError && !isSuccess && (
              <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ transform: 'skewX(-20deg)' }} />
            )}
          </div>
        </div>

        {/* Dynamic Text / Error Message */}
        <div className="h-10 flex items-center justify-center w-full">
          {isError ? (
            <p className="text-sm font-semibold text-red-500 leading-tight">
              {errorMessage}
            </p>
          ) : isSuccess ? (
            <p className="text-sm font-semibold text-emerald-500 leading-tight">
              Redirecting to verification dashboard...
            </p>
          ) : (
            <p
              key={tipIndex}
              className="text-sm font-medium text-textSecondary animate-fade-in-up text-center leading-relaxed"
            >
              {TIPS[tipIndex]}
            </p>
          )}
        </div>

        {/* Warning Note */}
        {!isError && !isSuccess && (
          <div className="mt-2 text-xs font-semibold text-orange-400/90 flex items-center justify-center gap-2 animate-fade-in">
            <span>⚠️</span> Please do not exit or refresh the page.
          </div>
        )}

        {/* Close button only on error */}
        {isError && (
          <button
            onClick={onCloseError}
            className="mt-6 neo-button-primary !bg-bgBase !border-red-500/50 !text-red-500 hover:!bg-red-500 hover:!text-white w-full h-12"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
