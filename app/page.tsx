

import SearchBar from "./components/ui/SearchBar";
import SortBar from "./components/ui/SortBar";
import CategoryTab from "./components/ui/CategoryTab";
import ShowGrid from './components/layout/ShowGrid';
import Link from "next/link";
import { BookmarkIcon } from "lucide-react";

export default async function Home() {


  return (
    <div className="p-2.5 scroll-smooth">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 ml-4 mt-2 pl-2 md:pl-6">
          <img 
            src="/icon.png" 
            alt="Trark Logo" 
            className="h-6 w-6 object-contain"
          />
          <h2 className="text-2xl font-bold">Trark</h2>
        </div>
        <Link 
          href="/watchlist"
          className="mr-4 flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900/80 px-4 py-2 rounded-lg border border-zinc-800 transition-all duration-300 hover:border-zinc-700"
        >
          <BookmarkIcon size={20} className="text-zinc-400" />
          <span className="text-sm text-white">Watchlist</span>
        </Link>
      </div>
      <main>
        {/* Hero Section */}
        <header className="relative overflow-hidden max-w-300 mx-auto mt-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/10 group mb-4">
          <div className="absolute inset-0 z-0">
            <div className="bg-gradient-radial-top-right from-purple-500/40 via-blue-500/20 to-transparent opacity-50 w-full h-full animate-pulse"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between items-center p-8 md:p-12 min-h-50">
            <span className="inline-flex items-center self-start sm:self-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
              </span>
              Track Your Favorites
            </span>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Never Miss an Upcoming Release
            </h2>
            <p className="text-zinc-300 text-center max-w-2xl">
              Stay updated with all the shows you're excited about and never miss a premiere
            </p>
          </div>
        </header>

        {/* Show Section*/}
        <section className="max-w-300 mx-auto w-full mt-13 ">
          {/* Search Bar & Sort  */}
          <div className="flex mb-8 gap-2 sticky top-2 z-20 
          bg-(--color-background)/90 p-3 rounded-3xl">
            <div className="flex-2">
              <SearchBar />
            </div>
            <SortBar />
          </div>

          {/* Category Section */}
          <CategoryTab />

          {/* Show Grid */}
          <ShowGrid/>
          
        </section>
      </main>
    </div>
  );
}
