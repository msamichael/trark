import Image from "next/image";
import SearchBar from './components/SearchBar';
import SortBar from "./components/SortBar";
import CategoryTab from "./components/CategoryTab";

export default function Home() {
  return (
    <div className="p-2.5">
      <h2>CineTracker</h2>
      <main>

        {/* Hero Section */}
        <header className=" relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 group mb-2">
        <div className="absolute inset-0 z-0">
          <div className="bg-gradient-radial-top-right from-indigo-900/60 via-zinc-900/0 to-zinc-900/0 opacity-50 w-full h-full"> </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between items-center p-6 md:p-10 min-h-50">

          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            Track Your Favorites
          </span>
          <h2 className="text-3xl font-bold ">
            Never Miss an Upcoming Release
          </h2>
          <p className="text-zinc-400">Stay updated with all the shows you're excited about</p>
        </div>
          
        </header>
        
        {/* Show Grid */}
        <section>
          {/* Search Bar & Sort  */}
          <div className="flex mb-8 gap-2">
            <div className="flex-2">

              <SearchBar />
            </div>
              <SortBar/>
          </div>
          <CategoryTab/>
 
        </section>



      </main>
    </div>
  );
}
