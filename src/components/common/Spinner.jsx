

export default function Spinner({
  size = "md",
  message = "Loading...",
  fullPage = false,
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  const spinnerContent = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
      {spinnerContent}
    </div>
  );
}
