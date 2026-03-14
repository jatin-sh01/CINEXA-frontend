

import { useState, useMemo } from "react";
import { FiCalendar, FiAlertTriangle, FiX } from "react-icons/fi";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";
import adminApi from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import SearchBar from "../../components/admin/SearchBar";
import FilterDropdown from "../../components/admin/FilterDropdown";
import ConfirmModal from "../../components/admin/ConfirmModal";
import PageHeader from "../../components/admin/PageHeader";
import Badge from "../../components/admin/Badge";
import { useToast } from "../../components/Toast";

const ITEMS_PER_PAGE = 15;

export default function AdminBookings() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const {
    data: bookings,
    page,
    setPage,
    total,
    loading,
    error,
    refetch,
  } = usePaginatedFetch(() => adminApi.getBookings(), ITEMS_PER_PAGE);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchSearch =
        !search ||
        booking._id?.includes(search) ||
        booking.userEmail?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || booking.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  const handleCancel = (booking) => {
    setCancelConfirm(booking);
  };

  const confirmCancel = async () => {
    if (!cancelConfirm) return;
    try {
      setIsCanceling(true);
      await adminApi.cancelBooking(cancelConfirm._id);
      toast("success", "Booking cancelled successfully");
      setCancelConfirm(null);
      refetch();
    } catch (err) {
      toast("error", err.message || "Failed to cancel booking");
    } finally {
      setIsCanceling(false);
    }
  };

  const tableColumns = [
    { key: "_id", label: "Booking ID", width: "120px" },
    {
      key: "userEmail",
      label: "User",
      sortable: true,
      render: (email) => <span className="text-sm">{email}</span>,
    },
    {
      key: "movieName",
      label: "Movie",
      sortable: true,
      render: (movie) => <span className="font-medium">{movie || "—"}</span>,
    },
    {
      key: "theaterName",
      label: "Theater",
      render: (theater) => <span className="text-sm">{theater || "—"}</span>,
    },
    {
      key: "noOfSeats",
      label: "Seats",
      render: (seats) => (
        <span className="font-semibold text-center">{seats}</span>
      ),
    },
    {
      key: "totalAmount",
      label: "Amount",
      sortable: true,
      render: (amount) => (
        <span className="font-semibold text-green-600">₹{amount}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => <Badge status={status} />,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <PageHeader
        title="Bookings"
        description="Manage all bookings and view revenue."
      />

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <FiAlertTriangle className="text-red-600" size={20} />
          <div>
            <p className="text-red-900 font-medium">Error loading bookings</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <SearchBar
          placeholder="Search by booking ID or email..."
          onSearch={setSearch}
          className="flex-1"
        />
        <FilterDropdown
          label="Status"
          options={[
            { value: "", label: "All Status" },
            { value: "CONFIRMED", label: "Confirmed" },
            { value: "CANCELLED", label: "Cancelled" },
            { value: "COMPLETED", label: "Completed" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <DataTable
        columns={tableColumns}
        data={filteredBookings}
        loading={loading}
        onDelete={handleCancel}
        page={page}
        limit={ITEMS_PER_PAGE}
        total={total}
        onPageChange={setPage}
        selectable={false}
      />

      <ConfirmModal
        isOpen={!!cancelConfirm}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking "${cancelConfirm?._id}"? A refund will be processed.`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        isDanger={true}
        isLoading={isCanceling}
        onConfirm={confirmCancel}
        onCancel={() => setCancelConfirm(null)}
      />
    </div>
  );
}
