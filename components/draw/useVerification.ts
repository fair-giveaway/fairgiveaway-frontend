import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveDraw, type DrawStatusResult } from '@/lib/api';
import { selectWinners } from '@/lib/fairDraw';
import { type VerifySlot, type VerifyStep, type Phase } from './types';

interface VerificationProps {
  drawId: string;
  data: DrawStatusResult;
  primaryCount: number;
  secondaryCount: number;
  buildSteps: () => VerifyStep[];
  setPhase: (phase: Phase) => void;
  setError: (error: string) => void;
  phase: Phase;
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const randomDelay = () => 800 + Math.random() * 400;

export function useVerification({
  drawId,
  data,
  primaryCount,
  secondaryCount,
  buildSteps,
  setPhase,
  setError,
  phase,
}: VerificationProps) {
  const router = useRouter();
  const participants = data.participants || [];
  
  const [pool, setPool] = useState<string[]>(participants);
  const poolRef = useRef<string[]>(participants);
  const [slots, setSlots] = useState<VerifySlot[]>([]);
  const slotsRef = useRef<VerifySlot[]>([]);
  const [saving, setSaving] = useState(false);
  const verificationStarted = useRef(false);

  useEffect(() => { poolRef.current = pool; }, [pool]);
  useEffect(() => { slotsRef.current = slots; }, [slots]);

  const pickCandidate = useCallback((currentPool: string[], exclude: Set<string>): string | null => {
    const available = currentPool.filter((p) => !exclude.has(p));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }, []);

  const handleRoll = useCallback(() => {
    if (primaryCount + secondaryCount > participants.length) {
      setError('Total winners exceed participant count.');
      return;
    }
    setError('');
    setPhase('verify');

    const result = selectWinners(participants, primaryCount, secondaryCount);
    const allCandidates = [...result.primary, ...result.secondary];

    const initialSlots: VerifySlot[] = allCandidates.map((username) => ({
      username,
      steps: buildSteps(),
      status: 'verifying' as const,
      redraws: 0,
    }));

    setSlots(initialSlots);
    const usedSet = new Set(allCandidates);
    setPool(participants.filter((p) => !usedSet.has(p)));
  }, [primaryCount, secondaryCount, participants, buildSteps, setError, setPhase]);

  const updateStepStatus = (si: number, sti: number, status: VerifyStep['status'], failed: boolean) => {
    setSlots((prev) => {
      const next = [...prev];
      const slot = { ...next[si], steps: [...next[si].steps] };
      slot.steps[sti] = { ...slot.steps[sti], status };
      if (failed) slot.status = 'failed';
      next[si] = slot;
      return next;
    });
  };

  const processSlotStep = async (si: number, sti: number): Promise<boolean> => {
    updateStepStatus(si, sti, 'checking', false);
    await delay(randomDelay());
    const passed = Math.random() < 0.75;
    updateStepStatus(si, sti, passed ? 'passed' : 'failed', !passed);
    return passed;
  };

  const finalizeSlot = (si: number, username: string) => {
    const commentEnabled = buildSteps().some((s) => s.label.startsWith('Checking Comment'));
    const commentUrl = commentEnabled ? `https://x.com/i/status/${data.tweetId}#comment_${username}` : undefined;
    
    setSlots((prev) => {
      const next = [...prev];
      next[si] = { ...next[si], status: 'verified', commentProofUrl: commentUrl };
      return next;
    });
    setPool((prev) => prev.filter((p) => p !== username));
  };

  const replaceSlot = async (si: number, failedUser: string): Promise<boolean> => {
    setPool((prev) => prev.filter((p) => p !== failedUser));
    await delay(300);
    const usedNames = new Set(slotsRef.current.map((s) => s.username));
    const replacement = pickCandidate(poolRef.current, usedNames);
    
    if (!replacement) return false;
    
    setSlots((prev) => {
      const next = [...prev];
      next[si] = { username: replacement, steps: buildSteps(), status: 'verifying', redraws: next[si].redraws + 1 };
      return next;
    });
    await delay(50);
    return true;
  };

  const processSingleSlot = async (si: number): Promise<void> => {
    let verified = false;
    while (!verified) {
      const steps = slotsRef.current[si].steps;
      let passedAll = true;

      for (let sti = 0; sti < steps.length; sti++) {
        const passed = await processSlotStep(si, sti);
        if (!passed) { passedAll = false; break; }
      }

      if (passedAll) {
        finalizeSlot(si, slotsRef.current[si].username);
        verified = true;
      } else {
        const hasReplacement = await replaceSlot(si, slotsRef.current[si].username);
        if (!hasReplacement) verified = true;
      }
    }
  };

  const completeDraw = async () => {
    setPhase('finalize');
    setSaving(true);
    
    const verifiedSlots = slotsRef.current.filter((s) => s.status === 'verified');
    const allWinners = verifiedSlots.map((s, i) => ({
      username: s.username,
      type: i < primaryCount ? ('primary' as const) : ('secondary' as const),
      status: 'verified' as const,
      avatarUrl: `https://unavatar.io/twitter/${s.username}`,
    }));

    // TODO:BACKEND — hostAvatarUrl and winner avatarUrl will come from the backend
    // scraper (sacrificial X account) instead of unavatar.io
    const host = data.hostUsername || 'unknown';

    try {
      await saveDraw({
        drawId,
        tweetId: data.tweetId || '',
        hostUsername: host,
        hostAvatarUrl: host !== 'unknown' ? `https://unavatar.io/twitter/${host}` : undefined,
        mode: data.mode || 'reposts',
        totalParticipants: participants.length,
        winners: allWinners,
      });
      router.push(`/history/x/${drawId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize draw.');
      setSaving(false);
    }
  };

  useEffect(() => {
    if (phase !== 'verify' || verificationStarted.current || slots.length === 0) return;
    verificationStarted.current = true;

    const verifyAll = async () => {
      for (let si = 0; si < slotsRef.current.length; si++) {
        await processSingleSlot(si);
      }
      await completeDraw();
    };

    verifyAll();
    return () => { verificationStarted.current = false; };
  }, [phase, slots.length]);

  return { slots, saving, handleRoll };
}
