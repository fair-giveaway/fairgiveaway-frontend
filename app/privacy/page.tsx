import type { Metadata } from 'next';
import { siteConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Privacy Policy | FairGiveaway',
  description: 'Privacy Policy for FairGiveaway — learn how we handle your data with full transparency.',
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <main className="w-full pt-32 pb-20">
      <div className="neo-container max-w-3xl">
        <div className="text-center mb-12 animate-fade-in-up opacity-0">
          <span className="neo-label-sm text-accentPrimary mb-4 block">Legal</span>
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">Privacy Policy</h1>
          <p className="text-textMuted text-sm">Last updated: May 23, 2026</p>
        </div>

        <article className="neo-card p-8 md:p-12 animate-fade-in-up opacity-0 stagger-1">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">1. Overview</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                FairGiveaway (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy 
                Policy explains what data we collect, why we collect it, how we store it, and your rights 
                regarding that data. We are an open-source project — our source code is publicly auditable at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">2. Data We Collect</h2>
              <div className="text-textSecondary leading-relaxed text-sm space-y-4">
                <div>
                  <h3 className="font-semibold text-textPrimary mb-1">Giveaway Data (Public)</h3>
                  <p>When a draw is finalized, we permanently store:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                    <li>The tweet ID associated with the giveaway</li>
                    <li>The host&apos;s Twitter username and avatar URL</li>
                    <li>The list of participant usernames (scraped from public likes/reposts)</li>
                    <li>Winner usernames and their verification results</li>
                    <li>Anti-bot filter configuration and engagement task settings</li>
                    <li>Timestamp of the draw</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-textPrimary mb-1">Session Data (Temporary)</h3>
                  <p>
                    Active draw sessions are stored in Redis with a 15-minute TTL (time to live). This data 
                    is automatically deleted after expiration and is not backed up.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-textPrimary mb-1">Contact Form Submissions</h3>
                  <p>
                    If you use our contact form, we receive your name, email address, and message content. 
                    This data is sent to our support email and is not stored in any database.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">3. Data We Do NOT Collect</h2>
              <ul className="list-disc list-inside space-y-2 ml-2 text-textSecondary text-sm">
                <li><strong className="text-textPrimary">Passwords</strong> — We never ask for or store any passwords.</li>
                <li><strong className="text-textPrimary">Twitter Cookies</strong> — Session cookies (auth_token, ct0) provided for scraping are used in-memory only and never persisted to disk or database.</li>
                <li><strong className="text-textPrimary">Tracking Cookies</strong> — We do not use cookies for analytics, advertising, or user tracking.</li>
                <li><strong className="text-textPrimary">Personal Information</strong> — We do not collect IP addresses, browser fingerprints, or device identifiers.</li>
                <li><strong className="text-textPrimary">Payment Information</strong> — FairGiveaway is free. We never collect financial data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">4. How We Store Data</h2>
              <div className="text-textSecondary leading-relaxed text-sm space-y-3">
                <p><strong className="text-textPrimary">MongoDB</strong> — Finalized giveaway records are stored permanently in a MongoDB database hosted on MongoDB Atlas.</p>
                <p><strong className="text-textPrimary">Redis (Upstash)</strong> — Active draw sessions are stored temporarily with automatic expiration (15-minute TTL).</p>
                <p>Both services use encryption in transit (TLS) and at rest. Access is restricted to authorized application credentials only.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">5. Third-Party Services</h2>
              <div className="text-textSecondary leading-relaxed text-sm space-y-3">
                <p>We interact with the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-textPrimary">X (Twitter)</strong> — We scrape publicly available tweet engagement data (likes, reposts, replies) and user profile information.</li>
                  <li><strong className="text-textPrimary">MongoDB Atlas</strong> — Cloud database provider for permanent data storage.</li>
                  <li><strong className="text-textPrimary">Upstash Redis</strong> — Serverless Redis provider for ephemeral session data.</li>
                  <li><strong className="text-textPrimary">Vercel</strong> — Frontend hosting and deployment.</li>
                </ul>
                <p>We do not sell, trade, or transfer your data to any other third parties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">6. Data Retention</h2>
              <div className="text-textSecondary leading-relaxed text-sm space-y-3">
                <p><strong className="text-textPrimary">Finalized giveaways</strong> are retained indefinitely as permanent public records. This is by design — transparency and auditability are core features of the platform.</p>
                <p><strong className="text-textPrimary">Active sessions</strong> are automatically deleted after 15 minutes.</p>
                <p><strong className="text-textPrimary">Contact form data</strong> is retained only in our email inbox and not in any database.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">7. Your Rights</h2>
              <div className="text-textSecondary leading-relaxed text-sm space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Request information about what data we hold related to your username.</li>
                  <li>Request deletion of your data, subject to our ability to do so without compromising the integrity of finalized draw records.</li>
                  <li>Contact us with any privacy concerns or questions.</li>
                </ul>
                <p>
                  Note: Because finalized giveaway records are designed to be immutable public audit trails, 
                  we may not be able to delete individual participant entries from completed draws without 
                  compromising the integrity of the record.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">8. Children&apos;s Privacy</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                FairGiveaway is not intended for use by individuals under the age of 13. We do not knowingly 
                collect data from children. If you believe a child has used our Service, please contact us 
                and we will take appropriate action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">9. Changes to This Policy</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                We may update this Privacy Policy from time to time. The most current version will always be 
                available on this page with the &quot;Last updated&quot; date at the top.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-textPrimary mb-3">10. Contact</h2>
              <p className="text-textSecondary leading-relaxed text-sm">
                For any privacy-related questions or data deletion requests, please contact us at{' '}
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
