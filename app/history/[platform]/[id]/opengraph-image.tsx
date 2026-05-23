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
  const status = await getDrawStatus(id).catch(() => null);

  const winner = status?.data?.winners?.find((w) => w.status === 'verified');
  const host = status?.data?.hostUsername || 'Someone';
  const hostAvatar = status?.data?.hostAvatarUrl || `https://unavatar.io/twitter/${host}`;
  const winnerAvatar = winner?.avatarUrl || `https://unavatar.io/twitter/${winner?.username || 'unknown'}`;
  const logoUrl = 'https://raw.githubusercontent.com/fair-giveaway/fairgiveaway-frontend/refs/heads/master/public/logo.png';
  const totalParticipants = status?.data?.totalParticipants || 0;

  if (!winner) {
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(145deg, #0a0a0f 0%, #0f172a 50%, #1e1b4b 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <img src={logoUrl} alt="Logo" width={80} height={80} style={{ marginBottom: 24 }} />
          <h1 style={{ fontSize: 52, fontWeight: 'bold', margin: 0, letterSpacing: '-1px' }}>FairGiveaway</h1>
          <p style={{ fontSize: 24, color: '#94a3b8', marginTop: 12 }}>Provably Fair Draws on {platform}</p>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(145deg, #0a0a0f 0%, #0f172a 50%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow behind winner */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Top bar: Logo + Verified badge */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 36,
            left: 0,
            right: 0,
            padding: '0 48px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={logoUrl} alt="Logo" width={36} height={36} />
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '1.5px', color: '#a5b4fc' }}>
              FAIRGIVEAWAY
            </span>
          </div>
          {/* Badge right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1.5px solid rgba(34, 197, 94, 0.35)',
              padding: '6px 18px',
              borderRadius: '100px',
            }}
          >
            <span style={{ color: '#4ade80', fontSize: 16, fontWeight: 600 }}>Provably Fair</span>
          </div>
        </div>

        {/* ═══════ Main Content ═══════ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 64,
            marginTop: 16,
          }}
        >
          {/* Host card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
              HOST
            </span>
            <div
              style={{
                display: 'flex',
                borderRadius: '50%',
                border: '3px solid #334155',
                overflow: 'hidden',
                width: 130,
                height: 130,
              }}
            >
              <img src={hostAvatar} alt="Host Avatar" width={130} height={130} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 600, marginTop: 14, color: '#e2e8f0' }}>
              @{host}
            </span>
          </div>

          {/* Center divider with arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0 16px' }}>
            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
              PICKED
            </span>
            <div
              style={{
                display: 'flex',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 30, color: '#a5b4fc' }}>→</span>
            </div>
            <span style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
              from {totalParticipants.toLocaleString()}
            </span>
          </div>

          {/* Winner card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#4ade80', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
              WINNER
            </span>
            <div
              style={{
                display: 'flex',
                borderRadius: '50%',
                border: '4px solid #4ade80',
                overflow: 'hidden',
                width: 170,
                height: 170,
                boxShadow: '0 0 50px rgba(74, 222, 128, 0.25), 0 0 100px rgba(74, 222, 128, 0.1)',
              }}
            >
              <img src={winnerAvatar} alt="Winner Avatar" width={170} height={170} />
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, marginTop: 16, color: '#4ade80' }}>
              @{winner.username}
            </span>
          </div>
        </div>

        {/* Bottom bar: Draw ID */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 32,
            left: 0,
            right: 0,
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 14, color: '#334155', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
            {id}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
