import { useState } from "react";
import { post } from "../../api";
import { useToast } from "../Toast";

const METHODS = ["CREDIT_CARD", "DEBIT_CARD", "UPI", "NET_BANKING", "WALLET"];

export default function PaymentForm({ booking, showId, onSuccess }) {
  const toast = useToast();
  const [method, setMethod] = useState(METHODS[0]);
  const [busy, setBusy] = useState(false);

  const handlePay = async () => {
    setBusy(true);
    try {
      const res = await post("/api/payment", {
        bookingId: booking._id,
        amount: Number(booking.totalCost),
        paymentMethod: method,
        showId: showId,
      });
      toast("Payment successful!", "success");
      onSuccess?.(res.data);
    } catch (err) {
      toast(err.message || "Payment failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const selectCls =
    "w-full px-4 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none text-sm";

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">Payment</h3>
      <p className="text-gray-400 text-sm">
        Amount:{" "}
        <strong className="text-white">
          {Number(booking.totalCost).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </strong>
      </p>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className={selectCls}
      >
        {METHODS.map((m) => (
          <option key={m} value={m}>
            {m.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <button
        onClick={handlePay}
        disabled={busy}
        className="w-full py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold disabled:opacity-50"
      >
        {busy ? "Processing\u2026" : "Pay Now"}
      </button>
    </div>
  );
}
