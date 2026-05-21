export interface VerifyStep {
  label: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
}

export interface VerifySlot {
  username: string;
  steps: VerifyStep[];
  status: 'verifying' | 'verified' | 'failed';
  redraws: number;
  commentProofUrl?: string;
}

export type Phase = 'configure' | 'verify' | 'finalize';
