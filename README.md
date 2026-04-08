# Trark — Upcoming Release Tracker

> Never miss a release. Track upcoming movies, TV series, and anime all in one place.


**[Live Demo →](https://trarkapp.vercel.app)**

---

## Overview

Trark solves a simple but annoying problem — keeping track of when your favorite shows, movies, and anime are actually coming out. Instead of checking multiple sites, Trark pulls from TMDB and Jikan APIs to give you a single, clean view of upcoming releases with countdown timers, watchlist tracking, and smart filtering.

Currently used by 10+ active users to discover and track upcoming releases.

---

## Features

- **Upcoming Releases** — Movies, TV series (including new seasons), and anime in one place
- **Countdown Timers** — See exactly how long until each release
- **Hero Carousel + Most Anticipated** — Curated highlights for what's coming soon
- **Advanced Filtering & Sorting** — Filter by type, sort by release date or popularity
- **Pagination** — Browse large catalogs without performance hits
- **Watchlist** — Save releases with Google authentication via Firebase
- **Server-Side Fetching** — Fast initial loads with Next.js App Router

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS + Shadcn/ui |
| APIs | TMDB API, Jikan API |
| Auth + Storage | Firebase |

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/msamichael/trark.git
cd trark
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file in the root:
```env
TMDB_API_ACCESS_TOKEN=your_tmdb_api_access_token_here
```

Get your token at [themoviedb.org](https://www.themoviedb.org/settings/api).

### 3. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure
```
app/
├── (pages)/        # Route-based pages (movies, tv, anime, watchlist)
├── api/            # API route handlers
components/
├── ui/             # Shadcn/ui base components
config/             # App-wide configuration
```
