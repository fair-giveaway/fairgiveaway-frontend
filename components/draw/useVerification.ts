import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { saveDraw, verifyCandidate, type DrawStatusResult } from '@/lib/api';
import { selectWinners } from '@/lib/fairDraw';
import type { VerifySlot, VerifyStep, Phase } from './types';
export type { VerifySlot, VerifyStep, Phase };

interface VerificationProps {
  drawId: string;
  data: DrawStatusResult;
  primaryCount: number;
  secondaryCount: number;
  buildSteps: () => VerifyStep[];
  setPhase: (phase: Phase) => void;
  setError: (error: string) => void;
  phase: Phase;
  configState: Partial<import('@/lib/api').GiveawayConfig>;
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
  configState,
}: VerificationProps) {
  const router = useRouter();
  const participants = useMemo(() => data.participants || [], [data.participants]);
  
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
      status: 'drawing' as const,
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

  const processSlotStep = async (si: number, sti: number, realPassed: boolean): Promise<boolean> => {
    updateStepStatus(si, sti, 'checking', false);
    await delay(randomDelay());
    updateStepStatus(si, sti, realPassed ? 'passed' : 'failed', !realPassed);
    return realPassed;
  };

  const finalizeSlot = (si: number, username: string, avatarUrl: string) => {
    const commentEnabled = buildSteps().some((s) => s.label.startsWith('Checking Comment'));
    const commentUrl = commentEnabled ? `https://x.com/search?q=from%3A${username}%20conversation_id%3A${data.tweetId}&f=live` : undefined;
    
    setSlots((prev) => {
      const next = [...prev];
      const slot = { ...next[si], status: 'verified' as const, commentProofUrl: commentUrl, avatarUrl };
      next[si] = slot;
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
      // Redraws also get the drawing animation
      next[si] = { username: replacement, steps: buildSteps(), status: 'drawing', redraws: next[si].redraws + 1 };
      return next;
    });
    await delay(50);
    return true;
  };

  const processSingleSlot = async (si: number): Promise<{ username: string; avatarUrl: string } | null> => {
    let verifiedUser: { username: string; avatarUrl: string } | null = null;
    while (!verifiedUser) {
      // 1. Drawing Phase Delay
      await delay(1500); // 1.5 seconds of spinning
      
      // Transition from 'drawing' to 'verifying'
      setSlots((prev) => {
        const next = [...prev];
        if (next[si].status === 'drawing') {
          next[si] = { ...next[si], status: 'verifying' };
        }
        return next;
      });

      const currentUser = slotsRef.current[si].username;

      // 2. Call Real Verification Backend
      let vResult = null;
      try {
        vResult = await verifyCandidate(currentUser, data.tweetId || '', configState);
      } catch (err) {
        console.error("Verification failed:", err);
        // Fallback or just fail them if backend crashed
        vResult = { avatarUrl: `https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png`, passedPfp: false, passedBio: false, passedAge: false, passedActivity: false, passedComment: false };
      }

      const steps = slotsRef.current[si].steps;
      let passedAll = true;

      for (let sti = 0; sti < steps.length; sti++) {
        const lbl = steps[sti].label;
        let stepPass = true;
        
        if (lbl.includes('Profile Picture')) stepPass = vResult.passedPfp;
        if (lbl.includes('Bio')) stepPass = vResult.passedBio;
        if (lbl.includes('Account Age')) stepPass = vResult.passedAge;
        if (lbl.includes('Post Count')) stepPass = vResult.passedActivity;
        if (lbl.includes('Checking Comment')) stepPass = vResult.passedComment;

        const passed = await processSlotStep(si, sti, stepPass);
        if (!passed) { passedAll = false; break; }
      }

      if (passedAll) {
        finalizeSlot(si, currentUser, vResult.avatarUrl);
        verifiedUser = { username: currentUser, avatarUrl: vResult.avatarUrl };
      } else {
        const hasReplacement = await replaceSlot(si, currentUser);
        if (!hasReplacement) break;
      }
    }
    return verifiedUser;
  };

  const completeDraw = async (verifiedWinners: { username: string; avatarUrl: string }[]) => {
    setPhase('finalize');
    setSaving(true);
    
    const commentEnabled = buildSteps().some((s) => s.label.startsWith('Checking Comment'));

    const allWinners = verifiedWinners.map((winner, i) => {
      return {
        username: winner.username,
        type: i < primaryCount ? ('primary' as const) : ('secondary' as const),
        status: 'verified' as const,
        avatarUrl: winner.avatarUrl,
        commentProofUrl: commentEnabled ? `https://x.com/search?q=from%3A${winner.username}%20conversation_id%3A${data.tweetId}&f=live` : undefined,
      };
    });

    // TODO:BACKEND — hostAvatarUrl and winner avatarUrl will come from the backend
    // scraper (sacrificial X account) instead of unavatar.io
    const host = data.hostUsername || 'unknown';

    try {
      await saveDraw({
        drawId,
        tweetId: data.tweetId || '',
        hostUsername: host,
        hostAvatarUrl: data.hostAvatarUrl,
        mode: data.mode || 'reposts',
        totalParticipants: participants.length,
        participants: participants,
        enabledFeatures: buildSteps().map(s => s.label.replace('Checking ', '').replace('...', '')),
        engagementTasks: {
          mustLike: configState.mustLike,
          mustComment: configState.mustComment,
          mustFollow: configState.mustFollow,
          followUsernames: configState.followUsernames,
          mustExternal: configState.mustExternal,
          externalUrl: configState.externalUrl,
          extMustLike: configState.extMustLike,
          extMustRepost: configState.extMustRepost,
          extMustComment: configState.extMustComment,
          extMustQuote: configState.extMustQuote,
        },
        antiBotFilters: {
          mustPfp: configState.mustPfp,
          mustBio: configState.mustBio,
          mustAge: configState.mustAge,
          minMonths: configState.minMonths,
          mustActivity: configState.mustActivity,
          minPosts: configState.minPosts,
        },
        winners: allWinners,
      });
      
      // Add a delay so users can celebrate the result before jumping to history
      await delay(3500);
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
      const verifiedWinners: { username: string; avatarUrl: string }[] = [];
      for (let si = 0; si < slotsRef.current.length; si++) {
        const user = await processSingleSlot(si);
        if (user) verifiedWinners.push(user);
      }
      await completeDraw(verifiedWinners);
    };

    verifyAll();
    return () => { verificationStarted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, slots.length]);

  return { slots, saving, handleRoll };
}
