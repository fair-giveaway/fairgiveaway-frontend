import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Terms of Service | FairGiveaway',
  description: 'Terms of Service for FairGiveaway — read our terms and conditions for using the platform.',
  alternates: { canonical: `${siteConfig.url}/terms` },
};

export default function TermsPage() {
  return (
    <main className="w-full pt-32 pb-20">
      <div className="neo-container max-w-3xl">
        <div className="text-center mb-12 animate-fade-in-up opacity-0">
          <span className="neo-label-sm text-accentPrimary mb-4 block">Legal</span>
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">Terms of Service</h1>
          <p className="text-textMuted text-sm">Last updated: May 23, 2026</p>
        </div>

        <article className="neo-card p-8 md:p-12 animate-fade-in-up opacity-0 stagger-1">
          <div className="prose-custom space-y-8">
            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">1. Acceptance of Terms</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                By accessing or using FairGiveaway (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service. We reserve the right to update these 
                terms at any time, and your continued use of the Service constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">2. Description of Service</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                FairGiveaway is a free, open-source platform that provides provably fair giveaway winner selection 
                for social media platforms, currently supporting X (Twitter). The Service scrapes public engagement 
                data (likes, reposts) from tweets, randomly selects winners using cryptographically secure algorithms, 
                and stores finalized draw results as permanent public records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">3. User Responsibilities</h2>
              <div className="text-textSecondary leading-relaxed text-sm space-y-3">
                <p>When using the Service, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Only run giveaways that you are authorized to host.</li>
                  <li>Comply with the terms of service of any third-party platform (e.g., X/Twitter).</li>
                  <li>Not use the Service for illegal, fraudulent, or deceptive purposes.</li>
                  <li>Not attempt to manipulate, reverse-engineer, or abuse the draw selection process.</li>
                  <li>Not use the Service to harass, doxx, or harm other users in any way.</li>
                  <li>Take full responsibility for fulfilling prizes to winners you announce.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">4. Twitter/X Credentials</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                Certain features of the Service require Twitter session cookies (auth_token and ct0) to scrape 
                participant data. These credentials are used solely for the purpose of fetching tweet engagement 
                data and are never stored permanently. You are responsible for the security of your own credentials 
                and must not share them with unauthorized parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">5. Data and Public Records</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                Finalized giveaway results — including participant usernames, winner usernames, and verification 
                outcomes — are stored as permanent public records. By using the Service to finalize a draw, you 
                acknowledge and consent to this data being publicly accessible. This transparency is a core feature 
                of the platform and cannot be reversed once a draw is finalized.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">6. Disclaimers</h2>
              <div className="text-textSecondary leading-relaxed text-sm space-y-3">
                <p>
                  The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express 
                  or implied. We do not guarantee:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Uninterrupted or error-free operation of the Service.</li>
                  <li>The accuracy of scraped data from third-party platforms.</li>
                  <li>That the Service will meet your specific requirements.</li>
                  <li>That winners drawn will honor or be reachable for prize fulfillment.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">7. Limitation of Liability</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                In no event shall FairGiveaway, its creators, contributors, or affiliates be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising out of or in connection with your use 
                of the Service. This includes but is not limited to: loss of profits, data, or goodwill; disputes 
                between giveaway hosts and participants; or any actions taken by third-party platforms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">8. Intellectual Property</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                FairGiveaway is open-source software licensed under the MIT License. You are free to use, modify, 
                and distribute the source code in accordance with the terms of the MIT License. The FairGiveaway 
                name, logo, and branding are the property of the FairGiveaway project.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">9. Termination</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                We reserve the right to suspend or terminate your access to the Service at any time, for any reason, 
                without prior notice. This includes cases of abuse, fraud, or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">10. Changes to Terms</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                We may revise these Terms of Service from time to time. The most current version will always be 
                available on this page. By continuing to use the Service after changes are posted, you agree to the 
                revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">11. Contact</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                If you have questions about these Terms of Service, please contact us at{' '}
                <a href={`mailto:${siteConfig.email}`} className="text-accentPrimary hover:underline font-medium">
                  {siteConfig.email}
                </a>.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
