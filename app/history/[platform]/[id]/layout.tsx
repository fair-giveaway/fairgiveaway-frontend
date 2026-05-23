import { Metadata } from 'next';
import { getDrawStatus } from '@/lib/api';

type Props = {
  params: Promise<{ platform: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform, id } = await params;

  try {
    const status = await getDrawStatus(id);

    // If we have winner data
    const verifiedWinner = status?.data?.winners?.find((w) => w.status === 'verified');
    if (verifiedWinner) {
      const winner = verifiedWinner;
      const host = status?.data?.hostUsername || 'Someone';

      return {
        title: `Giveaway Winner: @${winner.username}`,
        description: `Verified winner of @${host}'s giveaway! Provably fair draw recorded on-chain via FairGiveaway.`,
        openGraph: {
          title: `Giveaway Winner: @${winner.username} 🎉`,
          description: `Verified winner of @${host}'s giveaway! Provably fair draw.`,
          url: `/history/${platform}/${id}`,
        },
        twitter: {
          card: 'summary_large_image',
          title: `Giveaway Winner: @${winner.username} 🎉`,
          description: `Verified winner of @${host}'s giveaway! Provably fair draw.`,
        },
      };
    }

    // Default if no winner or not finalized
    return {
      title: `Draw ${id.slice(0, 8)}`,
      description: 'View the status of this provably fair giveaway.',
    };
  } catch {
    return {
      title: 'FairGiveaway Draw',
    };
  }
}

export default function HistoryDrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
