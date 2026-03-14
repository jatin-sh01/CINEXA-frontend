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
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Summary</h1>
          <p className="text-gray-600">Review and confirm your ticket reservation</p>
        </div>

        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100">
              <FiClock className="text-blue-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Show Time</p>
                <p className="text-gray-900 font-bold text-lg">{timing}</p>
              </div>
            </div>

            
            <div className="flex items-start gap-4 p-5 bg-purple-50 rounded-xl border border-purple-100">
              <FiUsers className="text-purple-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Number of Seats</p>
                <p className="text-gray-900 font-bold text-lg">{noOfSeats} {seat ? `(${seat})` : ""}</p>
              </div>
            </div>

            
            <div className="flex items-start gap-4 p-5 bg-orange-50 rounded-xl border border-orange-100">
              <FiDollarSign className="text-orange-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">Price per Seat</p>
                <p className="text-gray-900 font-bold text-lg">{formatCurrency(price)}</p>
              </div>
            </div>

            
            <div className="flex items-start gap-4 p-5 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <FiCheck className="text-green-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Total Amount</p>
                <p className="text-gray-900 font-bold text-2xl">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </div>

          
          <div className="border-t border-gray-200" />

          
          <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-700">
            You are about to book <span className="font-bold text-gray-900">{noOfSeats} ticket{Number(noOfSeats) > 1 ? "s" : ""}</span> for a total of <span className="font-bold text-green-600">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        
        <button 
          onClick={handleConfirm} 
          disabled={busy} 
          className="w-full py-4 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {busy ? "Creating Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}