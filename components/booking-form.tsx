"use client";

import { useMemo, useState } from "react";
import type { Room } from "@/data/rooms";

type BookingFormProps = {
  room: Room;
};

export function BookingForm({ room }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.floor(diff) : 0;
  }, [checkIn, checkOut]);

  const total = nights * room.pricePerNight;

  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
      <section className="border border-border bg-card p-8 md:p-10 lg:col-span-7">
        <h1 className="mb-8 font-serif text-3xl md:text-4xl">Бронирование</h1>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input className="h-11 w-full border border-input bg-transparent px-3" placeholder="Имя владельца" />
            <input className="h-11 w-full border border-input bg-transparent px-3" placeholder="Телефон" />
          </div>
          <input className="h-11 w-full border border-input bg-transparent px-3" placeholder="Имя питомца" />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="h-11 w-full border border-input bg-transparent px-3" />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="h-11 w-full border border-input bg-transparent px-3" />
          </div>
          <textarea className="min-h-[120px] w-full border border-input bg-transparent p-3" placeholder="Особые указания" />
          <div className="border-t border-border pt-6">
            <button type="button" className="h-14 w-full bg-primary text-sm uppercase tracking-wide text-primary-foreground">Отправить заявку</button>
          </div>
        </form>
      </section>

      <aside className="sticky top-24 border border-border bg-card lg:col-span-5">
        <div className="aspect-[4/3] bg-muted">
          <img src={room.photoUrl} alt={room.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-3 p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{room.kind === "dog" ? "Для собак" : "Для кошек"}</p>
          <h2 className="font-serif text-2xl">{room.name}</h2>
          <p className="text-muted-foreground">{room.description}</p>
          <p>Цена за сутки: {room.pricePerNight.toLocaleString("ru-RU")} ₽</p>
          <p>Ночей: {nights}</p>
          <p className="text-xl text-primary">Итого: {total.toLocaleString("ru-RU")} ₽</p>
        </div>
      </aside>
    </div>
  );
}