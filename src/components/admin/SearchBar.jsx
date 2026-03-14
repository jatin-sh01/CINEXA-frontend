

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  className = "",
}) {
  const [value, setValue] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, debounceMs, onSearch]);

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <FiSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition outline-none text-sm"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}
