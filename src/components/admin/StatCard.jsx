

import { FiTrendingUp } from "react-icons/fi";

export default function StatCard({
  icon,
  label,
  value,
  color = "bg-purple-600",
  trend,
  onClick,
  loading = false,
  className = "",
}) {
  const IconComponent = icon;

  const colorClassMap = {
    "bg-purple-600": "bg-purple-100 text-purple-600",
    "bg-blue-600": "bg-blue-100 text-blue-600",
    "bg-green-600": "bg-green-100 text-green-600",
    "bg-orange-600": "bg-orange-100 text-orange-600",
    "bg-pink-600": "bg-pink-100 text-pink-600",
    "bg-red-600": "bg-red-100 text-red-600",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-xl ${colorClassMap[color] || colorClassMap["bg-purple-600"]} flex items-center justify-center shadow-md`}
          >
            {IconComponent ? <IconComponent size={28} /> : null}
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded mt-2 animate-pulse" />
            ) : (
              <>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </p>
                {trend && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-semibold">
                    <FiTrendingUp size={14} />
                    {trend}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
