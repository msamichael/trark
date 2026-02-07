import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Plus, Star, Timer } from "lucide-react";

import TrailerButton from "./../../components/ui/TrailerButton";
import TrailerModal from "@/app/components/layout/TrailerModal";
import { Separator } from "@/components/ui/separator";
import { BookmarkedShow } from "@/app/store/bookmarkSlice";
import BookmarkButton from "@/app/components/ui/BookmarkButton";
import { headers } from "next/headers";
import ImageFallback from "@/app/components/ui/ImageFallback";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const baseUrl =
    host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/tmdb/movie/${id}`);
  const data = await res.json();
  const movieData = data.movie;
  const creditsData = data.credits;
  const videoData = data.videos;

  const show: BookmarkedShow = {
    id: movieData.id as number,
    type: "movies",
  };


  if (!movieData || movieData.success === false) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-black">
        <h1 className="text-2xl font-bold">Data Fetching Failed</h1>
        <p className="text-zinc-400">Status Code: {res.status}</p>
        <pre className="mt-4 p-4 bg-zinc-900 rounded text-xs">
          {JSON.stringify(movieData, null, 2)}
        </pre>
      </div>
    );
  }

  const trailer = videoData.results?.find(
    (vid: any) => vid.site === "YouTube"  && (vid.type === "Trailer" || vid.type === "Teaser")
  );
  const hasNoTrailer = !trailer;
  
const trailerUrl = trailer 
  ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` 
  : undefined;

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCountdownDate = (date?: string) => {
    if (!date) return null;
    const releaseDate = new Date(date);
    const today = new Date();
    releaseDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = releaseDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatCountdown = (date?: string) => {
    const days = getCountdownDate(date);
    if (days === null) return "TBA";
    if (days < 0) return "Already Released";
    if (days === 0) return "Releases Today";
    if (days === 1) return "Releases Tomorrow";
    return `Releases in ${days} days`;
  };

  return (
    <div>
      <TrailerModal trailerUrl={trailerUrl} />

      {/* Backdrop image */}
      <div
        className="relative w-full h-fit overflow-hidden"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movieData?.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm" />

        <div className="relative flex flex-col md:flex-row gap-6 p-6 sm:p-10 mt-5 sm:mt-10 mb-4">
          {/* Movie Poster */}
          <div className="flex-shrink-0 border-2 border-background/80 rounded h-[300px] w-[200px] sm:h-[400px] sm:w-[270px] overflow-hidden mx-auto md:mx-0 relative">
            {movieData?.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                fill
                priority
                className="object-cover"
                alt={movieData?.title || "Movie Poster"}
              />
            ) : (
              <ImageFallback className="h-full w-full" label="No Poster" />
            )}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-tight text-center md:text-left">
              {movieData?.title}
            </h1>
            
            <div className="flex flex-col gap-3">
              {/*  countdown */}
              <p className="flex items-center justify-center md:justify-start gap-2 rounded-full border border-indigo-500/60
                bg-indigo-500/10 text-sm w-fit px-2 py-0.5 font-medium text-indigo-400 mx-auto md:mx-0">
                <Clock className="h-[15px] w-[15px]"/>
                {formatCountdown(movieData.release_date)}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                
                {movieData?.vote_average?.toFixed(1) > 0.0 ? (
                  <p className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-yellow-400" />
                    {movieData?.vote_average?.toFixed(1)}
                  </p>
                ) : null}
                <Separator orientation="vertical" className="h-4 bg-zinc-700 hidden sm:block" />

                <div className="flex gap-1">
                  <Timer size={18} />
                  <p className="text-zinc-300">
                    {movieData?.runtime?.[0] || "TBA"} min
                  </p>
                </div>
                <Separator
                  orientation="vertical"
                  className="h-4 bg-zinc-700 hidden sm:block"
                />
                <div className="flex gap-1">
                  <CalendarDays size={18} />
                  <p className="text-zinc-300">
                    {formatDate(movieData?.release_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {movieData?.genres?.map((genre: any) => (
                <p key={genre.id} className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-100">
                  {genre.name}
                </p>
              ))}
            </div>

            <p className="text-zinc-300 italic text-lg text-center md:text-left">{movieData?.tagline}</p>

              {/* Buttons */}
            <div className="flex gap-3 mt-4 justify-center md:justify-start">
              <TrailerButton />
              <BookmarkButton show={show} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-1">Status</h3>
            <p className="text-zinc-400 text-sm">{movieData?.status}</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Budget</h3>
           <p className="text-zinc-400 text-sm">
              {movieData?.budget > 0 ? `$${movieData.budget.toLocaleString()}` : "Not Disclosed"}
            </p>    
             </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Production</h3>
            {movieData?.production_companies?.map((co: any) => (
              <p key={co.id} className="text-zinc-400 text-sm">{co.name}</p>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">{movieData?.overview}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:flex md:flex-wrap md:gap-6 md:overflow-x-auto md:pb-4">
              {creditsData?.cast?.slice(0, 10).map((actor: any) => (
                <div key={actor.id} className="flex-shrink-0 w-full sm:w-[100px] text-center space-y-2">
                  <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-2 border-zinc-800 mx-auto">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        width={90}
                        height={90}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageFallback
                        variant="avatar"
                        className="w-full h-full"
                        label="No Photo"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-white line-clamp-1">{actor.name}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
