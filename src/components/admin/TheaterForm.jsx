import { useState, useEffect } from "react";
import { post, patch, del, get } from "../../api";
import { useToast } from "../Toast";
import { FiMapPin, FiFileText, FiGrid, FiTrash2, FiSave, FiFilm } from "react-icons/fi";

const empty = {
  name: "",
  description: "",
  address: "",
  city: "",
  pincode: "",
  totalScreens: 1,
};

export default function TheaterForm({ theater, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [allMovies, setAllMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesReady, setMoviesReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(theater);

  useEffect(() => {
    if (theater) {
      setForm({
        name: theater.name || "",
        description: theater.description || "",
        address: theater.address || "",
        city: theater.city || "",
        pincode: theater.pincode ?? "",
        totalScreens: theater.totalScreens || 1,
      });
    } else {
      setForm(empty);
    }
  }, [theater]);

  useEffect(() => {
    if (!isEdit || !theater?._id) {
      setAllMovies([]);
      setSelectedMovies([]);
      setMoviesReady(false);
      return;
    }

    const loadMovies = async () => {
      try {
        setMoviesLoading(true);
        setMoviesReady(false);

        const [moviesRes, theaterMoviesRes] = await Promise.all([
          get("/api/movies"),
          get(`/api/theaters/${theater._id}/movies`),
        ]);

        const movieOptions = Array.isArray(moviesRes)
          ? moviesRes
          : moviesRes?.data || [];
        const theaterData = theaterMoviesRes?.data || theaterMoviesRes || {};
        const assignedMovies = Array.isArray(theaterData.movies)
          ? theaterData.movies
          : [];

        setAllMovies(movieOptions);
        setSelectedMovies(
          assignedMovies
            .map((movie) => (typeof movie === "string" ? movie : movie?._id))
            .filter(Boolean)
        );
        setMoviesReady(true);
      } catch (err) {
        setAllMovies([]);
        setSelectedMovies([]);
        toast(err.message || "Failed to load theater movies", "error");
      } finally {
        setMoviesLoading(false);
      }
    };

    loadMovies();
  }, [isEdit, theater?._id, toast]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const toggleMovie = (movieId) => {
    setSelectedMovies((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const body = {
      ...form,
      totalScreens: Number(form.totalScreens),
      pincode: form.pincode ? Number(form.pincode) : undefined,
    };
    try {
      if (isEdit) {
        await patch(`/api/theaters/${theater._id}`, body);

        if (moviesReady) {
          await patch(`/api/theaters/${theater._id}/movies`, {
            movieIds: selectedMovies,
          });
        }

        toast("Theater updated", "success");
      } else {
        await post("/api/theaters", body);
        toast("Theater created", "success");
      }
      onSaved?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!theater) return;
    if (!window.confirm("Delete this theater? This action cannot be undone.")) return;
    setBusy(true);
    try {
      await del(`/api/theaters/${theater._id}`);
      toast("Theater deleted", "success");
      onSaved?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-white text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none text-sm transition";
  const labelCls = "block text-sm font-semibold text-gray-800 mb-2";
  const helpCls = "mt-1 text-xs text-gray-500";

  const filledLocation = [form.city, form.pincode].filter(Boolean).join(" - ");
  const summaryName = form.name?.trim() || "Untitled theater";
  const summaryLocation = filledLocation || "Location not set";
  const summaryScreens = Number(form.totalScreens) > 0 ? Number(form.totalScreens) : 1;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-purple-100 bg-linear-to-r from-purple-50 to-blue-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
          {isEdit ? "Editing theater" : "New theater"}
        </p>
        <h3 className="mt-1 text-lg font-bold text-gray-900">{summaryName}</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/90 px-3 py-2 border border-purple-100">
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-semibold text-gray-800">{summaryLocation}</p>
          </div>
          <div className="rounded-xl bg-white/90 px-3 py-2 border border-purple-100">
            <p className="text-xs text-gray-500">Screens</p>
            <p className="text-sm font-semibold text-gray-800">{summaryScreens}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <label className={labelCls}>
            <span className="inline-flex items-center gap-2">
              <FiMapPin className="text-purple-600" />
              Theater Name
            </span>
          </label>
          <input
            placeholder="Ex: Grand Cinema Downtown"
            value={form.name}
            onChange={set("name")}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            <span className="inline-flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Description
            </span>
          </label>
          <textarea
            placeholder="Add a short description about this theater"
            value={form.description}
            onChange={set("description")}
            rows={3}
            className={inputCls}
          />
          <p className={helpCls}>Optional: amenities, highlights, or internal notes.</p>
        </div>

        <div>
          <label className={labelCls}>Address</label>
          <input
            placeholder="Street, area, landmark"
            value={form.address}
            onChange={set("address")}
            required
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>City</label>
            <input
              placeholder="City"
              value={form.city}
              onChange={set("city")}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input
              placeholder="Ex: 110001"
              type="number"
              value={form.pincode}
              onChange={set("pincode")}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              <span className="inline-flex items-center gap-2">
                <FiGrid className="text-indigo-600" />
                Total Screens
              </span>
            </label>
            <input
              placeholder="Ex: 4"
              type="number"
              min={1}
              value={form.totalScreens}
              onChange={set("totalScreens")}
              required
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {isEdit && (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 inline-flex items-center gap-2">
                <FiFilm className="text-purple-600" />
                Movies In This Theater
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Select movies to include in this theater lineup. Changes are saved when you click Update Theater.
              </p>
            </div>
            <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
              {selectedMovies.length} selected
            </span>
          </div>

          {moviesLoading ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              Loading available movies...
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-200 p-2 space-y-2 bg-gray-50/60">
              {allMovies.map((movie) => (
                <label
                  key={movie._id}
                  className="flex items-center gap-3 rounded-lg border border-transparent bg-white px-3 py-2 hover:border-purple-200 hover:bg-purple-50/40 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMovies.includes(movie._id)}
                    onChange={() => toggleMovie(movie._id)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{movie.name}</p>
                    <p className="text-xs text-gray-500">
                      {movie.language || "Language N/A"}
                      {movie.releaseStatus ? ` • ${movie.releaseStatus}` : ""}
                    </p>
                  </div>
                </label>
              ))}

              {!allMovies.length && (
                <p className="px-3 py-6 text-center text-sm text-gray-500">
                  No movies available to assign.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          disabled={busy}
          className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-sm transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <FiSave size={16} />
          {busy ? "Saving..." : isEdit ? "Update Theater" : "Create Theater"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm transition disabled:opacity-50 inline-flex items-center gap-2"
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
