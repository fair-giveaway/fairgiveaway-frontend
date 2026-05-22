const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';

export interface Winner {
  username: string;
  type: string;
  status: string;
  /** TODO:BACKEND — This URL will be populated by the backend scraper (sacrificial X account).
   *  The scraper fetches the real `pbs.twimg.com` profile image URL during winner verification.
   *  Current mock uses unavatar.io as a temporary placeholder. */
  avatarUrl?: string;
}

export interface GiveawayDoc {
  _id: string;
  tweetId: string;
  hostUsername: string;
  /** TODO:BACKEND — Same as Winner.avatarUrl. The backend stores the host's real profile photo
   *  URL when initializing the draw via the sacrificial X account scraper. */
  hostAvatarUrl?: string;
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
  hostUsername?: string;
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

// --- MOCK PARTICIPANT POOL ---
const MOCK_PARTICIPANTS = [
  'alice', 'bob', 'charlie', 'david', 'eve', 'frank', 'grace', 'heidi',
  'isaac', 'judy', 'karl', 'lily', 'mike', 'nancy', 'oscar', 'patricia',
  'quinn', 'rachel', 'steve', 'tina', 'ursula', 'victor', 'wendy', 'xavier',
  'yolanda', 'zack', 'amber', 'blake', 'casey', 'derek', 'elaine', 'felix',
];

// --- IN-MEMORY MOCK STORE ---
function generateMockHistory(): GiveawayDoc[] {
  const hosts = [
    'elonmusk', 'mrbeast', 'vercel', 'nextjs', 'github',
    'tailwindcss', 'figma', 'linear', 'supabase', 'prisma',
    'turborepo', 'drizzleorm', 'cloudflare', 'railway', 'fly_io',
    'planetscale', 'upstash', 'convex_dev', 'resend', 'cal',
    'notion', 'arc_browser', 'cursor_ai', 'vaborofficial', 'discord',
  ];
  const modes = ['retweets', 'replies', 'likes', 'reposts', 'quotes'];
  const names = MOCK_PARTICIPANTS;
  const DAY = 86400000;

  return hosts.map((host, i) => {
    const winnerCount = (i % 3) + 1;
    const winners = Array.from({ length: winnerCount }, (_, wi) => ({
      username: names[(i * 3 + wi) % names.length],
      type: wi === 0 ? 'primary' : 'secondary',
      status: 'verified',
      avatarUrl: `https://unavatar.io/twitter/${names[(i * 3 + wi) % names.length]}`,
    }));

    return {
      _id: `draw_${i + 1}`,
      tweetId: `${1800000000000000000 + i * 1000}`,
      hostUsername: host,
      hostAvatarUrl: `https://unavatar.io/twitter/${host}`,
      platform: 'x',
      mode: modes[i % modes.length],
      totalParticipants: 200 + Math.floor(Math.pow(i + 1, 2.3) * 10),
      winners,
      createdAt: new Date(Date.now() - i * DAY).toISOString(),
    };
  });
}

const INITIAL_MOCK_HISTORY: GiveawayDoc[] = generateMockHistory();

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

interface CachedSession {
  participants: string[];
  tweetId: string;
  mode: string;
  hostUsername: string;
}

export function cacheDrawSession(drawId: string, data: CachedSession) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`draw:${drawId}`, JSON.stringify(data));
}

export function getCachedDrawSession(drawId: string): CachedSession | null {
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

export async function initDraw(tweetId: string, mode: string, hostUsername: string = 'unknown'): Promise<DrawInitResult> {
  const drawId = `mock_draw_${Math.floor(Math.random() * 10000)}`;
  const shuffled = [...MOCK_PARTICIPANTS].sort(() => Math.random() - 0.5);
  const count = Math.floor(Math.random() * 12) + 15;
  const participants = shuffled.slice(0, count);

  cacheDrawSession(drawId, { participants, tweetId, mode: 'reposts', hostUsername });

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
    const history = getMockHistory();
    const finalized = history.find(d => d._id === id);
    if (finalized) {
      resolve({ status: 'finalized', data: finalized });
      return;
    }

    const cached = getCachedDrawSession(id);
    if (cached) {
      resolve({
        status: 'active',
        participants: cached.participants,
        drawId: id,
        mode: cached.mode,
        tweetId: cached.tweetId,
        hostUsername: cached.hostUsername,
      });
      return;
    }

    const shuffled = [...MOCK_PARTICIPANTS].sort(() => Math.random() - 0.5);
    const participants = shuffled.slice(0, 20);
    cacheDrawSession(id, { participants, tweetId: '1234567890', mode: 'reposts', hostUsername: 'unknown' });
    resolve({
      status: 'active',
      participants,
      drawId: id,
      mode: 'reposts',
      tweetId: '1234567890',
      hostUsername: 'unknown',
    });
  }, 500));
}

export interface SaveDrawPayload {
  drawId: string;
  tweetId: string;
  hostUsername: string;
  hostAvatarUrl?: string;
  mode: string;
  totalParticipants: number;
  winners: Winner[];
}

export async function saveDraw(data: SaveDrawPayload): Promise<{ success: boolean }> {
  return new Promise(resolve => setTimeout(() => {
    saveMockHistory({
      _id: data.drawId,
      tweetId: data.tweetId,
      hostUsername: data.hostUsername || 'unknown',
      hostAvatarUrl: data.hostAvatarUrl,
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
  return new Promise(resolve => setTimeout(() => {
    const MOCK_HOSTS = [
      'mrbeast', 'elonmusk', 'vercel', 'isaacnewton123', 'nextjs', 
      'reactjs', 'tailwind', 'typescript', 'github', 'openai', 
      'anthropic', 'google', 'apple', 'microsoft', 'amazon', 
      'netflix', 'meta', 'spotify', 'figma', 'linear', 
      'discord', 'slack', 'notion', 'arc', 'cursor'
    ];
    const extra = Array.from({length: 15}, (_, i) => `user_${i+100}`);
    const allHosts = [...MOCK_HOSTS, ...extra];
    
    const entries = allHosts.map((host, i) => ({
      _id: host,
      avatarUrl: `https://unavatar.io/twitter/${host}`,
      totalGiveaways: 50 - i + Math.floor(Math.random() * 5),
      totalParticipants: 1000000 - i * 20000 + Math.floor(Math.random() * 10000)
    })).sort((a, b) => b.totalGiveaways - a.totalGiveaways);
    
    resolve(entries);
  }, 500));
}
