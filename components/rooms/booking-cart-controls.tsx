"use client";

import { useMemo, useState } from "react";
import { useBookingCartStore } from "@/stores/booking-cart-store";

type BookingCartControlsProps = {
  roomId: string;
};

export function BookingCartControls({ roomId }: BookingCartControlsProps) {
  const upsertRoomBooking = useBookingCartStore((state) => state.upsertRoomBooking);
  const hasRoom = useBookingCartStore((state) => state.hasRoom);
  const getRoomBooking = useBookingCartStore((state) => state.getRoomBooking);
  const roomBooking = getRoomBooking(roomId);
  const [visitDate, setVisitDate] = useState(roomBooking?.visitDate ?? "");
  const [checkInDate, setCheckInDate] = useState(roomBooking?.checkInDate ?? "");
  const isInCart = hasRoom(roomId);
  const canSave = Boolean(visitDate && checkInDate);
  const buttonText = useMemo(() => {
    if (!isInCart) {
      return "Добавить в бронирование";
    }

    return "Обновить бронирование";
  }, [isInCart]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Дата заселения</span>
          <input
            type="date"
            value={visitDate}
            onChange={(event) => setVisitDate(event.target.value)}
            className="h-11 w-full border border-input bg-transparent px-3"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Дата выселения</span>
          <input
            type="date"
            value={checkInDate}
            onChange={(event) => setCheckInDate(event.target.value)}
            className="h-11 w-full border border-input bg-transparent px-3"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canSave}
        onClick={() => upsertRoomBooking({ roomId, visitDate, checkInDate })}
        className="inline-flex h-12 w-full items-center justify-center border border-foreground bg-foreground px-6 text-sm uppercase tracking-wide text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonText}
      </button>
    </div>
  );
}
