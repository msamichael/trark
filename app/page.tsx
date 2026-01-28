

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
        <h2 className="text-2xl ml-4 mt-2 font-bold">Trark</h2>
        <Link 
          href="/watchlist"
          className="mr-4 flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900/80 px-4 py-2 rounded-lg border border-zinc-800 transition-all"
        >
          <BookmarkIcon size={20} />
          <span className="text-sm">Watchlist</span>
        </Link>
      </div>
      <main>
        {/* Hero Section */}
        <header className=" relative overflow-hidden max-w-300 mx-auto mt-5 rounded-2xl border-2 md:border border-zinc-800 bg-zinc-900/30 group mb-2">
          <div className="absolute inset-0 z-0">
            <div className="bg-gradient-radial-top-right from-indigo-900/60 via-zinc-900/0 to-zinc-900/0 opacity-50 w-full h-full">
              {" "}
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between items-center p-6 md:p-10 min-h-50">
            <span className="inline-flex items-center self-start sm:self-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
              </span>
              Track Your Favorites
            </span>
            <h2 className="text-3xl font-bold ">
              Never Miss an Upcoming Release
            </h2>
            <p className="text-zinc-400">
              Stay updated with all the shows you're excited about
            </p>
          </div>
        </header>

        {/* Show Section*/}
        <section className="max-w-300 mx-auto w-full mt-13 ">
          {/* Search Bar & Sort  */}
          <div className="flex mb-8 gap-2 sticky top-2 z-10 
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
