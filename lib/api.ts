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
  participants: string[];
  tweetId: string;
  mode: string;
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

// --- MOCK PARTICIPANT POOL ---
const MOCK_PARTICIPANTS = [
  'alice', 'bob', 'charlie', 'david', 'eve', 'frank', 'grace', 'heidi',
  'isaac', 'judy', 'karl', 'lily', 'mike', 'nancy', 'oscar', 'patricia',
  'quinn', 'rachel', 'steve', 'tina', 'ursula', 'victor', 'wendy', 'xavier',
  'yolanda', 'zack', 'amber', 'blake', 'casey', 'derek', 'elaine', 'felix',
];

// --- IN-MEMORY MOCK STORE ---
const INITIAL_MOCK_HISTORY: GiveawayDoc[] = [
  {
    _id: 'draw_1',
    tweetId: '1234567890',
    hostUsername: 'elonmusk',
    platform: 'x',
    mode: 'retweets',
    totalParticipants: 1542,
    winners: [{ username: 'lucky_user', type: 'primary', status: 'verified' }],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'draw_2',
    tweetId: '0987654321',
    hostUsername: 'mrbeast',
    platform: 'x',
    mode: 'replies',
    totalParticipants: 10420,
    winners: [
      { username: 'winner_one', type: 'primary', status: 'verified' },
      { username: 'winner_two', type: 'secondary', status: 'verified' },
      { username: 'winner_three', type: 'secondary', status: 'verified' }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'draw_3',
    tweetId: '1122334455',
    hostUsername: 'vercel',
    platform: 'x',
    mode: 'likes',
    totalParticipants: 532,
    winners: [{ username: 'dev_guy', type: 'primary', status: 'verified' }],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

function getMockHistory(): GiveawayDoc[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_HISTORY;
  try {
    const stored = localStorage.getItem('mockHistory');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('mockHistory', JSON.stringify(INITIAL_MOCK_HISTORY));
  } catch (e) {
    console.error(e);
  }
  return INITIAL_MOCK_HISTORY;
}

function saveMockHistory(data: GiveawayDoc) {
  if (typeof window === 'undefined') return;
  try {
    const current = getMockHistory();
    const updated = [data, ...current];
    localStorage.setItem('mockHistory', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

// --- SESSION STORAGE for active draw sessions (simulates Upstash Redis) ---
export function cacheDrawSession(drawId: string, data: { participants: string[]; tweetId: string; mode: string }) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`draw:${drawId}`, JSON.stringify(data));
}

export function getCachedDrawSession(drawId: string): { participants: string[]; tweetId: string; mode: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(`draw:${drawId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// --- API FUNCTIONS ---

export async function searchDraw(drawId: string): Promise<DrawSearchResult> {
  return new Promise(resolve => setTimeout(() => {
    const history = getMockHistory();
    const found = history.some(d => d._id === drawId);
    resolve({ found, platform: found ? 'x' : undefined });
  }, 500));
}

export async function initDraw(tweetId: string, mode: string): Promise<DrawInitResult> {
  const drawId = `mock_draw_${Math.floor(Math.random() * 10000)}`;
  const shuffled = [...MOCK_PARTICIPANTS].sort(() => Math.random() - 0.5);
  const count = Math.floor(Math.random() * 12) + 15; // 15-26 participants
  const participants = shuffled.slice(0, count);

  // Cache in sessionStorage (simulates Upstash Redis)
  cacheDrawSession(drawId, { participants, tweetId, mode: 'reposts' });

  return new Promise(resolve => setTimeout(() => resolve({
    drawId,
    participantCount: participants.length,
    participants,
    tweetId,
    mode: 'reposts',
  }), 800));
}

export async function getDrawStatus(id: string): Promise<DrawStatusResult> {
  return new Promise(resolve => setTimeout(() => {
    // Check finalized history first
    const history = getMockHistory();
    const finalized = history.find(d => d._id === id);
    if (finalized) {
      resolve({ status: 'finalized', data: finalized });
      return;
    }

    // Check active session cache
    const cached = getCachedDrawSession(id);
    if (cached) {
      resolve({
        status: 'active',
        participants: cached.participants,
        drawId: id,
        mode: cached.mode,
        tweetId: cached.tweetId,
      });
      return;
    }

    // Fallback for any draw ID — generate mock data
    const shuffled = [...MOCK_PARTICIPANTS].sort(() => Math.random() - 0.5);
    const participants = shuffled.slice(0, 20);
    cacheDrawSession(id, { participants, tweetId: '1234567890', mode: 'reposts' });
    resolve({
      status: 'active',
      participants,
      drawId: id,
      mode: 'reposts',
      tweetId: '1234567890'
    });
  }, 500));
}

export interface SaveDrawPayload {
  drawId: string;
  tweetId: string;
  hostUsername: string;
  mode: string;
  totalParticipants: number;
  winners: Winner[];
}

export async function saveDraw(data: SaveDrawPayload): Promise<{ success: boolean }> {
  return new Promise(resolve => setTimeout(() => {
    saveMockHistory({
      _id: data.drawId,
      tweetId: data.tweetId,
      hostUsername: data.hostUsername || 'simulated_user',
      platform: 'x',
      mode: data.mode,
      totalParticipants: data.totalParticipants,
      winners: data.winners,
      createdAt: new Date().toISOString(),
    });
    // Clear session cache
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`draw:${data.drawId}`);
    }
    resolve({ success: true });
  }, 1000));
}

export async function getHistory(): Promise<GiveawayDoc[]> {
  return new Promise(resolve => setTimeout(() => resolve(getMockHistory()), 500));
}

export async function getDrawsByTweetId(tweetId: string): Promise<GiveawayDoc[]> {
  return new Promise(resolve => setTimeout(() => {
    const history = getMockHistory();
    resolve(history.filter(d => d.tweetId === tweetId));
  }, 500));
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  // return apiFetch<LeaderboardEntry[]>('/api/x/giveaways/leaderboard');
  return new Promise(resolve => setTimeout(() => resolve([
    { _id: 'mrbeast', totalGiveaways: 42, totalParticipants: 1500000 },
    { _id: 'elonmusk', totalGiveaways: 15, totalParticipants: 850000 },
    { _id: 'vercel', totalGiveaways: 8, totalParticipants: 120000 },
    { _id: 'isaacnewton123', totalGiveaways: 5, totalParticipants: 45000 },
    { _id: 'nextjs', totalGiveaways: 3, totalParticipants: 15000 },
  ]), 500));
}
