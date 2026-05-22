# FairGiveaway.online Architecture

This document describes the high-level architecture and design decisions for the FairGiveaway frontend.

## Overview

The frontend is built with **Next.js 15+ (App Router)** and **React 19**. It is designed to be highly responsive, interactive, and visually appealing, using a "neo-brutalist" design language (defined in `app/globals.css` with **Tailwind CSS v4**).

## Key Concepts

### 1. Cryptographically Secure Draws (`fairDraw.ts`)
The core value proposition of FairGiveaway is verifiable fairness.
* We do NOT use `Math.random()`, which is predictable and vulnerable to manipulation.
* Instead, we use the browser's native **Web Crypto API** (`crypto.getRandomValues`) via a custom `cryptoRandom` function.
* This is combined with a **Fisher-Yates Shuffle** implementation to ensure a mathematically uniform distribution of participants when selecting primary and secondary winners.

### 2. The Draw Pipeline

The core user journey consists of three main phases, managed by the `/platforms/[platform]/draw/[id]/page.tsx` component and its children:

*   **Phase 1: Configuration (`ConfigurationPhase.tsx`)**
    *   The host lands here after initiating a draw from a social media post URL.
    *   They configure the giveaway rules (number of winners, engagement mode, anti-bot filters, etc.).
    *   This component manages complex form state and layout logic, using reusable UI components (e.g., `Toggle.tsx`).
*   **Phase 2: Active Session / Verification (`ActiveSession.tsx` and `useVerification.ts`)**
    *   Once the host clicks "Draw Winners", the app transitions to the active session.
    *   A simulated slot-machine style animation runs while the app "verifies" participants against the configured rules.
    *   The logic for managing the slots, delays, and state transitions is extracted into the `useVerification` custom hook to keep the UI component clean.
    *   Once all slots are verified or failed, the draw is completed and saved to the backend.
*   **Phase 3: Finalized Session (`FinalizedSession.tsx` and `/history/[platform]/[id]/page.tsx`)**
    *   After saving, the user is redirected to the permanent history page.
    *   This page displays the immutable record of the draw: host, date, rules used, and the verified primary and secondary winners.

### 3. State Management

*   **Local State:** We primarily use standard React `useState` and `useReducer` for component-level state (e.g., form inputs, toggle states).
*   **Complex State Logic:** For complex sequences like the verification animation, we extract the state and lifecycle logic into custom hooks (like `useVerification.ts`).
*   **Session Storage:** We use `sessionStorage` (via `lib/api.ts`) to temporarily cache draw configuration data when transitioning between the initial setup page and the active draw session. This prevents data loss on a simple page reload during setup, but ensures the data is cleared once the draw is finalized.
*   **Global/Server State:** When connected to the real backend, we will fetch history data and verify participants via API calls. Currently, this is mocked in `lib/api.ts`.

### 4. Leaderboards & Data Pagination

The application surfaces historical data through paginated views to maintain performance.
*   **Leaderboards:** The platform aggregates verified draws to generate a global leaderboard (`/leaderboard/[platform]/page.tsx`). The top 3 hosts are given a distinct, visually distinct podium layout, while the rest are displayed sequentially.
*   **Client-Side URL Pagination:** Both the History and Leaderboard views use Next.js `useSearchParams` (`?page=x`) coupled with `useMemo` for slicing the data. This provides standard URL routing, allowing users to deep-link directly into specific pages and ensuring the UI remains snappy.

### 5. Profile Photos and Rate Limiting

Handling profile photos (especially from platforms like X/Twitter) requires careful consideration of API rate limits.

*   **During Animation:** To prevent spamming external avatar services (like `unavatar.io`) and hitting rate limits during the rapid slot animation, we use a lightweight `Avatar.tsx` component that generates a deterministic colored circle with the user's initial letter based on a hash of their username. This requires **zero network requests**.
*   **Finalized State & Leaderboards:** When the draw is finalized, the backend scraper (a sacrificial X account) is responsible for fetching the real `pbs.twimg.com` profile image URL. This permanent URL is saved in the database. The History and Leaderboards use this cached URL within the `Avatar` component.
*   **Fallback Strategy:** If a real photo fails to load (e.g., URL expired), the `Avatar` component gracefully falls back to the letter initial.

### 6. Styling and Design System

*   We use **Tailwind CSS** for all styling.
*   A custom color palette (`bgBase`, `bgElevated`, `textPrimary`, `textSecondary`, `accentPrimary`, etc.) is defined in `tailwind.config.ts`.
*   We use a set of custom CSS classes defined in `app/globals.css` (e.g., `.neo-card`, `.neo-button-primary`, `.neo-input`) to maintain consistent styling across the application without repeating long Tailwind class strings everywhere.
*   We strictly avoid over-using effects like `blur`, `drop-shadow`, or excessive `animate-ping` to keep the UI clean, modern, and performant.

## Directory Structure

*   `app/`: Next.js App Router structure.
    *   `history/`: Pages for viewing finalized draw history.
    *   `platforms/`: Entry points for starting a draw for a specific platform (e.g., `platforms/x`).
*   `components/`:
    *   `ui/`: Reusable, generic UI building blocks (`Avatar.tsx`, `Toggle.tsx`, `SlideDown.tsx`).
    *   `draw/`: Components specific to the giveaway draw flow (`ConfigurationPhase.tsx`, `ActiveSession.tsx`, etc.).
*   `lib/`:
    *   `api.ts`: API client and mock data layer.
    *   `utils.ts`: Generic utility functions (e.g., `cn` for Tailwind class merging).
