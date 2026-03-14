

import { useState, useCallback, useMemo } from "react";
import {
  FiChevronUp,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";

export default function DataTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onSelect,
  loading = false,
  emptyMessage = "No data available",
  selectable = true,
  sortable = true,
  page = 1,
  limit = 10,
  total = 0,
  onPageChange,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = useCallback(
    (columnKey) => {
      if (!sortable) return;
      setSortConfig((prev) => ({
        key: columnKey,
        direction:
          prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc",
      }));
    },
    [sortable],
  );

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        setSelectedIds(new Set(data.map((row) => row._id || row.id)));
      } else {
        setSelectedIds(new Set());
      }
      if (onSelect) {
        onSelect(
          Array.from(
            checked ? new Set(data.map((row) => row._id || row.id)) : new Set(),
          ),
        );
      }
    },
    [data, onSelect],
  );

  const handleSelectRow = useCallback(
    (id, checked) => {
      const newSelected = new Set(selectedIds);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setSelectedIds(newSelected);
      if (onSelect) {
        onSelect(Array.from(newSelected));
      }
    },
    [selectedIds, onSelect],
  );

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (!sortable || sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <FiChevronUp size={16} className="inline ml-1" />
    ) : (
      <FiChevronDown size={16} className="inline ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto" />
            </div>
            <p className="text-gray-500">Loading table...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sortedData.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size === sortedData.length &&
                      sortedData.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${
                    col.sortable !== false && sortable
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}
                  style={{ width: col.width || "auto" }}
                >
                  <span className="flex items-center">
                    {col.label}
                    {col.sortable !== false && sortable && (
                      <SortIcon columnKey={col.key} />
                    )}
                  </span>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={row._id || row.id || idx}
                className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
              >
                {selectable && (
                  <td className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row._id || row.id)}
                      onChange={(e) =>
                        handleSelectRow(row._id || row.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-gray-900 ${col.className || ""}`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right space-x-2 flex items-center justify-end">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-150"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-150"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {onPageChange && total > limit && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="inline-block px-3 py-1">{page}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page * limit >= total}
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
