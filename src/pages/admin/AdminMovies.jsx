import { useState, useMemo } from "react";
import { FiPlus, FiAlertTriangle } from "react-icons/fi";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";
import adminApi from "../../services/adminApi";
import MovieForm from "../../components/admin/MovieForm";
import Modal from "../../components/shared/Modal";
import DataTable from "../../components/admin/DataTable";
import SearchBar from "../../components/admin/SearchBar";
import FilterDropdown from "../../components/admin/FilterDropdown";
import ConfirmModal from "../../components/admin/ConfirmModal";
import PageHeader from "../../components/admin/PageHeader";
import Badge from "../../components/admin/Badge";
import { useToast } from "../../components/Toast";

const ITEMS_PER_PAGE = 10;

export default function AdminMovies() {
  const toast = useToast();
  const [editItem, setEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: movies,
    page,
    setPage,
    total,
    loading,
    error,
    refetch,
  } = usePaginatedFetch(() => adminApi.getMovies(), ITEMS_PER_PAGE);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchSearch =
        !search ||
        movie.name?.toLowerCase().includes(search.toLowerCase()) ||
        movie.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || movie.releaseStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [movies, search, statusFilter]);

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
    setPage(1);
    refetch();
  };

  const handleDelete = async (movie) => {
    setDeleteConfirm(movie);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      await adminApi.deleteMovie(deleteConfirm._id);
      toast("success", "Movie deleted successfully");
      setDeleteConfirm(null);
      refetch();
    } catch (err) {
      toast("error", err.message || "Failed to delete movie");
    } finally {
      setIsDeleting(false);
    }
  };

  const tableColumns = [
    { key: "name", label: "Title", sortable: true, width: "200px" },
    {
      key: "genres",
      label: "Genres",
      render: (genres) => genres?.join(", ") || "—",
    },
    {
      key: "certificate",
      label: "Certificate",
      render: (cert) => <Badge status={cert || "UA"} variant="info" />,
    },
    { key: "language", label: "Language", sortable: true },
    {
      key: "releaseStatus",
      label: "Status",
      sortable: true,
      render: (status) => <Badge status={status} />,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <PageHeader
        title="Movies"
        description="Manage all movies in the catalog."
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition duration-200"
          >
            <FiPlus size={20} />
            Add Movie
          </button>
        }
      />

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <FiAlertTriangle className="text-red-600" size={20} />
          <div>
            <p className="text-red-900 font-medium">Error loading movies</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <SearchBar
          placeholder="Search movies..."
          onSearch={setSearch}
          className="flex-1"
        />
        <FilterDropdown
          label="Status"
          options={[
            { value: "", label: "All Status" },
            { value: "RELEASED", label: "Released" },
            { value: "COMING_SOON", label: "Coming Soon" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <DataTable
        columns={tableColumns}
        data={filteredMovies}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        page={page}
        limit={ITEMS_PER_PAGE}
        total={total}
        onPageChange={setPage}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editItem ? "Edit Movie" : "Create New Movie"}
      >
        <MovieForm movie={editItem} onSaved={handleSaved} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Movie"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
