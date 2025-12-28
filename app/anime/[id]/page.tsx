import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

  return (
    <div>
      {/* Trailer Modal */}
      <TrailerModal trailerUrl={trailerUrl} />

      {/* Backdrop image */}
      <div
        className="relative w-full h-[400px] overflow-hidden rounded-xl"
        style={{
          backgroundImage: `url(${animeData?.images?.webp?.large_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      >
        {/*Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className=" relative flex gap-8 p-16">
          {/* Show Image */}
          <div className="border-3 border-background/80 rounded">
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

          <div className="flex flex-col gap-6">
            {/* Anime Title */}
            <h1 className="text-4xl font-bold text-white mb-4">
              {animeData?.title}
            </h1>

            {/* Show Rating */}
            <p>{animeData?.rating}</p>

            {/* Genre */}
            <div className=" flex gap-2">
              {animeData?.genres?.map((genre: Genre) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full border border-zinc-400 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <TrailerButton />
              <Button className="bg-black/90  w-fit border-zinc-300 border cursor-pointer">
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
              <p className="text-zinc-400">Studio</p>
              {animeData?.studios?.map((studio: Studio) => (
                <p key={studio.mal_id} className="text-white">
                  {studio.name}
                </p>
              ))}
            </div>
            {/* Theme */}
            <div>
              {animeData?.themes?.length > 0 && (
                <>
                  <Separator className="mb-2" />
                  <p className="text-zinc-400">Theme</p>
                </>
              )}
              {animeData?.themes?.map((theme: Theme) => (
                <p key={theme.mal_id}>{theme.name}</p>
              ))}
            </div>
          </div>
          <div>
            {/* Storyline */}
            <p className="mb-2">Sypnosis</p>
            <p className="text-zinc-400 ">{animeData.synopsis}</p>

              {/* Cast Members */}
              <p className="mt-6 mb-2">Cast</p>
            <div className="flex gap-3 gap-x-6  flex-wrap">
              {castData?.map((cast: any) => (
                <div
                  key={cast.character.mal_id}
                  className="flex flex-col items-start gap-2 max-w-[100px]"
                >
                  <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-2 border-neutral-800 shadow-sm">
                    <Image
                      src={cast.character.images.webp.image_url}
                      alt={"Cast member's"}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <p className="text-sm">{cast.character.name}</p>
                  {cast.voice_actors[0] && (
                    <p className="text-[12px] text-zinc-400 line-clamp-1">
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
