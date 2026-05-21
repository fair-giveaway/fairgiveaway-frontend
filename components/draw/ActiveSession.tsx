'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaCopy, FaDice, FaLock, FaMedal, FaTrophy, FaUserGroup, FaXTwitter,
  FaCheck, FaPlus, FaMinus, FaHeart, FaComment, FaUserPlus, FaLink,
  FaShieldHalved, FaImage, FaAddressCard, FaClock, FaChartBar,
} from 'react-icons/fa6';
import { selectWinners, type DrawResult } from '@/lib/fairDraw';
import { saveDraw, type DrawStatusResult } from '@/lib/api';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  drawId: string;
  data: DrawStatusResult;
  onFinalized: () => void;
}

interface VerifyStep {
  label: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
}

interface VerifySlot {
  username: string;
  steps: VerifyStep[];
  status: 'verifying' | 'verified' | 'failed';
  redraws: number;
  commentProofUrl?: string;
}

type Phase = 'configure' | 'verify' | 'finalize';

/* ------------------------------------------------------------------ */
/*  Toggle Switch                                                      */
/* ------------------------------------------------------------------ */

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <label htmlFor={id} className="relative inline-flex cursor-pointer items-center shrink-0">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="h-6 w-11 rounded-full bg-borderStrong transition-colors peer-checked:bg-accentPrimary" />
      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide-down wrapper                                                 */
/* ------------------------------------------------------------------ */

function SlideDown({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        open ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Participant List                                                   */
/* ------------------------------------------------------------------ */

function ParticipantList({ participants }: { participants: string[] }) {
  return (
    <div className="h-48 overflow-y-auto rounded-xl border border-borderStrong bg-bgBase p-4 shadow-inner">
      <div className="flex flex-wrap gap-2">
        {participants.map((p, i) => (
          <span key={i} className="text-xs text-textSecondary truncate px-2 py-1 rounded-lg bg-bgElevated border border-borderSubtle">
            @{p}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-textSecondary mb-3">{label}</label>}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center border border-borderStrong bg-bgElevated text-textPrimary hover:bg-bgBase hover:border-accentPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaMinus />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              onChange(Math.max(min, Math.min(max ?? Infinity, val)));
            }
          }}
          className="flex-1 w-0 h-12 rounded-xl border border-borderStrong bg-bgBase text-center text-lg font-bold text-textPrimary outline-none focus:border-accentPrimary transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
        />
        <button
          onClick={() => onChange(Math.min(max ?? Infinity, value + 1))}
          disabled={max !== undefined && value >= max}
          className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center border border-borderStrong bg-bgElevated text-textPrimary hover:bg-bgBase hover:border-accentPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verification Slot Card                                             */
/* ------------------------------------------------------------------ */

function VerifySlotCard({ slot, kind, index }: { slot: VerifySlot; kind: 'primary' | 'secondary'; index: number }) {
  const borderColor =
    slot.status === 'verified'
      ? 'border-l-4 border-l-emerald-500'
      : slot.status === 'failed'
      ? 'border-l-4 border-l-red-500'
      : 'border-l-4 border-l-amber-400';

  return (
    <div className={`neo-card p-4 ${borderColor} animate-fade-in-up`}>
      <div className="flex items-start gap-4">
        <img
          src={`https://unavatar.io/twitter/${slot.username}`}
          alt={slot.username}
          className="w-12 h-12 rounded-full border border-borderStrong object-cover bg-bgElevated shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-bold ${
                slot.status === 'failed' ? 'line-through text-textMuted' : 'text-textPrimary'
              }`}
            >
              @{slot.username}
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

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function ActiveSession({ drawId, data, onFinalized }: Props) {
  const router = useRouter();
  const participants = data.participants || [];

  /* ---- phase ---- */
  const [phase, setPhase] = useState<Phase>('configure');

  /* ---- winner counts ---- */
  const [primaryCount, setPrimaryCount] = useState(1);
  const [secondaryCount, setSecondaryCount] = useState(0);

  /* ---- engagement toggles ---- */
  const [mustLike, setMustLike] = useState(false);
  const [mustComment, setMustComment] = useState(false);
  const [mustFollow, setMustFollow] = useState(false);
  const [followUsernames, setFollowUsernames] = useState<string[]>(['']);
  const [mustExternal, setMustExternal] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [extMustLike, setExtMustLike] = useState(false);
  const [extMustRepost, setExtMustRepost] = useState(false);
  const [extMustComment, setExtMustComment] = useState(false);
  const [extMustQuote, setExtMustQuote] = useState(false);

  /* ---- anti-bot toggles ---- */
  const [mustPfp, setMustPfp] = useState(false);
  const [mustBio, setMustBio] = useState(false);
  const [mustAge, setMustAge] = useState(false);
  const [minMonths, setMinMonths] = useState(3);
  const [mustActivity, setMustActivity] = useState(false);
  const [minPosts, setMinPosts] = useState(10);

  /* ---- pool & verification ---- */
  const [pool, setPool] = useState<string[]>(participants);
  const poolRef = useRef<string[]>(participants);
  const [slots, setSlots] = useState<VerifySlot[]>([]);
  const slotsRef = useRef<VerifySlot[]>([]);

  /* ---- finalize ---- */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const maxWinners = participants.length;

  // keep refs in sync
  useEffect(() => { poolRef.current = pool; }, [pool]);
  useEffect(() => { slotsRef.current = slots; }, [slots]);

  /* ---- clipboard ---- */
  const copyUrl = () => {
    navigator.clipboard.writeText(drawId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---- build steps based on enabled toggles ---- */
  const buildSteps = useCallback((): VerifyStep[] => {
    const steps: VerifyStep[] = [];
    if (mustLike) steps.push({ label: 'Checking Like status...', status: 'pending' });
    if (mustComment) steps.push({ label: 'Checking Comment status...', status: 'pending' });
    if (mustFollow) {
      const validSponsors = followUsernames.filter(u => u.trim() !== '');
      if (validSponsors.length > 0) {
        steps.push({ label: `Verifying Follow on ${validSponsors.map(u => '@' + u).join(', ')}...`, status: 'pending' });
      }
    }
    if (mustExternal && externalUrl.trim()) {
      if (extMustLike) steps.push({ label: 'Checking external post Like...', status: 'pending' });
      if (extMustRepost) steps.push({ label: 'Checking external post Repost...', status: 'pending' });
      if (extMustComment) steps.push({ label: 'Checking external post Comment...', status: 'pending' });
      if (extMustQuote) steps.push({ label: 'Checking external post Quote...', status: 'pending' });
      if (!extMustLike && !extMustRepost && !extMustComment && !extMustQuote) {
        steps.push({ label: 'Checking external post interaction...', status: 'pending' });
      }
    }
    if (mustPfp) steps.push({ label: 'Checking Profile Picture & Banner...', status: 'pending' });
    if (mustBio) steps.push({ label: 'Checking Bio text...', status: 'pending' });
    if (mustAge) steps.push({ label: 'Verifying account age...', status: 'pending' });
    if (mustActivity) steps.push({ label: 'Checking post/activity count...', status: 'pending' });
    return steps;
  }, [mustLike, mustComment, mustFollow, followUsernames, mustExternal, externalUrl, extMustLike, extMustRepost, extMustComment, extMustQuote, mustPfp, mustBio, mustAge, mustActivity]);

  /* ---- pick a random candidate from pool, excluding some ---- */
  const pickCandidate = useCallback((currentPool: string[], exclude: Set<string>): string | null => {
    const available = currentPool.filter((p) => !exclude.has(p));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }, []);

  /* ---- ROLL: kick off the verify loop ---- */
  const handleRoll = useCallback(() => {
    if (primaryCount + secondaryCount > maxWinners) {
      setError('Total winners exceed participant count.');
      return;
    }
    setError('');
    setPhase('verify');

    // initial draw
    const result = selectWinners(participants, primaryCount, secondaryCount);
    const allCandidates = [...result.primary, ...result.secondary];

    const initialSlots: VerifySlot[] = allCandidates.map((username) => ({
      username,
      steps: buildSteps(),
      status: 'verifying' as const,
      redraws: 0,
    }));

    setSlots(initialSlots);
    slotsRef.current = initialSlots;

    // remove initial candidates from pool
    const usedSet = new Set(allCandidates);
    const newPool = participants.filter((p) => !usedSet.has(p));
    setPool(newPool);
    poolRef.current = newPool;
  }, [primaryCount, secondaryCount, maxWinners, participants, buildSteps]);

  /* ---- Async verification loop via useEffect ---- */
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (phase !== 'verify') return;
    if (verificationStarted.current) return;
    if (slots.length === 0) return;
    verificationStarted.current = true;

    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const randomDelay = () => 800 + Math.random() * 400;

    const verifyAll = async () => {
      const totalSlots = slotsRef.current.length;

      for (let si = 0; si < totalSlots; si++) {
        let verified = false;

        while (!verified) {
          const currentSlot = slotsRef.current[si];
          const steps = currentSlot.steps;

          let passedAll = true;

          for (let sti = 0; sti < steps.length; sti++) {
            // set step to checking
            setSlots((prev) => {
              const next = [...prev];
              const slot = { ...next[si], steps: [...next[si].steps] };
              slot.steps[sti] = { ...slot.steps[sti], status: 'checking' };
              next[si] = slot;
              return next;
            });

            await delay(randomDelay());

            // random pass/fail (~75% pass)
            const passed = Math.random() < 0.75;

            setSlots((prev) => {
              const next = [...prev];
              const slot = { ...next[si], steps: [...next[si].steps] };
              slot.steps[sti] = { ...slot.steps[sti], status: passed ? 'passed' : 'failed' };
              if (!passed) slot.status = 'failed';
              next[si] = slot;
              return next;
            });

            if (!passed) {
              passedAll = false;
              break;
            }
          }

          if (passedAll) {
            // mark verified
            const finalUsername = slotsRef.current[si].username;
            const commentEnabled = buildSteps().some((s) => s.label.startsWith('Checking Comment'));
            const commentUrl = commentEnabled
              ? `https://x.com/i/status/${data.tweetId}#comment_${finalUsername}`
              : undefined;

            setSlots((prev) => {
              const next = [...prev];
              next[si] = { ...next[si], status: 'verified', commentProofUrl: commentUrl };
              return next;
            });

            // remove from pool
            setPool((prev) => prev.filter((p) => p !== finalUsername));
            poolRef.current = poolRef.current.filter((p) => p !== finalUsername);

            verified = true;
          } else {
            // failed — eject from pool, pick new candidate
            const failedUser = slotsRef.current[si].username;
            setPool((prev) => prev.filter((p) => p !== failedUser));
            poolRef.current = poolRef.current.filter((p) => p !== failedUser);

            await delay(300);

            // collect all usernames already in use
            const usedNames = new Set(slotsRef.current.map((s) => s.username));
            const replacement = pickCandidate(poolRef.current, usedNames);

            if (!replacement) {
              // no more candidates available — leave slot as failed
              verified = true;
              break;
            }

            const redraws = slotsRef.current[si].redraws + 1;

            setSlots((prev) => {
              const next = [...prev];
              next[si] = {
                username: replacement,
                steps: buildSteps(),
                status: 'verifying',
                redraws,
              };
              return next;
            });

            // need to wait a tick so slotsRef updates
            await delay(50);
          }
        }
      }

      // all done — automatically finalize and redirect
      setPhase('finalize'); // Just to show a "Locking Draw..." status briefly
      setSaving(true);
      
      const verifiedSlots = slotsRef.current.filter((s) => s.status === 'verified');
      const pCount = primaryCount;
      const allWinners = verifiedSlots.map((s, i) => ({
        username: s.username,
        type: i < pCount ? 'primary' : 'secondary',
        status: 'verified',
      }));

      try {
        await saveDraw({
          drawId,
          tweetId: data.tweetId || '',
          hostUsername: 'Anonymous',
          mode: data.mode || 'reposts',
          totalParticipants: participants.length,
          winners: allWinners,
        });
        // Immediately redirect to history
        router.push(`/history/x/${drawId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to finalize draw.');
        setSaving(false);
      }
    };

    verifyAll();

    return () => {
      verificationStarted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, slots.length]);

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
      {/* ============================================================ */}
      {/*  LEFT COLUMN                                                  */}
      {/* ============================================================ */}
      <div className="lg:col-span-4 space-y-6">
        {/* Draw Session metadata */}
        <div className="neo-card p-6">
          <div className="flex items-center justify-between mb-6 border-b border-borderSubtle pb-4">
            <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2">
              <FaXTwitter className="text-accentPrimary" /> Draw Session
            </h2>
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 rounded-lg border border-borderStrong bg-bgBase px-3 py-1.5 text-xs font-semibold text-textSecondary hover:border-accentPrimary hover:text-accentPrimary transition-colors"
              title="Copy Draw ID"
            >
              {drawId.slice(0, 8)}… {copied ? <FaCheck className="text-accentPrimary" /> : <FaCopy />}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <span className="neo-label-sm mb-1 block">Target Tweet</span>
              <a
                href={`https://x.com/i/status/${data.tweetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-accentPrimary hover:underline break-all"
              >
                {data.tweetId}
              </a>
            </div>
            <div>
              <span className="neo-label-sm mb-1 block">Mode</span>
              <span className="text-sm font-semibold capitalize text-textPrimary">{data.mode}</span>
            </div>
          </div>
        </div>

        {/* Eligible Entries */}
        <div className="neo-card p-6">
          <h3 className="mb-4 flex items-center justify-between text-sm font-bold text-textPrimary">
            <span className="flex items-center gap-2">
              <FaUserGroup className="text-textMuted" /> Eligible Entries
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-accentPrimary/15 text-accentPrimary font-bold border border-accentPrimary/30">
              {participants.length}
            </span>
          </h3>
          <ParticipantList participants={participants} />
        </div>
      </div>

      {/* ============================================================ */}
      {/*  RIGHT COLUMN                                                 */}
      {/* ============================================================ */}
      <div className="lg:col-span-8 space-y-6">
        {/* ---------------------------------------------------------- */}
        {/*  PHASE 1: CONFIGURE                                         */}
        {/* ---------------------------------------------------------- */}
        {phase === 'configure' && (
          <>
            {/* Section A: Engagement Tasks */}
            <div className="neo-card p-6">
              <h3 className="mb-6 text-lg font-bold text-textPrimary flex items-center gap-2 border-b border-borderSubtle pb-4">
                <FaHeart className="text-accentPrimary" /> Engagement Tasks
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Like */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                  <label htmlFor="toggle-like" className="text-sm font-medium text-textSecondary cursor-pointer">
                    Must also <strong className="text-textPrimary">LIKE</strong> the post
                  </label>
                  <Toggle checked={mustLike} onChange={setMustLike} id="toggle-like" />
                </div>

                {/* Comment */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                  <label htmlFor="toggle-comment" className="text-sm font-medium text-textSecondary cursor-pointer">
                    Must also <strong className="text-textPrimary">COMMENT</strong> on the post
                  </label>
                  <Toggle checked={mustComment} onChange={setMustComment} id="toggle-comment" />
                </div>

                {/* Follow */}
                <div className="sm:col-span-2 flex flex-col p-3 rounded-xl border border-borderSubtle bg-bgBase">
                  <div className="flex items-center justify-between">
                    <label htmlFor="toggle-follow" className="text-sm font-medium text-textSecondary cursor-pointer">
                      Must <strong className="text-textPrimary">FOLLOW</strong> the host / sponsor accounts
                    </label>
                    <Toggle checked={mustFollow} onChange={setMustFollow} id="toggle-follow" />
                  </div>
                  <SlideDown open={mustFollow}>
                    <div className="mt-2 pt-2 border-t border-borderSubtle">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                        {followUsernames.map((u, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={u}
                              onChange={(e) => {
                                const newU = [...followUsernames];
                                newU[i] = e.target.value;
                                setFollowUsernames(newU);
                              }}
                              placeholder="@sponsor_username"
                              className="neo-input flex-1"
                            />
                            {followUsernames.length > 1 && (
                              <button
                                onClick={() => {
                                  const newU = followUsernames.filter((_, idx) => idx !== i);
                                  setFollowUsernames(newU);
                                }}
                                className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              >
                                <FaMinus />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setFollowUsernames([...followUsernames, ''])}
                        className="text-sm font-semibold text-accentPrimary hover:text-accentPrimary/80 flex items-center gap-1.5"
                      >
                        <FaPlus className="text-xs" /> Add Sponsor
                      </button>
                    </div>
                  </SlideDown>
                </div>
              </div>
            </div>

            {/* Section A2: External Post Interaction */}
            <div className="neo-card p-6">
              <h3 className="mb-6 text-lg font-bold text-textPrimary flex items-center justify-between border-b border-borderSubtle pb-4">
                <span className="flex items-center gap-2"><FaLink className="text-accentPrimary" /> External Post Interaction</span>
                <Toggle checked={mustExternal} onChange={setMustExternal} id="toggle-external-main" />
              </h3>

              <div className={`space-y-5 transition-all duration-300 ${mustExternal ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div>
                  <span className="neo-label-sm mb-2 block">Target External Post URL</span>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://x.com/sponsor/status/1234567890"
                    className="neo-input mb-4"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                    <label htmlFor="ext-like" className="text-sm font-medium text-textSecondary cursor-pointer">Like</label>
                    <Toggle checked={extMustLike} onChange={setExtMustLike} id="ext-like" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                    <label htmlFor="ext-repost" className="text-sm font-medium text-textSecondary cursor-pointer">Repost</label>
                    <Toggle checked={extMustRepost} onChange={setExtMustRepost} id="ext-repost" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                    <label htmlFor="ext-comment" className="text-sm font-medium text-textSecondary cursor-pointer">Comment</label>
                    <Toggle checked={extMustComment} onChange={setExtMustComment} id="ext-comment" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                    <label htmlFor="ext-quote" className="text-sm font-medium text-textSecondary cursor-pointer">Quote</label>
                    <Toggle checked={extMustQuote} onChange={setExtMustQuote} id="ext-quote" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Anti-Bot Filters */}
            <div className="neo-card p-6">
              <h3 className="mb-6 text-lg font-bold text-textPrimary flex items-center gap-2 border-b border-borderSubtle pb-4">
                <FaShieldHalved className="text-accentPrimary" /> Anti-Bot Filters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Profile Picture & Banner */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                  <label htmlFor="toggle-pfp" className="text-sm font-medium text-textSecondary cursor-pointer flex items-center gap-2">
                    <FaImage className="text-textMuted" /> Must have <strong className="text-textPrimary">PFP &amp; Banner</strong>
                  </label>
                  <Toggle checked={mustPfp} onChange={setMustPfp} id="toggle-pfp" />
                </div>

                {/* Bio */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-borderSubtle bg-bgBase">
                  <label htmlFor="toggle-bio" className="text-sm font-medium text-textSecondary cursor-pointer flex items-center gap-2">
                    <FaAddressCard className="text-textMuted" /> Must have <strong className="text-textPrimary">Bio text</strong>
                  </label>
                  <Toggle checked={mustBio} onChange={setMustBio} id="toggle-bio" />
                </div>

                {/* Min Account Age */}
                <div className="flex flex-col p-3 rounded-xl border border-borderSubtle bg-bgBase">
                  <div className="flex items-center justify-between">
                    <label htmlFor="toggle-age" className="text-sm font-medium text-textSecondary cursor-pointer flex items-center gap-2">
                      <FaClock className="text-textMuted" /> Min <strong className="text-textPrimary">Account Age</strong>
                    </label>
                    <Toggle checked={mustAge} onChange={setMustAge} id="toggle-age" />
                  </div>
                  <SlideDown open={mustAge}>
                    <div className="mt-3 pt-3 border-t border-borderSubtle">
                      <Stepper
                        label="Minimum Months Old"
                        value={minMonths}
                        min={1}
                        onChange={setMinMonths}
                      />
                    </div>
                  </SlideDown>
                </div>

                {/* Min Activity */}
                <div className="flex flex-col p-3 rounded-xl border border-borderSubtle bg-bgBase">
                  <div className="flex items-center justify-between">
                    <label htmlFor="toggle-activity" className="text-sm font-medium text-textSecondary cursor-pointer flex items-center gap-2">
                      <FaChartBar className="text-textMuted" /> Min <strong className="text-textPrimary">Post Count</strong>
                    </label>
                    <Toggle checked={mustActivity} onChange={setMustActivity} id="toggle-activity" />
                  </div>
                  <SlideDown open={mustActivity}>
                    <div className="mt-3 pt-3 border-t border-borderSubtle">
                      <Stepper
                        label="Minimum Posts"
                        value={minPosts}
                        min={1}
                        onChange={setMinPosts}
                      />
                    </div>
                  </SlideDown>
                </div>
              </div>
            </div>

            {/* Winner Count Steppers */}
            <div className="neo-card p-8">
              <h3 className="mb-6 text-xl font-bold text-textPrimary border-b border-borderSubtle pb-4">
                Winner Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <Stepper
                  label="Primary Winners"
                  value={primaryCount}
                  min={1}
                  max={maxWinners}
                  onChange={setPrimaryCount}
                />
                <Stepper
                  label="Secondary (Backup)"
                  value={secondaryCount}
                  min={0}
                  max={maxWinners}
                  onChange={setSecondaryCount}
                />
              </div>
              <button
                onClick={handleRoll}
                disabled={participants.length === 0}
                className="neo-button-primary w-full h-14 text-lg flex items-center justify-center gap-2"
              >
                <FaDice /> Roll Fair Winners
              </button>
            </div>
          </>
        )}

        {/* ---------------------------------------------------------- */}
        {/*  PHASE 2: VERIFY                                            */}
        {/* ---------------------------------------------------------- */}
        {phase === 'verify' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <FaDice className="text-accentPrimary animate-pulse-slow text-xl" />
              <h3 className="text-lg font-bold text-textPrimary">Verifying Candidates…</h3>
            </div>

            {/* Primary slots */}
            {slots.slice(0, primaryCount).map((slot, i) => (
              <VerifySlotCard key={`p-${i}-${slot.username}`} slot={slot} kind="primary" index={i} />
            ))}

            {/* Secondary slots */}
            {slots.slice(primaryCount).map((slot, i) => (
              <VerifySlotCard key={`s-${i}-${slot.username}`} slot={slot} kind="secondary" index={i} />
            ))}
          </div>
        )}

        {/* ---------------------------------------------------------- */}
        {/*  PHASE 3: FINALIZE                                          */}
        {/* ---------------------------------------------------------- */}
        {phase === 'finalize' && (
          <div className="neo-card p-12 text-center animate-fade-in-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accentPrimary/10 text-2xl text-accentPrimary">
              <FaLock className={saving ? "animate-pulse" : ""} />
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">
              Locking Draw...
            </h3>
            <p className="text-textSecondary">
              Saving results to the blockchain/database and redirecting to the official history page.
            </p>
          </div>
        )}

        {error && <p className="mt-4 text-red-500 font-medium text-sm">{error}</p>}
      </div>
    </div>
  );
}
