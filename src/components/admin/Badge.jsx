

export default function Badge({ status, variant = "default", className = "" }) {
  const variantMap = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  
  let autoVariant = variant;
  if (variant === "default") {
    const statusLower = String(status).toLowerCase();
    if (
      statusLower.includes("success") ||
      statusLower.includes("approved") ||
      statusLower.includes("released")
    ) {
      autoVariant = "success";
    } else if (statusLower.includes("pending")) {
      autoVariant = "warning";
    } else if (
      statusLower.includes("error") ||
      statusLower.includes("failed") ||
      statusLower.includes("rejected")
    ) {
      autoVariant = "error";
    } else if (statusLower.includes("coming")) {
      autoVariant = "info";
    }
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        variantMap[autoVariant] || variantMap.default
      } ${className}`}
    >
      {status}
    </span>
  );
}
