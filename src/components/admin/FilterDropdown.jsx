

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

export default function FilterDropdown({
  label,
  options = [],
  value = "",
  onChange,
  clearable = true,
  multiple = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(multiple ? [] : value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newSelected = Array.isArray(selected)
        ? selected.includes(optionValue)
          ? selected.filter((v) => v !== optionValue)
          : [...selected, optionValue]
        : [optionValue];
      setSelected(newSelected);
      onChange(newSelected);
    } else {
      setSelected(optionValue);
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    const clearValue = multiple ? [] : "";
    setSelected(clearValue);
    onChange(clearValue);
  };

  const getDisplayValue = () => {
    if (multiple) {
      return Array.isArray(selected) && selected.length > 0
        ? `${selected.length} selected`
        : label;
    }
    if (!selected) return label;
    return options.find((opt) => opt.value === selected)?.label || label;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-left text-gray-900 text-sm font-medium hover:bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition flex items-center justify-between"
      >
        <span className={selected ? "text-gray-900" : "text-gray-500"}>
          {getDisplayValue()}
        </span>
        <div className="flex items-center gap-1">
          {selected && clearable && (
            <FiX
              size={16}
              className="text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
          <FiChevronDown
            size={16}
            className={`text-gray-600 transition ${isOpen ? "transform rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="max-h-64 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition ${
                    (
                      multiple
                        ? Array.isArray(selected) &&
                          selected.includes(option.value)
                        : selected === option.value
                    )
                      ? "bg-purple-50 text-purple-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(selected) &&
                        selected.includes(option.value)
                      }
                      onChange={() => {}}
                      className="mr-2 w-4 h-4 accent-purple-600"
                    />
                  )}
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
