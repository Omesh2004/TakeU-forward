# Interactive Wall Calendar

An interactive wall calendar built with Next.js. Supports date range selection, per-day memos and tasks, and includes both light and dark modes. All data is persisted in the browser's localStorage.

## Features

- Monthly calendar grid with month-to-month navigation
- Single-day selection and Shift+click range selection
- Memos saved per day, month, or date range
- Per-day task lists with completion tracking
- Light and dark mode
- Unique color theme for each month
- Responsive layout for desktop and mobile

## Run Locally

Requires [Node.js](https://nodejs.org/) v18+.

```bash
git clone https://github.com/Omesh2004/TakeU-forward.git
cd TakeU-forward
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel auto-detects Next.js — no extra configuration needed.
4. Click **Deploy**.

Or deploy from the CLI:

```bash
npm i -g vercel
vercel
```

## Tech Stack

- Next.js
- CSS Modules
- localStorage for client-side persistence
