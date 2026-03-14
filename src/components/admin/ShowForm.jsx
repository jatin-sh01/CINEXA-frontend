import { useState, useEffect, useMemo } from "react";
import { post, patch, del, get } from "../../api";
import { useToast } from "../Toast";
import useFetch from "../../hooks/useFetch";
import {
  FiClock,
  FiUsers,
  FiDollarSign,
  FiLayout,
  FiFilm,
  FiMapPin,
  FiTrash2,
  FiCalendar,
} from "react-icons/fi";

const empty = {
  theaterId: "",
  movieId: "",
  showDate: "",
  showTime: "",
  noOfSeats: "",
  price: "",
  seatConfiguration: "",
  format: "",
};

const toLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const toLocalTime = (date) => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const parseDateAndTime = (timing) => {
  if (!timing) {
    const now = new Date();
    return { showDate: toLocalDate(now), showTime: "" };
  }

  const parsed = new Date(timing);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      showDate: toLocalDate(parsed),
      showTime: toLocalTime(parsed),
    };
  }

  const fallbackDate = toLocalDate(new Date());
  const match = String(timing).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match) {
    return { showDate: fallbackDate, showTime: "" };
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = (match[3] || "").toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return {
    showDate: fallbackDate,
    showTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
};

export default function ShowForm({ show, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(show);

  
  const getTheaters = useMemo(() => () => get("/api/theaters"), []);
  const getMovies = useMemo(() => () => get("/api/movies"), []);

  const { data: theatersRes } = useFetch(getTheaters, []);
  const { data: moviesRes } = useFetch(getMovies, []);
  const theaters = theatersRes?.data || [];
  const movies = moviesRes?.data || [];

  useEffect(() => {
    if (show) {
      const { showDate, showTime } = parseDateAndTime(show?.timing);

      setForm({
        theaterId: (show?.theaterId && typeof show.theaterId === "object" ? show.theaterId._id : show?.theaterId) || "",
        movieId: (show?.movieId && typeof show.movieId === "object" ? show.movieId._id : show?.movieId) || "",
        showDate,
        showTime,
        noOfSeats: show?.noOfSeats || "",
        price: show?.price ?? "",
        seatConfiguration: show?.seatConfiguration || "",
        format: show?.format || "",
      });
    } else {
      setForm(empty);
    }
  }, [show]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    const dateTimeValue = form.showDate && form.showTime
      ? `${form.showDate}T${form.showTime}`
      : "";
    const parsedDate = dateTimeValue ? new Date(dateTimeValue) : null;
    const timing = parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : "";

    if (!timing) {
      toast("Please select a valid show date and time", "error");
      setBusy(false);
      return;
    }

    const body = {
      ...form,
      timing,
      price: Number(form.price),
    };

    try {
      if (isEdit) {
        const { theaterId: _t, movieId: _m, showDate: _d, showTime: _st, ...patchBody } = body;
        await patch(`/api/show/${show._id}`, patchBody);
        toast("Show updated", "success");
      } else {
        const { showDate: _d, showTime: _st, ...createBody } = body;
        await post("/api/show", createBody);
        toast("Show created", "success");
      }
      onSaved?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!show) return;
    if (!window.confirm("Are you sure you want to delete this show?")) return;
    setBusy(true);
    try {
      const showId = show?._id || show?.id;
      if (!showId) {
        throw new Error("Show ID is missing");
      }

      try {
        await del(`/api/show/${showId}`);
      } catch (firstErr) {
        
        if (firstErr?.status === 404) {
          await del(`/api/shows/${showId}`);
        } else {
          throw firstErr;
        }
      }

      toast("Show deleted", "success");
      onSaved?.();
    } catch (err) {
      const isServerDeleteFailure = err?.status === 500;
      const msg = isServerDeleteFailure
        ? "Delete failed on server. This show may be linked to existing bookings. Please cancel related bookings first."
        : err?.data?.message ||
          err?.data?.error ||
          err?.message ||
          "Failed to delete show.";
      toast(msg, "error");
    } finally {
      setBusy(false);
    }
  };

  const selectCls = "w-full px-4 py-3 rounded-lg bg-white text-gray-900 border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm font-medium transition hover:border-gray-300";
  const inputCls = "w-full px-4 py-3 rounded-lg bg-white text-gray-900 border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm transition hover:border-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{isEdit ? "Edit Show" : "Create New Show"}</h2>
        <p className="text-gray-600 text-sm">Fill in the details to {isEdit ? "update the" : "create a new"} show</p>
      </div>

      
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
          <FiMapPin size={18} className="text-purple-600" />
          Theater
        </label>
        <select value={form.theaterId} onChange={set("theaterId")} required disabled={isEdit} className={selectCls}>
          <option value="">Select a theater...</option>
          {theaters.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} • {t.city} ({t.totalScreens} screens)
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
          <FiFilm size={18} className="text-blue-600" />
          Movie
        </label>
        <select value={form.movieId} onChange={set("movieId")} required disabled={isEdit} className={selectCls}>
          <option value="">Select a movie...</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      
      <div className="rounded-xl border border-gray-200 p-4 bg-linear-to-br from-orange-50 to-white space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <FiCalendar size={18} className="text-orange-600" />
          Show Date And Time
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</label>
            <input
              type="date"
              value={form.showDate}
              onChange={set("showDate")}
              required
              className={inputCls}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Time</label>
            <input
              type="time"
              value={form.showTime}
              onChange={set("showTime")}
              required
              className={inputCls}
            />
          </div>
        </div>

        <p className="text-xs text-gray-500">Users will see shows grouped by this selected date with clickable time slots.</p>
      </div>

      
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
            <FiUsers size={18} className="text-green-600" />
            Number of Seats
          </label>
          <input 
            placeholder="e.g. 100" 
            type="number"
            min={1}
            value={form.noOfSeats} 
            onChange={set("noOfSeats")} 
            required 
            className={inputCls}
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
            <FiDollarSign size={18} className="text-red-600" />
            Price per Ticket
          </label>
          <input 
            placeholder="e.g. 500" 
            type="number" 
            min={0}
            step={0.01}
            value={form.price} 
            onChange={set("price")} 
            required 
            className={inputCls}
          />
        </div>
      </div>

      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Optional Details</h3>
        
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiLayout size={16} className="text-indigo-600" />
              Seat Configuration
            </label>
            <input 
              placeholder="e.g. 10x10, 5+5" 
              value={form.seatConfiguration} 
              onChange={set("seatConfiguration")} 
              className={inputCls}
            />
            <p className="text-xs text-gray-500">Optional: Layout pattern (e.g., rows x columns)</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiFilm size={16} className="text-cyan-600" />
              Format
            </label>
            <input 
              placeholder="e.g. IMAX, 3D, 2D" 
              value={form.format} 
              onChange={set("format")} 
              className={inputCls}
            />
            <p className="text-xs text-gray-500">Optional: Screen format or technology</p>
          </div>
        </div>
      </div>

      
      <div className="flex gap-3 pt-4">
        <button 
          disabled={busy} 
          className="flex-1 py-3 rounded-lg bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold shadow-md hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          {busy ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Show" : "Create Show")}
        </button>
        {isEdit && (
          <button 
            type="button" 
            onClick={handleDelete} 
            disabled={busy} 
            className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <FiTrash2 size={18} />
            Delete
          </button>
        )}
      </div>
    </form>
  );
}