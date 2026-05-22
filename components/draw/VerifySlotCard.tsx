import { useState, useEffect } from 'react';
import { type VerifySlot } from './types';
import Avatar from '../ui/Avatar';

export default function VerifySlotCard({ slot, kind, index, participants = [] }: { slot: VerifySlot; kind: 'primary' | 'secondary'; index: number; participants?: string[] }) {
  const [displayUsername, setDisplayUsername] = useState(slot.username);

  useEffect(() => {
    if (slot.status !== 'drawing' || participants.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayUsername(slot.username);
      return;
    }

    const interval = setInterval(() => {
      const randomUser = participants[Math.floor(Math.random() * participants.length)];
      setDisplayUsername(randomUser);
    }, 70);

    return () => clearInterval(interval);
  }, [slot.status, slot.username, participants]);

  const borderColor =
    slot.status === 'verified'
      ? 'border-l-4 border-l-emerald-500'
      : slot.status === 'failed'
      ? 'border-l-4 border-l-red-500'
      : slot.status === 'drawing'
      ? 'border-l-4 border-l-accentPrimary animate-pulse'
      : 'border-l-4 border-l-amber-400';

  return (
    <div className={`neo-card p-4 ${borderColor} animate-fade-in-up`}>
      <div className="flex items-start gap-4">
        <div className={slot.status === 'drawing' ? 'blur-[1px] transition-all duration-75' : 'transition-all duration-300'}>
          <Avatar username={displayUsername} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-bold ${
                slot.status === 'failed' ? 'line-through text-textMuted' : 'text-textPrimary'
              } ${slot.status === 'drawing' ? 'opacity-70 blur-[0.5px] transition-all duration-75' : 'transition-all duration-300'}`}
            >
              @{displayUsername}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-textMuted">
              {kind === 'primary' ? `Primary #${index + 1}` : `Backup #${index + 1}`}
            </span>
          </div>

          {slot.status === 'verified' && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-500">✅ Verified Winner</span>
              {slot.redraws > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-bgElevated border border-borderSubtle text-textMuted">
                  Verified after {slot.redraws} auto-redraw{slot.redraws > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {slot.status === 'failed' && (
            <p className="text-xs font-bold text-red-500 mb-1">
              ❌ Failed: {slot.steps.find((s) => s.status === 'failed')?.label ?? 'Verification'}
            </p>
          )}

          {/* Step list */}
          <div className="space-y-1.5 mt-2">
            {slot.steps.map((step, si) => (
              <div key={si} className="flex items-center gap-2 text-xs">
                {step.status === 'pending' && <span className="w-4 h-4 flex items-center justify-center text-textMuted">○</span>}
                {step.status === 'checking' && (
                  <span className="w-4 h-4 flex items-center justify-center">
                    <span className="block w-3 h-3 rounded-full border-2 border-accentPrimary border-t-transparent animate-spin" />
                  </span>
                )}
                {step.status === 'passed' && <span className="w-4 h-4 flex items-center justify-center text-emerald-500">✅</span>}
                {step.status === 'failed' && <span className="w-4 h-4 flex items-center justify-center text-red-500">❌</span>}
                <span className={step.status === 'failed' ? 'text-red-400' : 'text-textSecondary'}>{step.label}</span>
              </div>
            ))}
          </div>

          {slot.commentProofUrl && slot.status === 'verified' && (
            <a
              href={slot.commentProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-teal-400 hover:underline"
            >
              🔗 View Comment Proof
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
