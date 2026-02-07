'use client';

import SearchBar from "./components/ui/SearchBar";
import SortBar from "./components/ui/SortBar";
import CategoryTab from "./components/ui/CategoryTab";
import GenreRow from "./components/ui/GenreRow";
import ShowGrid from "./components/layout/ShowGrid";
import HeroCarousel from "./components/layout/HeroCarousel";
import MostAnticipatedSection from "./components/layout/MostAnticipatedSection";
import Link from "next/link";
import { BookmarkIcon, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, signOutUser } from "./lib/firebaseStorage";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <div className="p-2.5 scroll-smooth">
      <div className="flex justify-between items-center mb-4">
        {/* Trark Logo */}
        <div className="flex items-center self-start gap-3 ml-4 mt-2 pl-2 md:pl-6">
          <img
            src="/icon.png"
            alt="Trark Logo"
            className="h-6 w-6 object-contain"
          />
          <h2 className="text-2xl font-bold">Trark</h2>
        </div>
        <div className="flex justify-end gap-x-4 items-center">
          <Link
            href="/watchlist"
            className="mr-1 flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900/80 px-4 py-2 rounded-lg border border-zinc-800 transition-all duration-300 hover:border-zinc-700"
          >
            <BookmarkIcon size={20} className="text-zinc-400" />
            <span className="text-sm text-white">Watchlist</span>
          </Link>
          {user ? (
            <>
              {/* Mobile: avatar with dropdown */}
              <div className="md:hidden relative">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-700"
                  aria-label="Account menu"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-700" />
                  )}
                </button>
                {mobileMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-36 rounded-md border border-zinc-800 bg-zinc-950/95 p-1 shadow-lg z-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded px-2 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Desktop: avatar + logout button */}
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-8 h-8 mr-4 rounded-full object-cover border-2 border-zinc-700"
                  />
                )}
              </div>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              className="flex items-center mr-4 gap-2 border border-purple-400/40 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white hover:from-purple-500 hover:to-indigo-500 shadow-[0_8px_30px_rgba(88,28,135,0.35)]"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
      <main>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Show Section*/}
        <section className="max-w-300 mx-auto w-full mt-13 ">
          {/* Search Bar & Sort  */}
          <div
            className="flex mb-8 gap-2 sticky top-2 z-80 
          bg-(--color-background)/90 p-3 rounded-3xl"
          >
            <div className="flex-2">
              <SearchBar />
            </div>
            <SortBar />
          </div>

          {/* Most Anticipated Section */}
          <MostAnticipatedSection />

          {/* Category Section */}
          <CategoryTab />

          {/* Genre Row */}
          <div className="mt-6 mb-8">
            <GenreRow />
          </div>

          {/* Show Grid */}
          <ShowGrid />
        </section>
      </main>
    </div>
  );
}
