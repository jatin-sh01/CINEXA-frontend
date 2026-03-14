

import { useState, useMemo } from "react";
import { FiAlertTriangle, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";
import adminApi from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import SearchBar from "../../components/admin/SearchBar";
import FilterDropdown from "../../components/admin/FilterDropdown";
import ConfirmModal from "../../components/admin/ConfirmModal";
import PageHeader from "../../components/admin/PageHeader";
import Badge from "../../components/admin/Badge";
import { useToast } from "../../components/Toast";

const ITEMS_PER_PAGE = 10;

export default function AdminModeration() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionConfirm, setActionConfirm] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: users,
    page,
    setPage,
    total,
    loading,
    error,
    refetch,
  } = usePaginatedFetch(() => adminApi.getUsers(), ITEMS_PER_PAGE);

  
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchSearch =
          !search ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          user.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || user.userStatus === statusFilter;
        return matchSearch && matchStatus;
      })
      .slice(0, 50); 
  }, [users, search, statusFilter]);

  const confirmAction = async () => {
    if (!actionConfirm) return;
    try {
      setIsProcessing(true);
      const { type, user } = actionConfirm;

      if (type === "block") {
        await adminApi.blockUser(user._id);
        toast("success", `User ${user.email} blocked`);
      } else if (type === "approve") {
        await adminApi.updateUserStatus(user._id, "APPROVED");
        toast("success", `User ${user.email} approved`);
      }

      setActionConfirm(null);
      refetch();
    } catch (err) {
      toast("error", err.message || "Failed to process action");
    } finally {
      setIsProcessing(false);
    }
  };

  const tableColumns = [
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (email) => <span className="font-medium">{email}</span>,
    },
    {
      key: "name",
      label: "Name",
      render: (name) => <span>{name || "—"}</span>,
    },
    {
      key: "userRole",
      label: "Role",
      render: (role) => (
        <Badge
          status={role}
          variant={
            role === "ADMIN" ? "error" : role === "CLIENT" ? "info" : "default"
          }
        />
      ),
    },
    {
      key: "userStatus",
      label: "Status",
      render: (status) => <Badge status={status} />,
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (date) => (
        <span className="text-sm">
          {date ? new Date(date).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <PageHeader
        title="Moderation"
        description="Review and manage user statuses and roles."
      />

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <FiAlertTriangle className="text-red-600" size={20} />
          <div>
            <p className="text-red-900 font-medium">Error loading users</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <SearchBar
          placeholder="Search by email or name..."
          onSearch={setSearch}
          className="flex-1"
        />
        <FilterDropdown
          label="Status"
          options={[
            { value: "", label: "All Status" },
            { value: "PENDING", label: "Pending" },
            { value: "APPROVED", label: "Approved" },
            { value: "REJECTED", label: "Rejected" },
            { value: "BLOCKED", label: "Blocked" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Pending",
            color: "bg-yellow-100 text-yellow-700",
            status: "PENDING",
          },
          {
            label: "Approved",
            color: "bg-green-100 text-green-700",
            status: "APPROVED",
          },
          {
            label: "Rejected",
            color: "bg-red-100 text-red-700",
            status: "REJECTED",
          },
          {
            label: "Blocked",
            color: "bg-gray-100 text-gray-700",
            status: "BLOCKED",
          },
        ].map((stat) => (
          <div
            key={stat.status}
            className="bg-white rounded-lg p-4 border border-gray-200 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color.split(" ")[1]}`}>
              {users.filter((u) => u.userStatus === stat.status).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <DataTable
        columns={tableColumns}
        data={filteredUsers}
        loading={loading}
        page={page}
        limit={ITEMS_PER_PAGE}
        total={total}
        onPageChange={setPage}
        selectable={false}
      />

      <ConfirmModal
        isOpen={!!actionConfirm}
        title={actionConfirm?.type === "block" ? "Block User" : "Approve User"}
        message={
          actionConfirm?.type === "block"
            ? `Block user "${actionConfirm?.user?.email}"? They will not be able to access their account.`
            : `Approve user "${actionConfirm?.user?.email}"? They will gain full access to the platform.`
        }
        confirmText={actionConfirm?.type === "block" ? "Block User" : "Approve"}
        cancelText="Cancel"
        isDanger={actionConfirm?.type === "block"}
        isLoading={isProcessing}
        onConfirm={confirmAction}
        onCancel={() => setActionConfirm(null)}
      />
    </div>
  );
}
