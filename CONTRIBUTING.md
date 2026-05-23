# Contributing to FairGiveaway Frontend

Thank you for considering contributing to FairGiveaway! This document provides guidelines and best practices for contributing to the frontend repository.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style & Guidelines](#code-style--guidelines)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/fairgiveaway-frontend.git
   cd fairgiveaway-frontend
   ```
3. **Install dependencies:**
   ```bash
   bun install
   ```
4. **Start the dev server:**
   ```bash
   bun dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to verify everything works.

> **Note:** You'll need the [backend server](https://github.com/fair-giveaway/fairgiveaway-backend) running on port 7860 for API-dependent features.

---

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/my-feature
   # or: git checkout -b fix/issue-description
   ```
2. **Make your changes** — keep commits small and focused.
3. **Test locally** — ensure the app builds without errors:
   ```bash
   bun run build
   ```
4. **Lint your code:**
   ```bash
   bun run lint
   ```
5. **Push** to your fork and open a Pull Request against `main`.

---

## Code Style & Guidelines

### TypeScript
- **Strict mode** is enabled. All new code must be fully typed.
- **Never use `any`** — use `unknown`, generics, or proper interfaces instead.
- Prefer `interface` for object shapes and `type` for unions/intersections.

### React & Next.js
- Use **functional components** with React Hooks.
- Use the **App Router** (not Pages Router) for all new pages.
- Keep components small and focused — extract reusable logic into custom hooks.
- Use **Server Components** by default; only add `'use client'` when necessary.

### Styling
- Use **Tailwind CSS v4** utilities exclusively — avoid writing custom CSS unless extending the design system.
- Use the project's custom theme tokens defined in `app/globals.css` (e.g., `text-textPrimary`, `bg-bgBase`, `neo-card`, `neo-button-primary`).
- Ensure all UI is **responsive** and works on mobile.

### File Organization
- Pages go in `app/` following Next.js App Router conventions.
- Reusable components go in `components/ui/`.
- Feature-specific components go in `components/<feature>/`.
- Business logic and API calls go in `lib/`.

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/). Every commit message should be structured as:

```
<type>(<scope>): <description>
```

### Types

| Type | Description |
| :--- | :--- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring (no feature or fix) |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, or tooling |

### Examples

```bash
git commit -m "feat(draw): add comment verification filter"
git commit -m "fix(history): handle null avatar URL in draw cards"
git commit -m "docs: update README with project structure"
git commit -m "style(ui): align toggle component spacing"
```

---

## Pull Request Process

1. **Fill out the PR template** — describe what changed and why.
2. **Link related issues** — use `Closes #123` or `Fixes #123` in the PR body.
3. **Keep PRs focused** — one feature or fix per PR. Large PRs are harder to review.
4. **Ensure CI passes** — your PR must build and lint cleanly.
5. **Be responsive** — address review feedback promptly.

### PR Title Format

Use the same format as commit messages:
```
feat(draw): add engagement task verification
```

---

## Reporting Issues

- **Bug reports**: Use the [Issues tab](https://github.com/fair-giveaway/fairgiveaway-frontend/issues) with clear reproduction steps.
- **Feature requests**: Open a [Discussion](https://github.com/orgs/fair-giveaway/discussions) first to gauge interest.
- **Security vulnerabilities**: See [SECURITY.md](SECURITY.md) — do NOT open a public issue.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold a welcoming and inclusive environment for everyone.

---

Thank you for helping make FairGiveaway better! 🎉
