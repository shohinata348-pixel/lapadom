"use client";

import { useState } from "react";
import { ROOMS } from "@/data/rooms";
import { useBookingCartStore } from "@/stores/booking-cart-store";

export function BookingCartSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useBookingCartStore((state) => state.cartItems);
  const removeRoom = useBookingCartStore((state) => state.removeRoom);
  const clearCart = useBookingCartStore((state) => state.clearCart);
  const selectedRooms = cartItems
    .map((item) => {
      const room = ROOMS.find((entry) => entry.id === item.roomId);
      if (!room) {
        return null;
      }
      return { room, booking: item };
    })
    .filter((item): item is { room: (typeof ROOMS)[number]; booking: (typeof cartItems)[number] } => item !== null);
  const count = selectedRooms.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-1/2 z-40 inline-flex -translate-y-1/2 items-center gap-2 border border-border bg-card px-4 py-3 text-sm shadow-md transition-colors hover:bg-muted"
      >
        <span>Корзина</span>
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {count}
        </span>
      </button>

      {isOpen && <button type="button" className="fixed inset-0 z-40 bg-black/30" onClick={() => setIsOpen(false)} aria-label="Закрыть корзину" />}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-border bg-background p-5 text-sm shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-serif text-xl">Корзина бронирования</h3>
          <button type="button" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            Закрыть
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between text-muted-foreground">
          <span>Выбрано: {count}</span>
          {count > 0 && (
            <button type="button" onClick={clearCart} className="underline-offset-4 hover:underline">
              Очистить
            </button>
          )}
        </div>

        {count === 0 ? (
          <p className="text-muted-foreground">Корзина пуста. Нажмите &quot;Бронировать&quot; на любой карточке.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedRooms.map(({ room, booking }) => (
              <div key={room.id} className="space-y-2 bg-muted px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span>{room.name}</span>
                  <button
                    type="button"
                    onClick={() => removeRoom(room.id)}
                    className="text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
                  >
                    Убрать
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Посещение: {booking.visitDate || "не указана"} · Заселение: {booking.checkInDate || "не указана"}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
