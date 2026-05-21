# FairGiveaway.online - Frontend

**FairGiveaway** is a modern, transparent, and verifiable web application for hosting social media giveaways. Powered by the Web Crypto API, it ensures that random number generation cannot be tampered with or manipulated.

[**Visit the Site**](https://fairgiveaway.online) | [**X/Twitter**](https://x.com/isaac_newton252)

## 🚀 Key Features

*   **100% Provably Fair:** Uses the browser's native `crypto.getRandomValues()` for cryptographically secure randomness, removing predictable patterns seen in standard `Math.random()`.
*   **Platform Integration:** Seamlessly fetch engagement data from social media platforms (starting with X/Twitter).
*   **Flexible Configurations:** Set specific rules for giveaways (e.g., must follow host, minimum account age, exclude bots, must interact with external posts).
*   **Live Draw Animation:** An engaging, suspenseful slot-machine style animation during the verification and selection process.
*   **Verifiable History:** Results are calculated instantly and locked forever. Anyone can take the public Draw ID and independently verify the primary and secondary (backup) winners.
*   **Modern UI/UX:** A clean, responsive, and elegant "neo-brutalist" inspired dark-mode interface built with Tailwind CSS v4.

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (React 19) with App Router
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons:** [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome 6)
*   **Theming:** `next-themes` for robust dark mode support
*   **Animations:** Custom Tailwind CSS animations and transitions

## 📦 Getting Started

### Prerequisites

*   Node.js (v20 or higher recommended)
*   npm, yarn, or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/fair-giveaway/fairgiveaway-frontend.git
    cd fairgiveaway-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    bun install
    ```

3.  Set up environment variables (if any):
    Create a `.env.local` file in the root directory. Currently, the API endpoint can be configured via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:7860`).

4.  Run the development server:
    ```bash
    npm run dev
    # or
    bun dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 📁 Project Structure & Architecture

*   `/app`: Next.js App Router structure, including public marketing pages, history viewing (`/history`), and the draw pipeline (`/platforms`).
*   `/components`: Reusable React components.
    *   `/components/ui`: Generic UI elements (`Avatar.tsx`, `Toggle.tsx`, `SlideDown.tsx`, etc.).
    *   `/components/draw`: Specific components for the 3-phase draw process (`ConfigurationPhase.tsx`, `ActiveSession.tsx`, `FinalizedSession.tsx`).
*   `/lib`: Core logic.
    *   `api.ts`: API client and robust mock data layer for local development.
    *   `fairDraw.ts`: The cryptographic core utilizing `fisherYatesShuffle` and `crypto.getRandomValues`.
    *   `shared.ts`: Global configuration and links.
*   `/docs`: In-depth architecture and design documentation.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---
*Trust Built into the Code.*
