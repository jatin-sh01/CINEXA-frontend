import { useEffect, useMemo, useRef, useState } from "react";
import useSocket from "../hooks/useSocket";

export default function SeatSelector({ show, onSelect }) {
  const totalSeats = Number(show?.noOfSeats) || 40;
  const showId = show?._id;
  const cols = 10;
  const rows = Math.ceil(totalSeats / cols);
  const [selected, setSelected] = useState(new Set());
  const [locked, setLocked] = useState(new Set(show?.lockedSeats || []));
  const [booked, setBooked] = useState(new Set(show?.bookedSeats || []));
  const selectedRef = useRef(new Set());
  const { emit, on, joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    selectedRef.current = selected;

    console.log("[SeatSelector] Selected seats:", [...selected]);
  }, [selected]);

  useEffect(() => {
    setSelected(new Set());
    setLocked(new Set(show?.lockedSeats || []));
    setBooked(new Set(show?.bookedSeats || []));
    onSelect?.([]);
  }, [showId, show?.lockedSeats, show?.bookedSeats, onSelect]);

  useEffect(() => {
    if (!showId) return;

    joinRoom(showId);

    const offSnapshot = on("seat_snapshot", (payload) => {
      if (payload?.showId !== showId) return;
      setLocked(new Set(payload.lockedSeatIds || []));
      setBooked(new Set(payload.bookedSeatIds || []));
    });

    const offLocked = on("seat_locked", (payload) => {
      if (payload?.showId !== showId) return;
      const seatIds = payload.seatIds || [];

      setLocked((prev) => {
        const next = new Set(prev);
        seatIds.forEach((id) => next.add(id));
        return next;
      });
    });

    const offReleased = on("seat_released", (payload) => {
      if (payload?.showId !== showId) return;
      const seatIds = payload.seatIds || [];
      setLocked((prev) => {
        const next = new Set(prev);
        seatIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    const offBooked = on("seat_booked", (payload) => {
      if (payload?.showId !== showId) return;
      const seatIds = payload.seatIds || [];

      setBooked((prev) => {
        const next = new Set(prev);
        seatIds.forEach((id) => next.add(id));
        return next;
      });

      setLocked((prev) => {
        const next = new Set(prev);
        seatIds.forEach((id) => next.delete(id));
        return next;
      });

      setSelected((prev) => {
        let changed = false;
        const next = new Set(prev);
        seatIds.forEach((id) => {
          if (next.has(id)) {
            next.delete(id);
            changed = true;
          }
        });
        if (changed) userChangedRef.current = true;
        return next;
      });
    });

    const offRejected = on("seat_lock_rejected", (payload) => {
      if (payload?.showId !== showId) return;
      const seatIds = payload.seatIds || [];

      setSelected((prev) => {
        const next = new Set(prev);
        seatIds.forEach((id) => next.delete(id));
        userChangedRef.current = true;
        return next;
      });
    });

    return () => {
      const selectedSeats = [...selectedRef.current];
      if (selectedSeats.length) {
        emit("release_seats", { showId, seatIds: selectedSeats });
      }
      leaveRoom(showId);
      offSnapshot?.();
      offLocked?.();
      offReleased?.();
      offBooked?.();
      offRejected?.();
    };
  }, [showId, on, joinRoom, emit, leaveRoom, onSelect]);

  const seats = useMemo(() => {
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const num = r * cols + c + 1;
        if (num > totalSeats) break;
        arr.push({
          id: `${String.fromCharCode(65 + r)}${c + 1}`,
          row: r,
          col: c,
        });
      }
    }
    return arr;
  }, [totalSeats, rows]);

  const userChangedRef = useRef(false);

  const toggle = (id) => {
    if (booked.has(id)) return;

    userChangedRef.current = true;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        emit("release_seats", { showId, seatIds: [id] });
      } else {
        next.add(id);
        if (!locked.has(id)) {
          emit("lock_seats", { showId, seatIds: [id] });
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (userChangedRef.current) {
      onSelect?.([...selected]);
      userChangedRef.current = false;
    }
  }, [selected, onSelect]);

  return (
    <div className="space-y-6 sm:space-y-8 bg-linear-to-b from-gray-50 to-white rounded-2xl p-4 sm:p-8 border border-gray-200">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-2 bg-linear-to-r from-transparent via-gray-900 to-transparent rounded-full" />
        <div className="text-sm font-bold text-gray-600 tracking-widest">
          SCREEN
        </div>
      </div>

      <div className="flex justify-center pb-1 px-1">
        <div
          className="grid gap-3 sm:gap-4 w-full"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {seats.map((s) => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              disabled={
                booked.has(s.id) || (locked.has(s.id) && !selected.has(s.id))
              }
              aria-label={`Row ${String.fromCharCode(65 + s.row)} Seat ${s.col + 1}`}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] leading-none whitespace-nowrap flex items-center justify-center font-bold transition-all transform hover:scale-105 ${
                selected.has(s.id)
                  ? "bg-linear-to-br from-purple-600 to-purple-700 text-white shadow-lg scale-105 border-2 border-purple-800"
                  : booked.has(s.id)
                    ? "bg-red-500 text-white cursor-not-allowed opacity-60 border border-red-600"
                    : locked.has(s.id)
                      ? "bg-amber-400 text-amber-900 cursor-not-allowed font-bold border border-amber-500 hover:scale-100"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:shadow-md shadow-sm cursor-pointer"
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg border-2 border-gray-300 bg-white" />
          <span className="text-gray-700 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-linear-to-br from-purple-600 to-purple-700 border-2 border-purple-800" />
          <span className="text-gray-700 font-medium">
            Selected{" "}
            <span className="text-purple-600 font-bold">({selected.size})</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-amber-400 border border-amber-500" />
          <span className="text-gray-700 font-medium">Locked</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-red-500 border border-red-600 opacity-60" />
          <span className="text-gray-700 font-medium">Booked</span>
        </div>
      </div>
    </div>
  );
}
