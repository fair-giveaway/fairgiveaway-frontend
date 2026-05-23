'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/shared';
import { FaEnvelope, FaXTwitter, FaGithub, FaPaperPlane, FaCheck, FaCircleExclamation } from 'react-icons/fa6';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: ContactFormData = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const channels = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      desc: 'Best for support requests and data inquiries',
    },
    {
      icon: FaXTwitter,
      label: 'X (Twitter)',
      value: '@FairGiveaway',
      href: siteConfig.links.twitter,
      desc: 'Follow us for updates and announcements',
    },
    {
      icon: FaGithub,
      label: 'GitHub Discussions',
      value: 'fair-giveaway',
      href: siteConfig.links.discussions,
      desc: 'Bug reports, feature requests, and community help',
    },
  ];

  return (
    <main className="w-full pt-32 pb-20">
      <div className="neo-container max-w-4xl">
        <div className="text-center mb-16 animate-fade-in-up opacity-0">
          <span className="neo-label-sm text-accentPrimary mb-4 block">Get in Touch</span>
          <h1 className="neo-title mb-6">Contact Us</h1>
          <p className="neo-subtitle max-w-2xl mx-auto">
            Have a question, found a bug, or want to suggest a feature? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in-up opacity-0 stagger-1">
          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.href.startsWith('mailto') ? undefined : '_blank'}
              rel={ch.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="neo-card p-6 text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accentPrimary/10 mb-3 group-hover:bg-accentPrimary/20 transition-colors">
                <ch.icon className="text-xl text-accentPrimary" />
              </div>
              <h3 className="font-semibold text-textPrimary text-sm mb-1">{ch.label}</h3>
              <p className="text-accentPrimary text-sm font-medium mb-2">{ch.value}</p>
              <p className="text-xs text-textMuted">{ch.desc}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="neo-card p-8 md:p-12 animate-fade-in-up opacity-0 stagger-2">
          <h2 className="text-2xl font-bold text-textPrimary mb-2">Send us a Message</h2>
          <p className="text-textSecondary text-sm mb-8">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>

          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
                <FaCheck className="text-2xl text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">Message Sent!</h3>
              <p className="text-textSecondary text-sm mb-6">
                Thank you for reaching out. We&apos;ll respond to your message soon.
              </p>
              <button onClick={() => setStatus('idle')} className="neo-button-secondary text-sm">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-textPrimary mb-2">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="neo-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-textPrimary mb-2">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="neo-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-textPrimary mb-2">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="neo-input"
                >
                  <option value="">Select a topic</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="General Question">General Question</option>
                  <option value="Data Deletion Request">Data Deletion Request</option>
                  <option value="Partnership / Collaboration">Partnership / Collaboration</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-textPrimary mb-2">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="neo-input resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <FaCircleExclamation />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="neo-button-primary gap-2 w-full md:w-auto"
              >
                {status === 'sending' ? (
                  <>Sending...</>
                ) : (
                  <><FaPaperPlane className="text-sm" /> Send Message</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
