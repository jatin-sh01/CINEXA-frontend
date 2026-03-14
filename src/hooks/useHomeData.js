import { useMemo } from "react";
import { get } from "../api";
import useFetch from "./useFetch";
import { normalizeMovie, normalizeHero } from "../api/normalize";


export default function useHomeData() {
  const { data, loading, error } = useFetch(() => get("/api/movies"), []);

  return useMemo(() => {
    const raw = data?.data || [];

    if (!raw.length) {
      return {
        hero: [],
        nowShowing: [],
        upcoming: [],
        sections: [],
        languages: [],
        genres: [],
        loading,
        error,
      };
    }

    const released = raw.filter((m) => m.releaseStatus === "RELEASED");
    const coming = raw.filter((m) => m.releaseStatus === "COMING_SOON");

    const hero = released.slice(0, 5).map(normalizeHero);
    const nowShowing = released.map(normalizeMovie);
    const upcoming = coming.map(normalizeMovie);

    
    const sections = [];
    if (nowShowing.length)
      sections.push({ title: "This Week's Releases", movies: nowShowing });
    if (upcoming.length)
      sections.push({ title: "Coming Soon", movies: upcoming });

    
    const langSet = new Set();
    const genreSet = new Set();
    raw.forEach((m) => {
      if (m.language) langSet.add(m.language);
      if (Array.isArray(m.genre)) m.genre.forEach((g) => genreSet.add(g));
    });

    return {
      hero,
      nowShowing,
      upcoming,
      sections,
      languages: [...langSet].sort(),
      genres: [...genreSet].sort(),
      loading,
      error,
    };
  }, [data, loading, error]);
}
