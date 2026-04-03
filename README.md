# LinkedInBadge

Create LinkedIn-style profile badges with developer-themed presets, custom text, image upload, and one-click export.

## Features

- Drag-and-drop or upload a profile photo
- Apply developer humor presets or create a custom badge label
- Adjust badge color and image zoom
- Export or share the generated badge
- Deploy as a static site, including GitHub Pages

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app is served at `http://localhost:3000`.

## Available Scripts

- `npm run dev` — start the local development server
- `npm run lint` — run TypeScript checks
- `npm run build` — create a production build for the site root
- `npm run build:pages` — create a production build for GitHub Pages under `/LinkedInBadge/`
- `npm run preview` — preview the latest production build
- `npm run clean` — remove the generated `dist/` directory

## Production Build

Build the app for deployment:

```bash
npm run build
```

To verify the production output locally:

```bash
npm run preview
```

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow at `/home/runner/work/LinkedInBadge/LinkedInBadge/.github/workflows/deploy-pages.yml` that:

- installs dependencies with `npm ci`
- runs `npm run lint`
- builds the app with the GitHub Pages base path
- deploys the `dist/` folder to GitHub Pages

To enable deployment:

1. Open the repository settings on GitHub.
2. Go to **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or run the workflow manually.

The published site URL is expected to be:

`https://voku.github.io/LinkedInBadge/`

## Key Files Detector Helper Prompt

Use this prompt when you want an assistant to quickly identify the files that matter for a change:

```text
You are reviewing the LinkedInBadge repository. Identify the key files involved for this task, explain why each file matters, and call out any build, deployment, metadata, or documentation files that must be updated before shipping the change.
```

## Repository Structure

- `/home/runner/work/LinkedInBadge/LinkedInBadge/src/App.tsx` — main application UI and badge generator logic
- `/home/runner/work/LinkedInBadge/LinkedInBadge/src/main.tsx` — React entry point
- `/home/runner/work/LinkedInBadge/LinkedInBadge/index.html` — HTML shell, favicon, and social metadata
- `/home/runner/work/LinkedInBadge/LinkedInBadge/public/` — static assets such as the favicon and social preview
- `/home/runner/work/LinkedInBadge/LinkedInBadge/vite.config.ts` — Vite configuration, including the deployment base path
- `/home/runner/work/LinkedInBadge/LinkedInBadge/.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow

## Contributing

Contributions are welcome via issues and pull requests:

https://github.com/voku/LinkedInBadge
