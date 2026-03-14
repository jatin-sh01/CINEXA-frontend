import { useState, useEffect } from "react";
import { get, patch } from "../../api";
import { useToast } from "../Toast";
import Spinner from "../shared/Spinner";

export default function TheaterMoviesManager({ theaterId, onClose }) {
  const toast = useToast();
  const [allMovies, setAllMovies] = useState([]);
  const [theater, setTheater] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const moviesRes = await get("/api/movies");
        setAllMovies(moviesRes.data || []);

        
        const theaterRes = await get(`/api/theaters/${theaterId}/movies`);
        setTheater(theaterRes.data);
        setSelectedMovies((theaterRes.data.movies || []).map((m) => m._id));
      } catch (err) {
        toast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [theaterId, toast]);

  const toggleMovie = (movieId) => {
    setSelectedMovies((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await patch(`/api/theaters/${theaterId}/movies`, {
        movieIds: selectedMovies,
      });
      toast("Movies updated successfully", "success");
      onClose?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-semibold mb-3">
          Select movies for {theater?.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {selectedMovies.length} movie(s) selected
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg max-h-96 overflow-y-auto space-y-2 p-3">
        {allMovies.map((movie) => (
          <label
            key={movie._id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
          >
            <input
              type="checkbox"
              checked={selectedMovies.includes(movie._id)}
              onChange={() => toggleMovie(movie._id)}
              className="w-4 h-4 rounded border-gray-600 text-purple-500 cursor-pointer"
            />
            <div>
              <div className="text-white text-sm font-medium">{movie.name}</div>
              <div className="text-gray-400 text-xs">
                {movie.language} • {movie.releaseStatus}
              </div>
            </div>
          </label>
        ))}
        {!allMovies.length && (
          <div className="text-gray-500 text-center py-8">No movies found</div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
