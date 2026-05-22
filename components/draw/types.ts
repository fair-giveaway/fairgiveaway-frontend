export interface VerifyStep {
  label: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
}

export interface VerifySlot {
  username: string;
  steps: VerifyStep[];
  status: 'drawing' | 'verifying' | 'verified' | 'failed';
  redraws: number;
  commentProofUrl?: string;
  avatarUrl?: string;
}

export type Phase = 'configure' | 'verify' | 'finalize';
