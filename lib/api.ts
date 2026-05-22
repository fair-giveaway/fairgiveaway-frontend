const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';

export type Platform = 'X';
export type Mode = 'likes' | 'reposts';

export interface EngagementTasksConfig {
  mustLike?: boolean;
  mustComment?: boolean;
  mustFollow?: boolean;
  followUsernames?: string[];
  mustExternal?: boolean;
  externalUrl?: string;
  extMustLike?: boolean;
  extMustRepost?: boolean;
  extMustComment?: boolean;
  extMustQuote?: boolean;
}

export interface AntiBotFiltersConfig {
  mustPfp?: boolean;
  mustBio?: boolean;
  mustAge?: boolean;
  minMonths?: number;
  mustActivity?: boolean;
  minPosts?: number;
}

export interface GiveawayConfig extends EngagementTasksConfig, AntiBotFiltersConfig {}

export interface Winner {
  username: string;
  type: string;
  status: string;
  /** TODO:BACKEND — This URL will be populated by the backend scraper (sacrificial X account).
   *  The scraper fetches the real `pbs.twimg.com` profile image URL during winner verification.
   *  Current mock uses unavatar.io as a temporary placeholder. */
  avatarUrl?: string;
  commentProofUrl?: string;
}

export interface GiveawayDoc {
  _id: string;
  tweetId: string;
  hostUsername: string;
  /** TODO:BACKEND — Same as Winner.avatarUrl. The backend stores the host's real profile photo
   *  URL when initializing the draw via the sacrificial X account scraper. */
  hostAvatarUrl?: string;
  platform: Platform;
  mode: Mode;
  totalParticipants: number;
  participants?: string[];
  enabledFeatures?: string[];
  engagementTasks?: EngagementTasksConfig;
  antiBotFilters?: AntiBotFiltersConfig;
  winners: Winner[];
  createdAt: string;
}

export interface DrawSearchResult {
  found: boolean;
  platform?: Platform;
}

export interface DrawInitResult {
  drawId: string;
  participantCount: number;
  participants: string[];
  tweetId: string;
  mode: Mode;
}

export interface DrawStatusResult {
  status: 'active' | 'finalized';
  participants?: string[];
  data?: GiveawayDoc;
  drawId?: string;
  mode?: Mode;
  tweetId?: string;
  hostUsername?: string;
  hostAvatarUrl?: string;
}

export interface LeaderboardEntry {
  _id: string;
  avatarUrl?: string;
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

export async function searchDraw(drawId: string): Promise<DrawSearchResult> {
  return await apiFetch<DrawSearchResult>('/api/draw/search', {
    method: 'POST',
    body: JSON.stringify({ drawId }),
  });
}

export async function initDraw(tweetId: string, mode: Mode, hostUsername: string = 'unknown'): Promise<DrawInitResult> {
  return await apiFetch<DrawInitResult>('/api/x/draw/init', {
    method: 'POST',
    body: JSON.stringify({ tweetId, mode, hostUsername }),
  });
}

export async function getDrawStatus(id: string): Promise<DrawStatusResult> {
  return await apiFetch<DrawStatusResult>(`/api/x/draw/status/${id}`);
}

export interface SaveDrawPayload {
  drawId: string;
  tweetId: string;
  hostUsername: string;
  hostAvatarUrl?: string;
  mode: Mode;
  totalParticipants: number;
  participants?: string[];
  enabledFeatures?: string[];
  engagementTasks?: EngagementTasksConfig;
  antiBotFilters?: AntiBotFiltersConfig;
  winners: Winner[];
}

export async function saveDraw(data: SaveDrawPayload): Promise<{ success: boolean }> {
  return await apiFetch<{ success: boolean }>('/api/x/draw/save', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getHistory(): Promise<GiveawayDoc[]> {
  return await apiFetch<GiveawayDoc[]>('/api/x/giveaways/history');
}

export async function getDrawsByTweetId(tweetId: string): Promise<GiveawayDoc[]> {
  return await apiFetch<GiveawayDoc[]>(`/api/x/giveaways/tweet/${tweetId}`);
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return await apiFetch<LeaderboardEntry[]>('/api/x/giveaways/leaderboard');
}

export interface VerifyResult {
  avatarUrl: string;
  passedPfp: boolean;
  passedBio: boolean;
  passedAge: boolean;
  passedActivity: boolean;
  passedComment: boolean;
}

export async function verifyCandidate(username: string, tweetId: string, config: GiveawayConfig): Promise<VerifyResult> {
  return await apiFetch<VerifyResult>('/api/x/verify', {
    method: 'POST',
    body: JSON.stringify({ username, tweetId, config }),
  });
}
