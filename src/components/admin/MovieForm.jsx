import { useState, useEffect } from "react";
import { post, put, del } from "../../api";
import { useToast } from "../Toast";
import { FiTrash2, FiSave } from "react-icons/fi";

const STATUSES = ["RELEASED", "COMING_SOON", "BLOCKED"];
const CERTIFICATES = ["U", "UA", "A", "S"];
const empty = {
  name: "",
  description: "",
  cast: "",
  trailerUrl: "",
  language: "",
  releaseDate: "",
  director: "",
  releaseStatus: "RELEASED",
  poster: "",
  genres: "",
  certificate: "UA",
};

export default function MovieForm({ movie, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(movie);

  useEffect(() => {
    if (movie) {
      setForm({
        name: movie.name || "",
        description: movie.description || "",
        cast: Array.isArray(movie.cast)
          ? movie.cast.join(", ")
          : movie.cast || "",
        trailerUrl: movie.trailerUrl || "",
        language: movie.language || "",
        releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
        director: movie.director || "",
        releaseStatus: movie.releaseStatus || "RELEASED",
        poster: movie.poster || "",
        genres: Array.isArray(movie.genres)
          ? movie.genres.join(", ")
          : movie.genres || "",
        certificate: movie.certificate || "UA",
      });
    } else {
      setForm(empty);
    }
  }, [movie]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const body = {
      ...form,
      cast: form.cast
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      genres: form.genres
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (isEdit) {
        await put(`/api/movies/${movie._id}`, body);
        toast("Movie updated", "success");
      } else {
        await post("/api/movies", body);
        toast("Movie created", "success");
      }
      onSaved?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!movie) return;
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    setBusy(true);
    try {
      await del(`/api/movies/${movie._id}`);
      toast("Movie deleted", "success");
      onSaved?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition text-sm placeholder-gray-500";

  const selectCls =
    "w-full px-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition text-sm";

  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelCls}>Movie Name *</label>
        <input
          placeholder="Enter movie name"
          value={form.name}
          onChange={set("name")}
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          placeholder="Enter detailed movie description"
          value={form.description}
          onChange={set("description")}
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className={labelCls}>Cast (comma-separated)</label>
        <input
          placeholder="e.g., Actor 1, Actor 2, Actor 3"
          value={form.cast}
          onChange={set("cast")}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Director</label>
          <input
            placeholder="Enter director name"
            value={form.director}
            onChange={set("director")}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Language</label>
          <input
            placeholder="e.g., English, Hindi, Tamil"
            value={form.language}
            onChange={set("language")}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Release Date</label>
          <input
            type="date"
            value={form.releaseDate}
            onChange={set("releaseDate")}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Release Status</label>
          <select
            value={form.releaseStatus}
            onChange={set("releaseStatus")}
            className={selectCls}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Genres (comma-separated)</label>
          <input
            placeholder="e.g., Action, Drama, Comedy"
            value={form.genres}
            onChange={set("genres")}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Certificate</label>
          <select
            value={form.certificate}
            onChange={set("certificate")}
            className={selectCls}
          >
            {CERTIFICATES.map((c) => (
              <option key={c} value={c}>
                {c === "U" && "U - Unrestricted"}
                {c === "UA" && "UA - Parental Discretion"}
                {c === "A" && "A - Restricted to Adults"}
                {c === "S" && "S - Specialized Audience"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Poster URL</label>
        <input
          placeholder="https://example.com/poster.jpg"
          value={form.poster}
          onChange={set("poster")}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Trailer URL</label>
        <input
          placeholder="https://youtube.com/watch?v=..."
          value={form.trailerUrl}
          onChange={set("trailerUrl")}
          className={inputCls}
        />
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave size={18} />
          {busy ? "Saving..." : isEdit ? "Update Movie" : "Create Movie"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 size={18} />
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
