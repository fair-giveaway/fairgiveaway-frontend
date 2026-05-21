import Image from 'next/image';

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

async function getContributors(): Promise<Contributor[]> {
  try {
    const [frontendRes, backendRes] = await Promise.all([
      fetch('https://api.github.com/repos/isaacnewton123/fairgiveaway-frontend/contributors', {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'fairgiveaway-frontend' }
      }),
      fetch('https://api.github.com/repos/isaacnewton123/fairgiveaway-backend/contributors', {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'fairgiveaway-frontend' }
      })
    ]);

    let frontendContributors: Contributor[] = [];
    let backendContributors: Contributor[] = [];

    if (frontendRes.ok) {
      frontendContributors = await frontendRes.json();
    }
    if (backendRes.ok) {
      backendContributors = await backendRes.json();
    }

    // Merge and remove duplicates, summing up contributions
    const mergedMap = new Map<string, Contributor>();
    
    [...frontendContributors, ...backendContributors].forEach(c => {
      if (mergedMap.has(c.login)) {
        mergedMap.get(c.login)!.contributions += c.contributions;
      } else {
        mergedMap.set(c.login, { ...c });
      }
    });

    // Sort by contributions descending
    return Array.from(mergedMap.values()).sort((a, b) => b.contributions - a.contributions);

  } catch (error) {
    console.error('Failed to fetch contributors:', error);
    return [];
  }
}

export async function HomeContributors() {
  const contributors = await getContributors();

  if (!contributors || contributors.length === 0) {
    return null;
  }

  return (
    <section className="relative border-t border-slate-200 px-6 py-24 dark:border-white/[0.06]" aria-labelledby="contributors-heading">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400/80">
          Community
        </p>
        <h2 id="contributors-heading" className="mb-14 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Contributors
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {contributors.map((contributor) => (
            <a
              key={contributor.login}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
              aria-label={`View ${contributor.login}'s profile on GitHub`}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm transition-colors group-hover:border-violet-500/50 dark:border-white/10 dark:shadow-none dark:group-hover:border-violet-400/80">
                <Image
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-violet-600 dark:text-white/60 dark:group-hover:text-violet-300">
                {contributor.login}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
