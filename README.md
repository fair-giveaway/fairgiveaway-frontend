<p align="center">
  <img src="https://raw.githubusercontent.com/fair-giveaway/fairgiveaway-frontend/refs/heads/master/public/logo.png" alt="FairGiveaway Logo" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">FairGiveaway — Frontend</h1>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://fairgiveaway.online"><img src="https://img.shields.io/badge/Live-fairgiveaway.online-6D28D9" alt="Live Site" /></a>
  <a href="https://github.com/fair-giveaway/fairgiveaway-frontend/issues"><img src="https://img.shields.io/github/issues/fair-giveaway/fairgiveaway-frontend" alt="Issues" /></a>
</p>

<p align="center">
  The frontend application for <strong>FairGiveaway</strong> — a provably fair, open-source giveaway winner selector for social media.<br />
  Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.
</p>

<p align="center">
  <a href="https://fairgiveaway.online">Live Site</a> •
  <a href="https://api.fairgiveaway.online/docs">API Docs</a> •
  <a href="https://github.com/fair-giveaway/fairgiveaway-backend">Backend Repo</a> •
  <a href="https://github.com/orgs/fair-giveaway/discussions">Discussions</a>
</p>

---

## Features

- **Provably Fair Draws** — Uses `crypto.getRandomValues()` (Web Crypto API) with a Fisher-Yates shuffle for cryptographically secure, unbiased winner selection entirely in the browser.
- **Anti-Bot Verification** — Configurable filters: profile picture check, bio check, minimum account age, minimum post count, and comment verification.
- **Engagement Tasks** — Require participants to like, comment, follow, or engage with external tweets before being eligible.
- **Live Draw Animation** — Suspenseful slot-machine style animation during the verification and selection process.
- **Permanent Public Records** — Every finalized draw is permanently stored and publicly auditable by anyone with the Draw ID.
- **Global Leaderboards** — Paginated leaderboard of the most active giveaway hosts.
- **Verify Any Draw** — Enter any Draw ID to independently verify winners, participants, and configuration.
- **Responsive Dark-Mode UI** — Premium neo-brutalist design built with Tailwind CSS v4 custom theme tokens.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library (FontAwesome 6) |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode support |

---

## Getting Started

### Prerequisites

- **Node.js** v20+ or **Bun** v1.0+
- The [backend server](https://github.com/fair-giveaway/fairgiveaway-backend) running (defaults to `http://localhost:7860`)

### Installation

```bash
# Clone the repository
git clone https://github.com/fair-giveaway/fairgiveaway-frontend.git
cd fairgiveaway-frontend

# Install dependencies
bun install
# or: npm install

# Create environment file (optional)
echo "NEXT_PUBLIC_API_URL=http://localhost:7860" > .env.local

# Start the development server
bun dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

```
fairgiveaway-frontend/
├── app/                    # Next.js App Router pages
│   ├── about/              # About Us page
│   ├── contact/            # Contact form page
│   ├── docs/               # Documentation page
│   ├── faq/                # FAQ page
│   ├── history/            # Giveaway history browser
│   ├── leaderboard/        # Host leaderboards
│   ├── platforms/          # Platform-scoped draw UI
│   │   └── x/              # X (Twitter) draw pipeline
│   │       └── draw/[id]   # Active draw session
│   ├── privacy/            # Privacy Policy
│   ├── terms/              # Terms of Service
│   ├── verify/             # Draw verification tool
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── not-found.tsx       # Custom 404 page
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt config
├── components/
│   ├── draw/               # Draw-specific components
│   ├── home/               # Landing page sections
│   ├── ui/                 # Reusable UI primitives
│   ├── Navbar.tsx          # Global navigation bar
│   └── Footer.tsx          # Global footer
├── lib/
│   ├── api.ts              # API client with type definitions
│   ├── fairDraw.ts         # Cryptographic shuffle core
│   └── shared.ts           # Global config and links
└── public/                 # Static assets (logo, icons)
```

---

## Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:7860` | Backend API base URL |

---

## Scripts

| Command | Description |
| :--- | :--- |
| `bun dev` | Start development server on port 3000 |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

## Security

To report a security vulnerability, please see our [Security Policy](SECURITY.md).

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Trust Built into the Code.</strong><br/>
  <a href="https://fairgiveaway.online">fairgiveaway.online</a> •
  <a href="https://x.com/FairGiveaway">@FairGiveaway</a>
</p>
