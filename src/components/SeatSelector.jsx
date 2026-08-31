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
    <div className="space-y-6 sm:space-y-8 bg-white rounded-2xl p-4 sm:p-8 border border-gray-200/90 shadow-xs">
      <div className="flex flex-col items-center gap-3">
        <div className="w-3/4 max-w-md h-1.5 bg-gray-300 rounded-full shadow-inner" />
        <div className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
          Screen This Way
        </div>
      </div>

      <div className="flex justify-center pb-1 px-1 overflow-x-auto scrollbar-hide">
        <div
          className="grid gap-2 sm:gap-2.5 w-fit"
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
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg text-[10px] sm:text-xs leading-none whitespace-nowrap flex items-center justify-center font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 ${
                selected.has(s.id)
                  ? "bg-gray-950 text-white border border-gray-950 shadow-sm active:scale-[0.94] cursor-pointer ring-2 ring-gray-950/20"
                  : booked.has(s.id)
                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through"
                    : locked.has(s.id)
                      ? "bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 active:scale-[0.94] cursor-pointer shadow-2xs"
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md border border-gray-300 bg-white" />
          <span className="text-gray-600 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-gray-950 border border-gray-950" />
          <span className="text-gray-900 font-medium">
            Selected <span className="font-bold">({selected.size})</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-amber-100 border border-amber-300" />
          <span className="text-gray-600 font-medium">Locked</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-gray-100 border border-gray-200" />
          <span className="text-gray-400 font-medium">Booked</span>
        </div>
      </div>
    </div>
  );
}
