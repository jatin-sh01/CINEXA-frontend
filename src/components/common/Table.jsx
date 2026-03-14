import { useState, useMemo } from "react";
import { uiPatterns } from "../../lib/uiPatterns";

export default function Table({
  data = [],
  columns = [],
  onRowSelect,
  loading = false,
  emptyMessage = "No data available",
  selectable = true,
}) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal || "").toLowerCase();
      const bStr = String(bVal || "").toLowerCase();
      return sortDir === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return sorted;
  }, [data, sortBy, sortDir]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(data.map((row) => row.id));
      setSelectedRows(allIds);
      onRowSelect?.(Array.from(allIds));
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    const next = new Set(selectedRows);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedRows(next);
    onRowSelect?.(Array.from(next));
  };

  if (loading) {
    return (
      <div
        className={`${uiPatterns.card} ${uiPatterns.cardInset} text-center py-8`}
      >
        <div className={uiPatterns.spinner} />
        <p className={`${uiPatterns.bodySmall} mt-2`}>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`${uiPatterns.card} ${uiPatterns.cardInset} text-center py-12`}
      >
        <p className={uiPatterns.bodySmall}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={uiPatterns.table}>
        <thead className={uiPatterns.tableHead}>
          <tr>
            {selectable && (
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  className={uiPatterns.formCheckbox}
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${uiPatterns.tableHeadCell} ${
                  col.sortable ? uiPatterns.tableHeadCellSortable : ""
                }`}
                onClick={() => col.sortable && handleSort(col.key)}
                role={col.sortable ? "button" : undefined}
                tabIndex={col.sortable ? 0 : undefined}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-xs">
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={uiPatterns.tableBody}>
          {sortedData.map((row) => (
            <tr key={row.id} className={uiPatterns.tableRow}>
              {selectable && (
                <td className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    className={uiPatterns.formCheckbox}
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                    aria-label={`Select row ${row.id}`}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={uiPatterns.tableCell}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
