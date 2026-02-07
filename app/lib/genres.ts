export type Category = "movies" | "series" | "anime";

export type GenreDef = {
  slug: string;
  label: string;
  tmdbId?: number;
  jikanId?: number;
  kdrama?: boolean;
};

export const MOVIE_GENRES: GenreDef[] = [
  { slug: "kdrama", label: "K-Drama", kdrama: true },
  { slug: "action", label: "Action", tmdbId: 28 },
  { slug: "adventure", label: "Adventure", tmdbId: 12 },
  { slug: "animation", label: "Animation", tmdbId: 16 },
  { slug: "comedy", label: "Comedy", tmdbId: 35 },
  { slug: "crime", label: "Crime", tmdbId: 80 },
  { slug: "drama", label: "Drama", tmdbId: 18 },
  { slug: "fantasy", label: "Fantasy", tmdbId: 14 },
  { slug: "horror", label: "Horror", tmdbId: 27 },
  { slug: "mystery", label: "Mystery", tmdbId: 9648 },
  { slug: "romance", label: "Romance", tmdbId: 10749 },
  { slug: "sci-fi", label: "Sci-Fi", tmdbId: 878 },
  { slug: "thriller", label: "Thriller", tmdbId: 53 }
];

export const SERIES_GENRES: GenreDef[] = [
  { slug: "kdrama", label: "K-Drama", kdrama: true },
  { slug: "action-adventure", label: "Action & Adventure", tmdbId: 10759 },
  { slug: "animation", label: "Animation", tmdbId: 16 },
  { slug: "comedy", label: "Comedy", tmdbId: 35 },
  { slug: "crime", label: "Crime", tmdbId: 80 },
  { slug: "documentary", label: "Documentary", tmdbId: 99 },
  { slug: "drama", label: "Drama", tmdbId: 18 },
  { slug: "family", label: "Family", tmdbId: 10751 },
  { slug: "mystery", label: "Mystery", tmdbId: 9648 },
  { slug: "reality", label: "Reality", tmdbId: 10764 },
  { slug: "sci-fi-fantasy", label: "Sci-Fi & Fantasy", tmdbId: 10765 },
  { slug: "war-politics", label: "War & Politics", tmdbId: 10768 }
];

export const ANIME_GENRES: GenreDef[] = [
  { slug: "action", label: "Action", jikanId: 1 },
  { slug: "adventure", label: "Adventure", jikanId: 2 },
  { slug: "comedy", label: "Comedy", jikanId: 4 },
  { slug: "mystery", label: "Mystery", jikanId: 7 },
  { slug: "drama", label: "Drama", jikanId: 8 },
  { slug: "fantasy", label: "Fantasy", jikanId: 10 },
  { slug: "horror", label: "Horror", jikanId: 14 },
  { slug: "romance", label: "Romance", jikanId: 22 },
  { slug: "sci-fi", label: "Sci-Fi", jikanId: 24 },
  { slug: "slice-of-life", label: "Slice of Life", jikanId: 36 },
  { slug: "thriller", label: "Thriller", jikanId: 41 }
];

export function getGenresForCategory(category: Category): GenreDef[] {
  if (category === "movies") return MOVIE_GENRES;
  if (category === "series") return SERIES_GENRES;
  return ANIME_GENRES;
}

export function getGenreLabel(category: Category, slug: string): string | null {
  const genre = getGenresForCategory(category).find((g) => g.slug === slug);
  return genre?.label ?? null;
}

export function getGenreDef(category: Category, slug: string): GenreDef | null {
  const genre = getGenresForCategory(category).find((g) => g.slug === slug);
  return genre ?? null;
}

export function getCategoryLabel(category: Category): string {
  if (category === "movies") return "Movies";
  if (category === "series") return "Series";
  return "Anime";
}
