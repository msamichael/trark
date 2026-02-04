import SearchBar from "./components/ui/SearchBar";
import SortBar from "./components/ui/SortBar";
import CategoryTab from "./components/ui/CategoryTab";
import ShowGrid from "./components/layout/ShowGrid";
import HeroCarousel from "./components/layout/HeroCarousel";
import MostAnticipatedSection from "./components/layout/MostAnticipatedSection";
import Link from "next/link";
import { BookmarkIcon, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="p-2.5 scroll-smooth">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center self-start gap-3 ml-4 mt-2 pl-2 md:pl-6">
          <img
            src="/icon.png"
            alt="Trark Logo"
            className="h-6 w-6 object-contain"
          />
          <h2 className="text-2xl font-bold">Trark</h2>
        </div>
        <div className="flex justify-end gap-x-4">
          <button className="flex items-center gap-2 cursor-pointer bg-zinc-900/50 hover:bg-zinc-900/80 px-4 py-2 rounded-lg border border-zinc-800 transition-all duration-300 hover:border-zinc-700">
            <LogIn size={20} className="text-zinc-400" />
            <span className="text-sm text-white">Login</span>
          </button>
          <Link
            href="/watchlist"
            className="mr-4 flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900/80 px-4 py-2 rounded-lg border border-zinc-800 transition-all duration-300 hover:border-zinc-700"
          >
            <BookmarkIcon size={20} className="text-zinc-400" />
            <span className="text-sm text-white">Watchlist</span>
          </Link>
        </div>
      </div>
      <main>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Show Section*/}
        <section className="max-w-300 mx-auto w-full mt-13 ">
          {/* Search Bar & Sort  */}
          <div
            className="flex mb-8 gap-2 sticky top-2 z-20 
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

          {/* Show Grid */}
          <ShowGrid />
        </section>
      </main>
    </div>
  );
}
