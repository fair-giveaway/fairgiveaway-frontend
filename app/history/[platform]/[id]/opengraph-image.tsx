import { ImageResponse } from 'next/og';
import { getDrawStatus } from '@/lib/api';

// Use edge runtime for fast OG image generation on Vercel
export const runtime = 'edge';

export const alt = 'FairGiveaway Result';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image(props: { params: Promise<{ platform: string; id: string }> }) {
  const { platform, id } = await props.params;
  // Edge functions can fetch from our backend
  const status = await getDrawStatus(id).catch(() => null);

  const winner = status?.data?.winners?.find((w) => w.status === 'verified');
  const host = status?.data?.hostUsername || 'Someone';
  const hostAvatar = status?.data?.hostAvatarUrl || `https://unavatar.io/twitter/${host}`;
  const winnerAvatar = winner?.avatarUrl || `https://unavatar.io/twitter/${winner?.username || 'unknown'}`;
  const logoUrl = 'https://raw.githubusercontent.com/fair-giveaway/fairgiveaway-frontend/refs/heads/master/public/logo.png';

  if (!winner) {
    // Fallback image if draw isn't finalized or winner isn't found
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <img src={logoUrl} alt="Logo" width={100} height={100} style={{ marginBottom: 20 }} />
          <h1 style={{ fontSize: 60, fontWeight: 'bold' }}>FairGiveaway</h1>
          <p style={{ fontSize: 30, color: '#94a3b8' }}>Provably Fair Draws on {platform}</p>
        </div>
      ),
      { ...size }
    );
  }

  // Premium Winner Announcement
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)',
          flexDirection: 'column',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
          padding: '48px 64px',
        }}
      >
        {/* ── Ambient Glows (SVG radial gradients, Satori-safe) ── */}
        <div style={{ position: 'absolute', top: -200, left: -100, display: 'flex' }}>
          <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glow1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
              </radialGradient>
            </defs>
            <circle cx="300" cy="300" r="300" fill="url(#glow1)" />
          </svg>
        </div>

        <div style={{ position: 'absolute', top: 65, left: 350, display: 'flex' }}>
          <svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glow2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
                <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="250" r="250" fill="url(#glow2)" />
          </svg>
        </div>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoUrl} alt="Logo" width={44} height={44} style={{ borderRadius: 8, marginRight: 16 }} />
            <span style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.5px' }}>
              FairGiveaway
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 20px',
              borderRadius: 99,
              fontSize: 18,
              fontWeight: 600,
              color: '#818cf8',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 10 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Provably Fair
          </div>
        </div>

        {/* ── Main Hero (Winner) ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginTop: -20,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: 32 }}>
            🎉 Official Winner
          </div>

          {/* Avatar with gradient ring */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 200,
              borderRadius: 100,
              background: 'linear-gradient(135deg, #4ade80 0%, #3b82f6 100%)',
              marginBottom: 24,
            }}
          >
            <img
              src={winnerAvatar}
              alt="Winner Avatar"
              width={184}
              height={184}
              style={{
                borderRadius: 92,
                objectFit: 'cover',
                border: '4px solid #020617',
              }}
            />
          </div>

          <h2 style={{ fontSize: 56, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-1px' }}>
            @{winner.username}
          </h2>
        </div>

        {/* ── Footer Info ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          {/* Left: Hosted By Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 24px 12px 12px',
              borderRadius: 99,
            }}
          >
            <img src={hostAvatar} alt="Host Avatar" width={52} height={52} style={{ borderRadius: 26, border: '2px solid #475569', marginRight: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>Hosted by</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>@{host}</span>
            </div>
          </div>

          {/* Right: Draw ID */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              padding: '16px 28px',
            }}
          >
            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
              Verified Draw ID
            </span>
            <span style={{ fontSize: 20, fontWeight: 600, color: '#94a3b8', fontFamily: 'monospace' }}>
              {id}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
