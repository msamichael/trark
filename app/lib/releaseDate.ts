const ISO_DATE_PATTERN = /\d{4}-\d{2}-\d{2}/;

type ReleaseDateSource = {
  upcoming_air_date?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  aired?: {
    from?: string | null;
    string?: string | null;
  } | null;
};

export function extractIsoDate(value?: string | null) {
  if (!value) return null;
  const match = value.match(ISO_DATE_PATTERN);
  return match ? match[0] : null;
}

export function getShowReleaseDate(show: ReleaseDateSource) {
  return (
    show.upcoming_air_date ||
    show.release_date ||
    show.first_air_date ||
    show.aired?.from ||
    extractIsoDate(show.aired?.string) ||
    "TBA"
  );
}

export function formatReleaseDate(dateString?: string | null) {
  if (!dateString || dateString === "TBA" || dateString === "Unknown") {
    return dateString || "TBA";
  }

  const normalizedDate = extractIsoDate(dateString) || dateString;
  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return "TBA";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
