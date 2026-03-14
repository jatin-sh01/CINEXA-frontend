






export function normalizeMovie(raw) {
  return {
    id: raw._id || raw.id,
    title: raw.name || raw.title,
    posterUrl: raw.poster || raw.posterUrl || "",
    language: raw.language || "",
    certificate: raw.certification || raw.certificate || raw.rating || "",
    badges: raw.badges ?? [],
    releaseDate: raw.releaseDate || "",
    releaseStatus: raw.releaseStatus || "",
  };
}


export function normalizeHero(raw) {
  const genres = Array.isArray(raw.genre)
    ? raw.genre
    : typeof raw.genre === "string" && raw.genre
      ? raw.genre.split(",").map((g) => g.trim())
      : Array.isArray(raw.genres)
        ? raw.genres
        : [];

  return {
    id: raw._id || raw.id,
    title: raw.name || raw.title,
    certificate: raw.certification || raw.certificate || raw.rating || "",
    genres,
    posterUrl: raw.poster || raw.posterUrl || "",
    backdropUrl:
      raw.backdrop || raw.backdropUrl || raw.poster || raw.posterUrl || "",
    cta: { label: "Book now", href: `/movies/${raw._id || raw.id}` },
  };
}
