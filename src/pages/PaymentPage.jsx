import { useParams } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import { formatCurrency } from "../utils/format";

export default function PaymentPage() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(
    () => get(`/api/payment/${id}`),
    [id],
  );
  const payment = data?.data;

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600 text-center py-12">{error}</p>;
  if (!payment)
    return <p className="text-gray-600 text-center py-12">Payment not found</p>;

  const statusColor = {
    SUCCESS: "bg-green-100 text-green-700 border border-green-200",
    FAILED: "bg-red-100 text-red-700 border border-red-200",
    PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3 text-sm text-gray-700">
        <p>
          <strong className="text-gray-900 font-semibold">Payment ID:</strong>{" "}
          <span className="font-mono text-xs text-gray-500 break-all">{payment._id}</span>
        </p>
        <p>
          <strong className="text-gray-900 font-semibold">Amount:</strong>{" "}
          <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
        </p>
        <p>
          <strong className="text-gray-900 font-semibold">Method:</strong>{" "}
          <span>{payment.paymentMethod?.replace(/_/g, " ")}</span>
        </p>
        <p>
          <strong className="text-gray-900 font-semibold">Status:</strong>{" "}
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor[payment.paymentStatus] || "bg-gray-100 text-gray-700 border border-gray-200"}`}
          >
            {payment.paymentStatus}
          </span>
        </p>
        {payment.transactionId && (
          <p>
            <strong className="text-gray-900 font-semibold">Transaction ID:</strong>{" "}
            <span className="font-mono text-xs text-gray-500 break-all">{payment.transactionId}</span>
          </p>
        )}
      </div>
    </div>
  );
}
