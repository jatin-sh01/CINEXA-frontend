import { memo } from "react";


const Filters = memo(function Filters({
  languages = [],
  genres = [],
  selected = { languages: [], genres: [] },
  onToggle,
}) {
  const chips = [
    ...languages.map((v) => ({ type: "languages", value: v })),
    ...genres.map((v) => ({ type: "genres", value: v })),
  ];

  if (!chips.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {chips.map(({ type, value }) => {
          const isActive = selected[type]?.includes(value);
          return (
            <button
              key={`${type}-${value}`}
              onClick={() => onToggle(type, value)}
              aria-pressed={isActive}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default Filters;
