import { notFound } from "next/navigation";
import Link from "next/link";
import GenreGrid from "@/app/components/layout/GenreGrid";
import {
  getCategoryLabel,
  getGenreLabel,
  type Category
} from "@/app/lib/genres";

type GenrePageProps = {
  params: Promise<{ category: Category; slug: string }>;
};

export default async function GenrePage({ params }: GenrePageProps) {
  const { category, slug } = await params;
  const genreLabel = getGenreLabel(category, slug);

  if (!genreLabel) {
    notFound();
  }

  const heading = `${genreLabel} ${getCategoryLabel(category)}`;

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{heading}</h1>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Back
          </Link>
        </div>
        <p className="text-sm text-zinc-500 mt-1">
          Top upcoming {genreLabel} {getCategoryLabel(category)}
        </p>
        <GenreGrid category={category} slug={slug} />
      </div>
    </div>
  );
}
