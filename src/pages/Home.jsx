import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useHomeData from "../hooks/useHomeData";
import HeroBanner from "../components/HeroSlider";
import MovieRow from "../components/MovieRow";
import Filters from "../components/Filters";
import Spinner from "../components/shared/Spinner";

export default function Home() {
  const navigate = useNavigate();
  const { hero, sections, languages, genres, loading } = useHomeData();

  const [selected, setSelected] = useState({ languages: [], genres: [] });

  const handleToggle = useCallback((type, value) => {
    setSelected((prev) => {
      const list = prev[type];
      return {
        ...prev,
        [type]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  }, []);

  const filteredSections = useMemo(() => {
    const hasFilters = selected.languages.length || selected.genres.length;
    if (!hasFilters) return sections;

    return sections
      .map((s) => ({
        ...s,
        movies: s.movies.filter((m) => {
          const langOk =
            !selected.languages.length ||
            selected.languages.includes(m.language);
          const genreOk = !selected.genres.length;
          return langOk && genreOk;
        }),
      }))
      .filter((s) => s.movies.length > 0);
  }, [sections, selected]);

  const handleCardClick = useCallback(
    (id) => navigate(`/movies/${id}`),
    [navigate],
  );

  if (loading) return <Spinner />;

  return (
    <div className="bg-white min-h-screen">
      <HeroBanner items={hero} />

      <Filters
        languages={languages}
        genres={genres}
        selected={selected}
        onToggle={handleToggle}
      />

      {filteredSections.map((section) => (
        <MovieRow
          key={section.title}
          title={section.title}
          movies={section.movies}
          layout="grid"
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  );
}
