# FinPlan

**Personal Finance Manager** — A fully offline, installable PWA for tracking income, expenses, savings, investments, and financial goals.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

<p align="center">
  <img src="public/icons/icon-192.png" alt="FinPlan Icon" width="96" />
</p>

---

## Overview

FinPlan is a mobile-first personal finance tracker that runs entirely in your browser with no server, no account, and no internet required after the first load. All data stays on your device via `localStorage`.

## Features

### Dashboard
- Monthly income & expense overview with visual breakdowns
- Add/edit monthly financial data (salary, reimbursements, FD returns)
- Track expenses and savings/investments per month
- Income vs Expense trend charts (Line, Bar, Pie)
- Month-over-month navigation with running balance

### Expenses
- Category-based expense tracking with custom categories
- Add, edit, and delete individual expenses
- Visual category breakdown with pie charts
- Category management (add, rename, reorder, hide/show)

### Goals
- Financial goal tracking with progress visualization
- Mutual Fund portfolio tracker with returns calculation
- Fixed Deposit tracker with maturity dates
- Monthly savings/investment breakdown
- Archived savings history

### Tools
- **EMI Calculator** — Loan EMI computation with principal, interest, and total breakdown
- **Bill Reminders** — Recurring payment reminders with due dates, categories, and toggle controls

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19 |
| Build | Vite 7 |
| Charts | Recharts 3 |
| PWA | vite-plugin-pwa (Workbox) |
| Storage | localStorage |
| Deploy | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repository
git clone https://github.com/subramanyaSgb/finplan.git
cd finplan/finplan-pwa

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview    # Preview the production build locally
```

### Deploy to Vercel

```bash
npx vercel --prod
```

Or connect the GitHub repo to [Vercel](https://vercel.com) for automatic deployments on push.

## Project Structure

```
finplan-pwa/
├── public/
│   ├── icons/              # PWA icons (192, 512, maskable)
│   └── favicon.svg         # App favicon
├── src/
│   ├── FinPlan.jsx         # Entire application (single-file architecture)
│   └── main.jsx            # React entry point
├── index.html              # PWA meta tags & theme
├── vite.config.js          # Vite + React + PWA config
├── vercel.json             # SPA rewrites & caching headers
└── package.json
```

## PWA Capabilities

- **Installable** — Add to home screen on mobile and desktop
- **Offline-first** — Works without internet after initial load
- **Auto-update** — Service worker updates automatically when new version is deployed
- **Standalone mode** — Runs fullscreen without browser chrome
- **Portrait optimized** — Designed for mobile-first usage (480px max-width)

## Data & Privacy

- **100% offline** — No data leaves your device, ever
- **localStorage** — All financial data stored locally in the browser
- **No accounts** — No sign-up, no login, no server
- **No analytics** — Zero tracking, zero telemetry

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build with SW generation |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

MIT

---

<p align="center">
  Built with React + Vite | Deployed on Vercel
</p>
