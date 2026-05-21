# Contributing to FairGiveaway.online Frontend

First off, thank you for considering contributing to FairGiveaway.online! It's people like you that make open source such a great community.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](../../issues/new)!

## Development Setup

1.  **Fork the repo** and clone it locally.
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Making a Pull Request

1.  **Create a branch** for your feature or bug fix:
    ```bash
    git checkout -b my-new-feature
    ```
2.  **Commit your changes** following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
    ```bash
    git commit -m "feat: add amazing new feature"
    ```
3.  **Push to your branch:**
    ```bash
    git push origin my-new-feature
    ```
4.  **Submit a Pull Request** to the `main` branch.

## Code Style and Guidelines

*   We use **Next.js (App Router)** with **React 19** and **TypeScript**. Please ensure all new code is strongly typed and avoids `any` where possible.
*   We use **Tailwind CSS v4** for styling. Stick to the utility classes and avoid writing custom CSS unless necessary. We also have a custom color palette defined in our `app/globals.css`.
*   Components should be functional and use React Hooks.
*   Keep components small and focused. Extract reusable logic into custom hooks (like our `useVerification` hook).
*   Follow the existing architecture (see `docs/ARCHITECTURE.md`).

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
