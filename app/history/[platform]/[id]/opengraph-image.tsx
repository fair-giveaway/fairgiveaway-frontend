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

export default async function Image({ params }: { params: { platform: string; id: string } }) {
  // Edge functions can fetch from our backend
  const status = await getDrawStatus(params.id).catch(() => null);

  const winner = status?.data?.winners?.[0];
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
          <p style={{ fontSize: 30, color: '#a1a1aa' }}>Provably Fair Draws on {params.platform}</p>
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
          background: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)', // Very dark violet gradient
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Logo */}
        <div style={{ display: 'flex', position: 'absolute', top: 40, left: 40, alignItems: 'center' }}>
          <img src={logoUrl} alt="Logo" width={50} height={50} style={{ marginRight: 15 }} />
          <span style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: '2px', color: '#a5b4fc' }}>
            FAIRGIVEAWAY.ONLINE
          </span>
        </div>

        {/* Verification Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '2px solid rgba(34, 197, 94, 0.5)',
            padding: '10px 24px',
            borderRadius: '100px',
            marginBottom: 40,
          }}
        >
          <span style={{ color: '#4ade80', fontSize: 24, fontWeight: 'bold' }}>✓ Provably Fair Result</span>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', width: '100%', padding: '0 80px', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Host Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 24, color: '#94a3b8', marginBottom: 20 }}>Hosted by</p>
            <img 
              src={hostAvatar} 
              alt="Host Avatar"
              width={160} 
              height={160} 
              style={{ borderRadius: '50%', border: '4px solid #334155' }} 
            />
            <h2 style={{ fontSize: 36, marginTop: 20 }}>@{host}</h2>
          </div>

          {/* Center Text & Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
            <span style={{ fontSize: 40, color: '#a5b4fc' }}>🎉 WINNER 🎉</span>
            <span style={{ fontSize: 60, marginTop: -20, color: '#4f46e5' }}>→</span>
          </div>

          {/* Winner Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 24, color: '#94a3b8', marginBottom: 20 }}>Selected Winner</p>
            <img 
              src={winnerAvatar} 
              alt="Winner Avatar"
              width={220} 
              height={220} 
              style={{ borderRadius: '50%', border: '6px solid #4ade80', boxShadow: '0 0 40px rgba(74, 222, 128, 0.4)' }} 
            />
            <h2 style={{ fontSize: 48, fontWeight: 'bold', marginTop: 20, color: '#4ade80' }}>@{winner.username}</h2>
          </div>
          
        </div>

        {/* Footer/Hash */}
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, width: '100%', justifyContent: 'center' }}>
          <span style={{ fontSize: 20, color: '#475569', fontFamily: 'monospace' }}>
            Draw ID: {params.id}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
