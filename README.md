# Skola
_Note: Skola is still in early-ish development. Expect bugs, missing features, and breaking changes. Feedback is very welcome!_

<img width="1512" alt="Skola Main Interface" src="https://github.com/user-attachments/assets/466477b2-7a60-4587-b161-d17f14a1f4e2" />

A modern, open-source spaced repetition application that reimagines flashcard learning with a focus on beautiful design, local-first architecture, and thoughtful user experience. Visit [skola.cards](https://skola.cards) now.

## Running Locally

Skola is a `pnpm` workspace-free single-package app with two entry points:

- the main web app powered by Vite
- an optional Tauri desktop shell in [`src-tauri`](/Users/sergeypogranichniy/WebstormProjects/skola/src-tauri)

### Prerequisites

- Node.js 18+ recommended
- `corepack` enabled so the pinned package manager version can be used
- Rust toolchain only if you want to run the Tauri desktop app

Enable the package manager pinned by the repo:

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
```

Install dependencies:

```bash
corepack pnpm install
```

### Run The Web App

Start the Vite dev server:

```bash
corepack pnpm run start
```

The app will be available at [http://127.0.0.1:5173](http://127.0.0.1:5173) or the equivalent localhost URL printed by Vite.

Useful checks:

```bash
corepack pnpm run lint:type
corepack pnpm run build
```

These were verified successfully in this repository on May 11, 2026.

### Run The Tauri Desktop App

The desktop wrapper lives in [`src-tauri`](/Users/sergeypogranichniy/WebstormProjects/skola/src-tauri) and requires a working Rust toolchain. If `cargo` is not installed, `tauri dev` will fail before startup.

Install Rust with [rustup](https://rustup.rs/), then run:

```bash
corepack pnpm exec tauri dev
```

To build the desktop app:

```bash
corepack pnpm exec tauri build
```

### Repo Structure

- [`src/app`](/Users/sergeypogranichniy/WebstormProjects/skola/src/app) contains route-level views and feature UI such as learning, deck management, cards, settings, and shell layout
- [`src/components/ui`](/Users/sergeypogranichniy/WebstormProjects/skola/src/components/ui) contains the shared component primitives and styles
- [`src/logic`](/Users/sergeypogranichniy/WebstormProjects/skola/src/logic) contains application state and domain logic for decks, cards, notes, statistics, and settings
- [`src/logic/db.ts`](/Users/sergeypogranichniy/WebstormProjects/skola/src/logic/db.ts) defines the local Dexie database and optional Dexie Cloud sync
- [`src/i18n`](/Users/sergeypogranichniy/WebstormProjects/skola/src/i18n) contains internationalization setup and locale files
- [`src/style`](/Users/sergeypogranichniy/WebstormProjects/skola/src/style) contains the design tokens and global styles
- [`src-tauri`](/Users/sergeypogranichniy/WebstormProjects/skola/src-tauri) contains the desktop packaging and native app configuration

## Core Features

**Local-First Architecture** — Your data lives in your browser using IndexedDB, ensuring privacy, speed, and complete ownership of your learning materials. No account required.

**Progressive Web App** — Install Skola on any device and use it offline. Full PWA support with caching.**

**Cloud Sync** — Optional cloud synchronization powered by Dexie Cloud lets to access your decks across devices.

**Spaced Repetition** — Skola implements the FSRS (Free Spaced Repetition Scheduler) algorithm to optimize review timing and maximize retention with minimal effort.

**Beautiful, Minimal Design** — Custom-built component system with a unique design language that introduces texture and physicality. Decks appear as real index cards.

**Cognitive Prompts** — Beyond simple memorization, Skola strives to encourage higher-order thinking by challenging you with cognitive prompts on cards you've mastered, pushing you to deeper understanding.

**Rich Content Support** — Create normal, double-sided, and cloze deletion cards with full rich text (HTML) editing capabilities.

## Philosophy

Skola is built on the belief that spaced repetition software should be open, beautiful, and focused on the core learning experience. It challenges the notion that effective learning tools must sacrifice design for functionality or be locked behind paywalls.

AI is intentionally used sparingly – there's no AI flashcard generation. The act of creating cards is part of the learning process, and Skola is designed to support that work, not bypass it.

## Current Limitations

- Statistics view temporarily disabled during UI refactor (will return with lightweight charting)
- Cards view experimental and under evaluation
- Image occlusion not yet implemented
- Audio support not yet implemented
- Limited note explorer and management features (e.g., bulk editing, tagging)

## Stack

- **React**
- **Dexie.js**
- **FSRS.js**

## Motivation

Many learners rely on spaced repetition tools like Anki, which are powerful but often have unintuitive interfaces that don't reward the learning process. Other alternatives are expensive or closed-source. Skola aims to provide a free, open-source alternative that doesn't compromise on user experience or design quality.

## Contributing

Contributions and feedback are very welcome! If you're interested in helping shape the future of Skola, please create an issue or start a discussion. This is an active project with ongoing development.

---
