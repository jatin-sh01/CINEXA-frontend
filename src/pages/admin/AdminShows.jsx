import { useState, useEffect } from "react";
import { apiClient } from "../../services/apiClient";
import ShowForm from "../../components/admin/ShowForm";
import Modal from "../../components/shared/Modal";
import Spinner from "../../components/shared/Spinner";
import { FiPlus, FiAlertTriangle, FiClock, FiCalendar, FiFilm } from "react-icons/fi";

const formatShowDate = (timing) => {
  const parsed = new Date(timing);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatShowTime = (timing) => {
  const parsed = new Date(timing);
  if (Number.isNaN(parsed.getTime())) return timing || "—";
  return parsed.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function AdminShows() {
  const [editItem, setEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShows = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get("/api/show");
      const allShows = Array.isArray(res) ? res : res?.data || [];
      setShows(allShows);
    } catch (err) {
      setError(err.message || "Failed to load shows");
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  const handleSaved = () => {
    closeModal();
    fetchShows();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shows</h1>
          <p className="text-gray-600">Manage all movie shows and timings.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition duration-200"
        >
          <FiPlus size={20} />
          <span>Add Show</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <FiAlertTriangle className="text-red-600" size={20} />
          <div>
            <p className="text-red-900 font-medium">Error loading shows</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner size="lg" message="Loading shows..." />
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-purple-100 bg-linear-to-r from-purple-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">Total Shows</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{shows.length}</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Movies Active</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {new Set(shows.map((s) => s.movieId?._id).filter(Boolean)).size}
              </p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-linear-to-r from-orange-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Theaters Running</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {new Set(shows.map((s) => s.theaterId?._id).filter(Boolean)).size}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Movie</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Theater</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Time</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Price</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shows.map((s) => (
                  <tr key={s._id || s.id} className="hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {s.movieId?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {s.theaterId?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} className="text-gray-400" />
                        {formatShowDate(s.timing)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiClock size={16} className="text-gray-400" />
                        <span className="font-semibold text-gray-800">{formatShowTime(s.timing)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{s.price?.toFixed(0) || 0}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {!shows.length && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No shows found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editItem ? "Edit Show" : "Create New Show"}
      >
        <ShowForm show={editItem} onSaved={handleSaved} />
      </Modal>
    </div>
  );
}
