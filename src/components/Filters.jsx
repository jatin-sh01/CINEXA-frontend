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
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition duration-150 active:scale-[0.96] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-1 ${
                isActive
                  ? "bg-gray-950 text-white border-gray-950 shadow-xs"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-2xs"
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
