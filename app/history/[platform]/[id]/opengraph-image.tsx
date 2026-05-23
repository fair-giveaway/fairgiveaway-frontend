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
            background: 'linear-gradient(to bottom right, #09090b, #18181b)',
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
          <p style={{ fontSize: 30, color: '#a1a1aa' }}>Provably Fair Draws on {platform}</p>
        </div>
      ),
      { ...size }
    );
  }

  // The sleek winner announcement image
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* ── Top Bar ── */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 40px',
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          {/* Left: logo + name */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoUrl} alt="Logo" width={36} height={36} style={{ marginRight: 12 }} />
            <span style={{ fontSize: 22, fontWeight: 'bold', color: '#a5b4fc' }}>@fairgiveaway</span>
          </div>
          {/* Right: tagline */}
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#a5b4fc', letterSpacing: '1px' }}>
            Provably Fair
          </span>
        </div>

        {/* ── Main Content ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '0 60px',
          }}
        >
          {/* Title */}
          <h1 style={{ fontSize: 52, fontWeight: 'bold', marginBottom: 30, marginTop: 0 }}>
            Official Winners 🎉
          </h1>

          {/* Winner Avatar — large, centered */}
          <img
            src={winnerAvatar}
            alt="Winner Avatar"
            width={180}
            height={180}
            style={{
              borderRadius: '50%',
              border: '6px solid #4ade80',
              boxShadow: '0 0 50px rgba(74, 222, 128, 0.4)',
            }}
          />
          <h2 style={{ fontSize: 40, fontWeight: 'bold', color: '#4ade80', marginTop: 16, marginBottom: 0 }}>
            @{winner.username}
          </h2>
        </div>

        {/* ── Bottom Section (Host left, Powered-by right) ── */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '0 50px 70px 50px',
          }}
        >
          {/* Left: Hosted By */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 18, color: '#94a3b8', marginBottom: 10 }}>Hosted By</span>
            <img
              src={hostAvatar}
              alt="Host Avatar"
              width={64}
              height={64}
              style={{ borderRadius: '50%', border: '3px solid #334155' }}
            />
            <span style={{ fontSize: 20, marginTop: 8 }}>@{host}</span>
          </div>

          {/* Right: Powered by */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 18, color: '#94a3b8', marginBottom: 10 }}>powered by</span>
            <img src={logoUrl} alt="Logo" width={48} height={48} />
            <span style={{ fontSize: 20, color: '#a5b4fc', marginTop: 8 }}>@fairgiveaway</span>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '14px 0',
            background: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        >
          <span style={{ fontSize: 18, color: '#475569', fontFamily: 'monospace' }}>
            id: {id}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
