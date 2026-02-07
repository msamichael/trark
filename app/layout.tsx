import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from './components/Providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const clashGrotesk = localFont({
  src: [
    {
      path: "./fonts/ClashGrotesk-Variable.ttf",
      style: "normal",
    },
  ],
  variable: "--font-clashGrotesk"
});
export const aeonik = localFont({
  src: [
    {
      path: "./fonts/Aeonik-Regular.ttf",
      style: "normal",
    },
  ],
  variable: "--font-aeonik"
});
export const plusJakarta = localFont({
  src: [
    {
      path: "./fonts/PlusJakartaSans.ttf",
      style: "normal",
    },
  ],
  variable: "--font-plusjakarta"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trarkapp.vercel.app"),
  title: {
    default: "Trark — Upcoming Releases Tracker",
    template: "%s | Trark"
  },
  description:
    "Track upcoming movies, TV series (including new seasons), and anime with search, sorting, and a watchlist.",
  icons: {
    icon: "/icon.png",
  },
  keywords: [
    "upcoming movies",
    "upcoming tv series",
    "upcoming anime",
    "release dates",
    "watchlist",
    "trailer",
    "TMDB",
    "Jikan"
  ],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    url: "https://trarkapp.vercel.app",
    title: "Trark — Upcoming Releases Tracker",
    description:
      "Track upcoming movies, TV series (including new seasons), and anime with search, sorting, and a watchlist.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Trark"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Trark — Upcoming Releases Tracker",
    description:
      "Track upcoming movies, TV series (including new seasons), and anime with search, sorting, and a watchlist.",
    images: ["/icon.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${clashGrotesk.variable} ${aeonik.variable}  ${plusJakarta.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
