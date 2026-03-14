import { useState, useEffect } from "react";
import { apiClient } from "../../services/apiClient";
import TheaterForm from "../../components/admin/TheaterForm";
import Modal from "../../components/shared/Modal";
import Spinner from "../../components/shared/Spinner";
import { FiPlus, FiAlertTriangle, FiMapPin, FiMonitor } from "react-icons/fi";

export default function AdminTheaters() {
  const [editItem, setEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get("/api/theaters");
      const allTheaters = Array.isArray(res) ? res : res?.data || [];
      setTheaters(allTheaters);
    } catch (err) {
      setError(err.message || "Failed to load theaters");
      setTheaters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
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
    fetchTheaters();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Theaters</h1>
          <p className="text-gray-600">
            Manage theaters and their movie lineups.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition duration-200"
        >
          <FiPlus size={20} />
          <span>Add Theater</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <FiAlertTriangle className="text-red-600" size={20} />
          <div>
            <p className="text-red-900 font-medium">Error loading theaters</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner size="lg" message="Loading theaters..." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Theater Name
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Screens
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {theaters.map((t) => (
                  <tr
                    key={t._id || t.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {t.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMapPin size={16} className="text-gray-400" />
                        {t.city || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiMonitor size={16} className="text-gray-400" />
                        <span className="text-gray-600">
                          {t.totalScreens || 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(t);
                          }}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm transition"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!theaters.length && !loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No theaters found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editItem ? "Edit Theater" : "Create New Theater"}
      >
        <TheaterForm theater={editItem} onSaved={handleSaved} />
      </Modal>
    </div>
  );
}
