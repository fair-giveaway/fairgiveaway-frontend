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
          background: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)', // Very dark violet gradient
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
        }}
      >
        {/* Top Section */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 20 }}>
          <span style={{ fontSize: 56, fontWeight: 'bold', color: 'white' }}>Official Winners 🎉</span>
        </div>

        {/* Center Section (Winner) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -20 }}>
          <img 
            src={winnerAvatar} 
            alt="Winner Avatar"
            width={240} 
            height={240} 
            style={{ borderRadius: '50%', border: '6px solid #4ade80', boxShadow: '0 0 40px rgba(74, 222, 128, 0.4)' }} 
          />
          <h2 style={{ fontSize: 48, fontWeight: 'bold', marginTop: 24, color: '#4ade80' }}>@{winner.username}</h2>
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          
          {/* Hosted By */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 24, color: '#94a3b8', marginBottom: 12 }}>Hosted By</span>
            <img 
              src={hostAvatar} 
              alt="Host Avatar"
              width={100} 
              height={100} 
              style={{ borderRadius: '50%', border: '4px solid #334155', marginBottom: 12 }} 
            />
            <span style={{ fontSize: 28, color: 'white', fontWeight: '500' }}>@{host}</span>
          </div>

          {/* ID */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 10 }}>
            <span style={{ fontSize: 24, color: '#475569', fontFamily: 'monospace' }}>id: {id}</span>
          </div>

          {/* Powered By */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 24, color: '#94a3b8', marginBottom: 12 }}>powered by</span>
            <img 
              src={logoUrl} 
              alt="Logo"
              width={100} 
              height={100} 
              style={{ marginBottom: 12 }} 
            />
            <span style={{ fontSize: 28, color: 'white', fontWeight: '500' }}>@fairgiveaway</span>
          </div>

        </div>
      </div>
    ),
    { ...size }
  );
}
