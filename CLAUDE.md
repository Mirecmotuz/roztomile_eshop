# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Roztomile is a Czech e-commerce web app selling handmade candles, beeswax products, and natural balms. The stack is React 18 + TypeScript (Vite) on the frontend, and Vercel Serverless Functions (Node.js) on the backend.

## Commands

```bash
npm run dev        # Start dev server (hot reload)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run typecheck  # TypeScript type check (no emit)
npm test           # Vitest test suite
```

To run a single test file:
```bash
npx vitest run api/order.test.ts
```

## Architecture

### Frontend (`src/`)

- **`App.tsx`** — root with React Router routes and Framer Motion page transitions
- **`config.ts`** — all `VITE_*` env vars accessed here; use this instead of `import.meta.env` directly in components
- **`store/cartStore.ts`** — Zustand cart state, persisted to localStorage as `roztomile-cart`
- **`data/products.ts`** — static product catalog (source of truth for all products)
- **`pages/`** — one component per route; `CheckoutPage.tsx` is the most complex (Packeta widget, Turnstile CAPTCHA, order submission)
- **`types/index.ts`** — shared TypeScript interfaces (`Product`, `CartItem`, `Order`, etc.)

### Backend (`api/`)

- **`api/order.js`** — single Vercel serverless endpoint for order processing: validates Turnstile CAPTCHA, rate-limits by IP + email, sends emails via EmailJS to both store owner and customer, integrates with Packeta for shipping labels

### Key integrations

| Service | Purpose | Config |
|---------|---------|--------|
| EmailJS | Transactional email (owner + customer) | `EMAILJS_*` env vars |
| Cloudflare Turnstile | CAPTCHA on checkout | `VITE_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` |
| Packeta | Parcel pickup shipping | `VITE_PACKETA_API_KEY` |
| Supabase | JS client included (supabase-js) | not yet fully wired |

Copy `.env.example` to `.env` and fill in all values before running locally.

## AI Agent Guidelines

This project uses the `ai/` directory for structured AI guidance (the AIDD framework):

- **Before any task**, read `vision.md` in the project root (if it exists) — it is the source of truth for goals and constraints
- Use `ai/**/index.md` files to discover available commands, rules, and skills without reading every file
- Read `aidd-custom/config.yml` for project-specific agent configuration
- If a task conflicts with the vision document, stop and ask the user to resolve it before proceeding
- `ai/**/index.md` files are auto-generated from frontmatter — do not edit them manually

### Project-owned agent assets (`aidd-custom/`)

- **`aidd-custom/`** is the **canonical** location for this repo’s custom **rules**, **skills**, and **commands** (not the upstream `ai/` copy).
- **Cursor mirrors** for the same assets live under **`.cursor/rules/<repo-root>/`**, **`.cursor/commands/<repo-root>/`**, and **`.cursor/skills/<repo-root>/`** where `<repo-root>` is this repository’s root directory name (e.g. `roztomile`).
- To refresh mirrors and indexes from `aidd-custom/`, follow **`aidd-custom/skills/sync-aidd-custom/SKILL.md`** (or the user’s **`/sync-aidd-custom`** command when available in Cursor).

## Deployment

Deployed on Vercel. The `api/` directory is automatically treated as serverless functions. The `.vercel/` directory contains project config.
