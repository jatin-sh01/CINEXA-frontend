

export default function Pagination({ page = 1, total = 0, limit = 20, onChange }) {
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (page > 1) onChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onChange(page + 1);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => onChange(1)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots-start" className="text-gray-500">
            ...
          </span>
        );
      }
    }

    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onChange(i)}
          className={
            i === page
              ? "px-3 py-2 rounded-lg bg-purple-600 text-white transition text-sm font-medium"
              : "px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          }
        >
          {i}
        </button>
      );
    }

    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots-end" className="text-gray-500">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onChange(totalPages)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium">{startIndex}</span> to{" "}
        <span className="font-medium">{endIndex}</span> of{" "}
        <span className="font-medium">{total}</span> items
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">{renderPageButtons()}</div>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}
