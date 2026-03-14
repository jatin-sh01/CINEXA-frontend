import { useEffect, useState } from "react";
import { get } from "../../api";
import { useToast } from "../Toast";
import MovieCard from "../MovieCard";
import Spinner from "../shared/Spinner";
import { FiFilm } from "react-icons/fi";

export default function TheaterMoviesList({ theaterId, onMovieClick }) {
  const toast = useToast();
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    get(`/api/theaters/${theaterId}/movies`)
      .then((tRes) => {
        setTheater(tRes.data);
      })
      .catch((e) => toast(e.message, "error"))
      .finally(() => setLoading(false));
  }, [theaterId, toast]);

  if (loading) return <Spinner />;
  const moviesList = theater?.movies || [];

  const handleMovieClick = (movieId) => {
    if (onMovieClick) {
      onMovieClick(movieId);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FiFilm className="text-purple-600" size={28} />
        Movies Playing
      </h2>
      {moviesList.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {moviesList.map((m) => (
            <div 
              key={m._id || m} 
              onClick={() => handleMovieClick(m._id || m)}
              className="cursor-pointer"
            >
              <MovieCard 
                movie={typeof m === "string" ? { _id: m, name: m } : m} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600 font-medium">No movies assigned to this theater yet</p>
        </div>
      )}
    </div>
  );
}