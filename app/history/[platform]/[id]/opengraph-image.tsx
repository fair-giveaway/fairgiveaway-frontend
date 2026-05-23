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

  if (!winner) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
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
          <h1 style={{ fontSize: 56, fontWeight: 'bold', margin: 0 }}>FairGiveaway</h1>
          <p style={{ fontSize: 28, color: '#71717a', marginTop: 12 }}>Provably Fair Draws on {platform}</p>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
          background: '#f8f8fa',
        }}
      >
        {/* ─── TOP BAR ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0a0a0f',
            padding: '18px 40px',
            width: '100%',
          }}
        >
          {/* Left: logo + name */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoUrl} alt="Logo" width={36} height={36} style={{ marginRight: 12 }} />
            <span style={{ fontSize: 22, fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
              @fairgiveaway
            </span>
          </div>
          {/* Right: tagline */}
          <span style={{ fontSize: 20, fontWeight: 600, color: '#a5b4fc', letterSpacing: '1px' }}>
            Provably Fair
          </span>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: '#f8f8fa',
            // Dotted pattern via radial gradient
            backgroundImage: 'radial-gradient(circle, #d4d4d8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 42, fontWeight: 'bold', color: '#18181b' }}>
              Official Winner 🎉
            </span>
          </div>

          {/* ─── CENTER: Winner avatar (large) ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <img
              src={winnerAvatar}
              alt="Winner"
              width={160}
              height={160}
              style={{
                borderRadius: '50%',
                border: '5px solid #18181b',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              }}
            />
            <span style={{ fontSize: 34, fontWeight: 'bold', color: '#18181b', marginTop: 14 }}>
              @{winner.username}
            </span>
          </div>

          {/* ─── LEFT: Host section (absolute) ─── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'absolute',
              left: 80,
              bottom: 48,
            }}
          >
            <span style={{ fontSize: 16, color: '#71717a', marginBottom: 8, fontWeight: 600 }}>Hosted by</span>
            <img
              src={hostAvatar}
              alt="Host"
              width={72}
              height={72}
              style={{
                borderRadius: '50%',
                border: '3px solid #d4d4d8',
              }}
            />
            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#3f3f46', marginTop: 8 }}>
              @{host}
            </span>
          </div>

          {/* ─── RIGHT: Powered-by branding (absolute) ─── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'absolute',
              right: 80,
              bottom: 48,
            }}
          >
            <span style={{ fontSize: 16, color: '#71717a', marginBottom: 8, fontWeight: 600 }}>powered by</span>
            <img src={logoUrl} alt="Logo" width={52} height={52} />
            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#3f3f46', marginTop: 8 }}>
              @fairgiveaway
            </span>
          </div>
        </div>

        {/* ─── BOTTOM BAR ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0f',
            padding: '16px 40px',
            width: '100%',
          }}
        >
          <span style={{ fontSize: 18, color: '#71717a', fontFamily: 'monospace' }}>
            id: {id}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
