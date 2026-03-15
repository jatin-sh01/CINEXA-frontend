import { useEffect, useMemo, useState } from "react";
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
  const [animatedValue, setAnimatedValue] = useState(
    typeof value === "number" ? 0 : value,
  );

  useEffect(() => {
    if (loading || typeof value !== "number") {
      setAnimatedValue(value);
      return;
    }

    let frame;
    const duration = 650;
    const start = performance.now();
    const startValue = 0;

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setAnimatedValue(Math.round(startValue + (value - startValue) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loading, value]);

  const displayValue = useMemo(() => {
    if (typeof animatedValue === "number") {
      return animatedValue.toLocaleString();
    }
    return animatedValue;
  }, [animatedValue]);

  const colorClassMap = {
    "bg-purple-600": "bg-slate-100 text-slate-700",
    "bg-blue-600": "bg-slate-100 text-slate-700",
    "bg-green-600": "bg-slate-100 text-slate-700",
    "bg-orange-600": "bg-slate-100 text-slate-700",
    "bg-pink-600": "bg-slate-100 text-slate-700",
    "bg-red-600": "bg-slate-100 text-slate-700",
  };

  return (
    <div
      onClick={onClick}
      className={`admin-card admin-fade-up p-5 md:p-6 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5 md:gap-4">
          <div
            className={`h-12 w-12 md:h-14 md:w-14 rounded-xl ${colorClassMap[color] || colorClassMap["bg-purple-600"]} flex items-center justify-center shadow-sm`}
          >
            {IconComponent ? <IconComponent size={24} /> : null}
          </div>
          <div>
            <p className="admin-label font-medium">{label}</p>
            {loading ? (
              <div className="mt-2 h-8 w-24 rounded-lg bg-slate-200 animate-pulse" />
            ) : (
              <>
                <p className="admin-stat-number mt-1">
                  {displayValue}
                </p>
                {trend && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
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
