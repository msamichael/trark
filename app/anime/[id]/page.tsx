import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Star } from "lucide-react";

import TrailerButton from "./../../components/ui/TrailerButton";
import TrailerModal from "@/app/components/layout/TrailerModal";
import { Separator } from "@/components/ui/separator";

type AnimePageProps = {
  params:  Promise<{ id: string }> ;
};

export default async function AnimePage({ params }: AnimePageProps) {
  const { id } = await params;


  const [animeRes, castRes] = await Promise.all([
    fetch(`https://api.jikan.moe/v4/anime/${id}`),
fetch(`https://api.jikan.moe/v4/anime/${id}/characters`)
  ]);

  const result = await animeRes.json();
  const castResult = await castRes.json();
  const castData = castResult.data;
  const animeData = result.data;
  const trailerUrl = animeData?.trailer?.embed_url;

  interface BaseResource {
    mal_id: number;
    name: string;
  }

  type CastMember = {
    id: number;
    name: string;
    character: string;
    imageUrl: string;
  };

  type Studio = BaseResource;
  type Theme = BaseResource;
  type Genre = BaseResource;

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBA";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };


  const getCountdownDate = (date?: string) => {
    if (!date) return null;

    const releaseDate = new Date(date);
    if (isNaN(releaseDate.getTime())) return null;
    const today = new Date();

    releaseDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = releaseDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const formatCountdown = (date?: string) => {
    const days = getCountdownDate(date);

    if (days == null) return "TBA";
    if (days < 0) return "Already Released";
    if (days === 0) return "Airs Today";
    if (days === 1) return "Airs Tomorrow";
    return `Airs in ${days} days`;
  };
  
  return (
    <div>
      <TrailerModal trailerUrl={trailerUrl} />

      {/* Backdrop image */}
      <div
        className="relative w-full h-fit overflow-hidden"
        style={{
          backgroundImage: `url(${animeData?.images?.webp?.large_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm" />
          {/* Hero Section Layout */}
        <div className="relative flex flex-col md:flex-row gap-6 p-6 sm:p-10 mt-5 sm:mt-10 mb-4">
          {/* Anime Poster */}
          <div className="flex-shrink-0 border-2 border-background/80 rounded h-[300px] w-[200px] sm:h-[400px] sm:w-[270px] overflow-hidden mx-auto md:mx-0 relative">
            <Image
              src={animeData?.images?.webp?.large_image_url}
              fill
              priority
              className="object-cover"
              alt={"The Show's Image"}
            />
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-tight text-center md:text-left">
              {animeData?.title}
            </h1>
            
            <div className="flex flex-col gap-3">
              {/* Countdown  */}
              <p className="flex items-center justify-center md:justify-start gap-2 rounded-full border border-indigo-500/60
                bg-indigo-500/10 text-sm w-fit px-2 py-0.5 font-medium text-indigo-400 mx-auto md:mx-0">
                <Clock className="h-[15px] w-[15px]"/>
                {formatCountdown(animeData.aired.from)}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                <p className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  {animeData?.score?.toFixed(1)}
                </p>
                <Separator orientation="vertical" className="h-4 bg-zinc-700 hidden sm:block" />
                <p className="text-zinc-300">{animeData?.duration}</p>
                <Separator orientation="vertical" className="h-4 bg-zinc-700 hidden sm:block" />
                <p className="text-zinc-300">{formatDate(animeData.aired.from)}</p>
              </div>
            </div>

            {/* Genre */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {animeData?.genres?.map((genre: Genre) => (
                <p
                  key={genre.mal_id}
                  className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-100"
                >
                  {genre.name}
                </p>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4 justify-center md:justify-start">
              <TrailerButton />
              <Button className="bg-white text-black hover:bg-zinc-200 hover:cursor-pointer border-none font-semibold ">
                <Plus className="h-5 w-5" /> Add to WatchList
              </Button>
            </div>
          </div>
        </div>
      </div>
        {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-1">Status</h3>
            <p className="text-zinc-400 text-sm">{animeData?.status}</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Type</h3>
            <p className="text-zinc-400 text-sm">{animeData?.type}</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Studios</h3>
            {animeData?.studios?.map((studio: Studio) => (
              <p key={studio.mal_id} className="text-zinc-400 text-sm">{studio.name}</p>
            ))}
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Themes</h3>
            {animeData?.themes?.map((theme: Theme) => (
              <p key={theme.mal_id} className="text-zinc-400 text-sm">{theme.name}</p>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">{animeData.synopsis}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:flex md:flex-wrap md:gap-6 md:overflow-x-auto md:pb-4">
              {castData?.slice(0, 10).map((cast: any) => (
                <div key={cast.character.mal_id} className="flex-shrink-0 w-full sm:w-[100px] text-center space-y-2">
                  <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-2 border-zinc-800 mx-auto">
                    <Image
                      src={cast.character.images.webp.image_url}
                      alt={"Cast members"}
                      width={90}
                      height={90}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <p className="text-sm font-medium text-white line-clamp-1">{cast.character.name}</p>
                  {cast.voice_actors[0] && (
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {cast.voice_actors[0].person.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
