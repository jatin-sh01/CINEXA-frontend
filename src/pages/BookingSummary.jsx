import { useSearchParams, useNavigate } from "react-router-dom";
import { post } from "../api";
import { useToast } from "../components/Toast";
import { formatCurrency } from "../utils/format";
import { useState } from "react";
import { FiCheck, FiClock, FiUsers, FiDollarSign } from "react-icons/fi";

export default function BookingSummary() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const showId = params.get("showId");
  const movieId = params.get("movieId");
  const theaterId = params.get("theaterId");
  const timing = params.get("timing") || "";
  const noOfSeats = params.get("noOfSeats") || "1";
  const seat = params.get("seat") || "";
  const price = Number(params.get("price") || 0);
  const totalCost = Number(noOfSeats) * price;

  const handleConfirm = async () => {
    setBusy(true);
    try {
      const body = { movieId, theaterId, showId, noOfSeats, timing };
      if (seat) body.seat = seat;
      const res = await post("/api/booking", body);
      toast("Booking created!", "success");
      navigate(`/booking/${res.data._id}?showId=${showId}`);
    } catch (err) {
      toast(err.message || "Booking failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 md:py-12">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Booking Summary
          </h1>
          <p className="text-sm text-gray-600">
            Review and confirm your ticket reservation
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="divide-y divide-gray-100 text-sm">
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5 text-gray-600">
                <FiClock size={16} />
                <span>Show Time</span>
              </div>
              <span className="font-semibold text-gray-900">{timing}</span>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5 text-gray-600">
                <FiUsers size={16} />
                <span>Seats ({noOfSeats})</span>
              </div>
              <span className="font-semibold text-gray-900">
                {seat ? seat : `${noOfSeats} Selected`}
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5 text-gray-600">
                <FiDollarSign size={16} />
                <span>Price per Seat</span>
              </div>
              <span className="text-gray-900">{formatCurrency(price)}</span>
            </div>

            <div className="flex items-center justify-between py-4 pt-5">
              <span className="text-base font-bold text-gray-900">Total Payable</span>
              <span className="text-2xl font-bold text-gray-950">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 text-center text-xs text-gray-600 border border-gray-100">
            Seats will be reserved for 5 minutes once you confirm.
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={busy}
          className="w-full py-3.5 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-medium text-base shadow-sm hover:shadow active:scale-[0.98] transition duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
        >
          {busy ? "Creating Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
