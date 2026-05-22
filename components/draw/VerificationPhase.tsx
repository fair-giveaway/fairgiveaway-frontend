import { FaDice, FaLock } from 'react-icons/fa6';
import VerifySlotCard from './VerifySlotCard';
import { type VerifySlot, type Phase } from './types';

interface VerificationProps {
  phase: Phase;
  slots: VerifySlot[];
  primaryCount: number;
  saving: boolean;
  participants: string[];
}

export default function VerificationPhase({ phase, slots, primaryCount, saving, participants }: VerificationProps) {
  if (phase === 'configure') return null;

  return (
    <div className="space-y-4">
      {phase === 'finalize' ? (
        <div className="neo-card p-12 text-center animate-fade-in-up mb-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accentPrimary/10 text-2xl text-accentPrimary">
            <FaLock className={saving ? "animate-pulse" : ""} />
          </div>
          <h3 className="text-xl font-bold text-textPrimary mb-2">
            Locking Draw...
          </h3>
          <p className="text-textSecondary">
            Saving results to the database and redirecting to the official history page.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-2">
          <FaDice className="text-accentPrimary animate-pulse-slow text-xl" />
          <h3 className="text-lg font-bold text-textPrimary">Verifying Candidates…</h3>
        </div>
      )}

      {slots.slice(0, primaryCount).map((slot, i) => (
        <VerifySlotCard key={`p-${i}-${slot.username}`} slot={slot} kind="primary" index={i} participants={participants} />
      ))}

      {slots.slice(primaryCount).map((slot, i) => (
        <VerifySlotCard key={`s-${i}-${slot.username}`} slot={slot} kind="secondary" index={i} participants={participants} />
      ))}
    </div>
  );
}
