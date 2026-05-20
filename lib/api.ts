const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';

export interface Winner {
  username: string;
  type: string;
  status: string;
}

export interface GiveawayDoc {
  _id: string;
  tweetId: string;
  hostUsername: string;
  platform: string;
  mode: string;
  totalParticipants: number;
  winners: Winner[];
  createdAt: string;
}

export interface DrawSearchResult {
  found: boolean;
  platform?: string;
}

export interface DrawInitResult {
  drawId: string;
  participantCount: number;
}

export interface DrawStatusResult {
  status: 'active' | 'finalized';
  participants?: string[];
  data?: GiveawayDoc;
  drawId?: string;
  mode?: string;
  tweetId?: string;
}

export interface LeaderboardEntry {
  _id: string;
  totalGiveaways: number;
  totalParticipants: number;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}

export function searchDraw(drawId: string) {
  return apiFetch<DrawSearchResult>('/api/draw/search', {
    method: 'POST',
    body: JSON.stringify({ drawId }),
  });
}

export function initDraw(tweetId: string, mode: string) {
  return apiFetch<DrawInitResult>('/api/x/draw/init', {
    method: 'POST',
    body: JSON.stringify({ tweetId, mode }),
  });
}

export function getDrawStatus(id: string) {
  return apiFetch<DrawStatusResult>(`/api/x/draw/status/${id}`);
}

export interface SaveDrawPayload {
  drawId: string;
  tweetId: string;
  hostUsername: string;
  mode: string;
  totalParticipants: number;
  winners: Winner[];
}

export function saveDraw(data: SaveDrawPayload) {
  return apiFetch<{ success: boolean }>('/api/x/draw/save', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getHistory() {
  return apiFetch<GiveawayDoc[]>('/api/x/giveaways/history');
}

export function getLeaderboard() {
  return apiFetch<LeaderboardEntry[]>('/api/x/giveaways/leaderboard');
}
