# Trark 🎬

A modern, responsive web application for tracking upcoming movies, TV series, and anime. Built with Next.js, TypeScript and Redux, it features real-time filtering, countdowns, and a seamless search experience using the TMDB and Jikan APIs.

## ✨ Features
- Toggle between Movies, TV Series, and Anime.
- View upcoming releases in a responsive grid layout.
- Search upcoming anime or movie titles.
- Each Shows displays a live countdown to its expected release date.
- Sorting by release date, title, popularity
- Pagination.
- Watch trailers directly in-app (where available).
- Skeleton loaders with shimmer for better UX
- Clean, responsive UI with Tailwind CSS

## 🛠️ Tech Stack
- Next.js (App Router)
- TypeScript
- Redux Toolkit (RTK)
- Tailwind CSS
- Lucide React Icons
- TMDB (The Movie Database) & Jikan (Unofficial MyAnimeList API)

## 📡 APIs Used
 **Anime**

  #### Jikan API

- Endpoint: /v4/seasons/upcoming

- Used to fetch upcoming anime data from MyAnimeList

  **Movies / Series**

  #### TMDB API

- Used for upcoming movies and TV shows


## 🧠 Architecture Decisions

- Server-side fetching is used where possible for performance and security

- API responses are normalized before being used in UI components

- External APIs are accessed via Next.js API routes to avoid exposing keys

## 🔍 Search Implementation

- Search is powered by the Jikan & TMDB search API

- Input is debounced to avoid unnecessary API calls

- Results update dynamically as the user types

## 🖼️ Image Handling

- Images are loaded using Next.js <Image />

- Supports fallback images when posters are unavailable

- Optimized for performance and responsiveness

## 🧪 Planned Updates

- ✅ Tracklist feature

- ✅ User authentication

- ✅ Release notifications

- ✅ Anticipated show section

- ✅ Api fetching securely through Next.js API routes and server-side caching


## 📦 Installation & Setup
# Clone the repository
git clone https://github.com/msamicahel/trark.git

# Navigate into the project
cd trark

# Install dependencies
npm install

# Run the development server
npm run dev

Open http://localhost:3000 in your browser.

## 🔑 Environment Variables

- If using TMDB:

TMDB_API_ACCESS_TOKEN=your_api_access_token_here
