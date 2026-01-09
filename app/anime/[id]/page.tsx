import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";

import TrailerButton from "./../../components/ui/TrailerButton";
import TrailerModal from "@/app/components/layout/TrailerModal";
import { Separator } from "@/components/ui/separator";

type AnimePageProps = {
  params: { id: Promise<{ id: string }> };
};

export default async function AnimePage({ params }: AnimePageProps) {
  const { id } = await params;

  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

  const castResponse = await fetch(
    `https://api.jikan.moe/v4/anime/${id}/characters`
  );

  const result = await res.json();
  const castResult = await castResponse.json();
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
      {/* Trailer Modal */}
      <TrailerModal trailerUrl={trailerUrl} />

      {/* Backdrop image */}
      <div
        className="relative w-full h-[400px] overflow-hidden "
        style={{
          backgroundImage: `url(${animeData?.images?.webp?.large_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 95%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 95%, transparent 100%)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        {/*Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className=" relative flex gap-8 p-10">
          {/* Show Image */}
          <div className="border-2 border-background/80 rounded  h-[170px] sm:h-[300px] w-[130px] sm:w-[230px]">
            <Image
              src={animeData?.images?.webp?.large_image_url}
              width={230}
              height={300}
              loading="lazy"
              className="object-cover rounded
              h-[170px] sm:h-[300px] w-[130px] sm:w-[230px]"
              alt={"The Show's Image"}
            />
          </div>

          <div className="flex flex-col gap-4.5">
            {/* Anime Title */}
            <h1 className="text-4xl font-bold text-white ">
              {animeData?.title}
            </h1>
            <div className="flex flex-col gap-4.5">
              {/* Countdown  */}
              <p className=" flex items-center justify-start gap-2 rounded-full border border-indigo-500/60
               bg-indigo-500/10 text-sm w-fit
              px-2 py-0.5 font-medium text-indigo-400">
                <Clock className="h-[15px]"/>
                {formatCountdown(animeData.aired.from)}
              </p>

              {/* Release date */}
              <p className="text-white">
                Release Date: {formatDate(animeData.aired.from)}
              </p>
            </div>

            {/* Show Rating */}
            <p className="text-sm text-zinc-300">Rating: {animeData?.rating}</p>
            {/* Broadcast time */}

            <p className="text-sm text-zinc-100">
              Broadcast: {animeData?.broadcast.string}
            </p>

            {/* Genre */}
            <div className=" flex gap-2">
              {animeData?.genres?.map((genre: Genre) => (
                <p
                  key={genre.mal_id}
                  className="rounded-full border border-zinc-400
                   bg-zinc-900/50 px-3 py-1 text-xs text-zinc-100"
                >
                  {genre.name}
                </p>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex z-30 gap-3">
              <TrailerButton />
              <Button
                className="bg-black/90  w-fit border-zinc-300 border 
              cursor-pointer"
              >
                
                <Plus />
                Add to Bookmark
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div>
        <div className="flex flex-col sm:flex-row  gap-8 p-16 ">
          <div className=" w-[230px] text-sm flex flex-col gap-3 ">
            {/* Studio name */}
            <div>
              {animeData?.studios?.length > 0 && (
                <p className="text-white">Studio</p>
              )}
              {animeData?.studios?.map((studio: Studio) => (
                <p key={studio.mal_id} className="text-zinc-400">
                  {studio.name}
                </p>
              ))}
            </div>
            {animeData?.studios?.length > 0 && animeData?.themes?.length > 0 ? (
              <Separator className="w-fit " />
            ) : (
              ""
            )}
            {/* Theme */}
            <div>
              {animeData?.themes?.length > 0 && (
                <p className="text-white">Theme</p>
              )}
              {animeData?.themes?.map((theme: Theme) => (
                <p key={theme.mal_id} className="text-zinc-400">
                  {theme.name}
                </p>
              ))}
            </div>
          </div>
          <div>
            {/* Storyline */}
            <p className="mb-2">Sypnosis</p>
            <p className="text-zinc-400 ">{animeData.synopsis}</p>

            {/* Cast Members */}
            {castData.length > 0 && <p className="mt-6 mb-2">Cast</p>}
            <div className="flex gap-3 gap-x-6  flex-wrap">
              {castData?.map((cast: any) => (
                <div
                  key={cast.character.mal_id}
                  className="flex flex-col items-start gap-2 max-w-[100px]"
                >
                  <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-2 border-neutral-800 shadow-sm">
                    <Image
                      src={cast.character.images.webp.image_url}
                      alt={"Cast members"}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <p className="text-sm">{cast.character.name}</p>
                  {cast.voice_actors[0] && (
                    <p className="text-[12px] text-zinc-400 line-clamp-2">
                      {cast.voice_actors[0].person.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
