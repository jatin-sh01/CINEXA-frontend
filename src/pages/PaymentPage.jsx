import { useParams } from "react-router-dom";
import { get } from "../api";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/shared/Spinner";
import { formatCurrency } from "../utils/format";

export default function PaymentPage() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => get(`/api/payment/${id}`), [id]);
  const payment = data?.data;

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-400 text-center py-12">{error}</p>;
  if (!payment) return <p className="text-gray-500 text-center py-12">Payment not found</p>;

  const statusColor = {
    SUCCESS: "bg-green-600/20 text-green-400",
    FAILED: "bg-red-600/20 text-red-400",
    PENDING: "bg-yellow-600/20 text-yellow-400",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-white">Payment Details</h1>
      <div className="bg-gray-900 rounded-xl p-6 space-y-3 text-sm text-gray-300">
        <p><strong>Payment ID:</strong> <span className="font-mono text-xs text-gray-400">{payment._id}</span></p>
        <p><strong>Amount:</strong> {formatCurrency(payment.amount)}</p>
        <p><strong>Method:</strong> {payment.paymentMethod?.replace(/_/g, " ")}</p>
        <p><strong>Status:</strong> <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${statusColor[payment.paymentStatus] || ""}`}>{payment.paymentStatus}</span></p>
        {payment.transactionId && <p><strong>Transaction ID:</strong> {payment.transactionId}</p>}
      </div>
    </div>
  );
}