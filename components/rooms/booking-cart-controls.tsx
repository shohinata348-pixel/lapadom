"use client";

import { useBookingCartStore } from "@/stores/booking-cart-store";

type BookingCartControlsProps = {
  roomId: string;
};

export function BookingCartControls({ roomId }: BookingCartControlsProps) {
  const addRoom = useBookingCartStore((state) => state.addRoom);
  const hasRoom = useBookingCartStore((state) => state.hasRoom);
  const isInCart = hasRoom(roomId);

  return (
    <button
      type="button"
      onClick={() => addRoom(roomId)}
      className="inline-flex h-12 w-full items-center justify-center border border-foreground bg-foreground px-6 text-sm uppercase tracking-wide text-background transition-colors hover:opacity-90 sm:w-auto"
    >
      {isInCart ? "Бронировать (в корзине)" : "Бронировать"}
    </button>
  );
}
