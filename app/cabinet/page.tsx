"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ROOMS } from "@/data/rooms";
import { useBookingCartStore } from "@/stores/booking-cart-store";

export default function CabinetPage() {
  const roomIds = useBookingCartStore((state) => state.roomIds);
  const customerName = useBookingCartStore((state) => state.customerName);
  const customerPhone = useBookingCartStore((state) => state.customerPhone);
  const setCustomerName = useBookingCartStore((state) => state.setCustomerName);
  const setCustomerPhone = useBookingCartStore((state) => state.setCustomerPhone);
  const clearCart = useBookingCartStore((state) => state.clearCart);
  const selectedRooms = ROOMS.filter((room) => roomIds.includes(room.id));
  const total = selectedRooms.reduce((sum, room) => sum + room.pricePerNight, 0);

  const handlePurchase = () => {
    if (!customerName.trim() || !customerPhone.trim() || selectedRooms.length === 0) {
      return;
    }

    window.alert(`Спасибо, ${customerName.trim()}! Покупка оформлена. Номер: ${customerPhone.trim()}`);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader compact />
      <main className="container mx-auto px-6 py-16 md:py-24">
        <section className="mx-auto max-w-4xl border border-border bg-card p-8 md:p-10">
          <div className="mb-8">
            <h1 className="mb-2 font-serif text-4xl">Ваши бронирования</h1>
            <p className="text-muted-foreground">Заказы загружаются из корзины.</p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="customerName" className="block text-sm text-muted-foreground">
                Имя пользователя
              </label>
              <input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Введите ваше имя"
                className="h-12 w-full border border-input bg-transparent px-4"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="customerPhone" className="block text-sm text-muted-foreground">
                Номер телефона
              </label>
              <input
                id="customerPhone"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="+7 (999) 000-00-00"
                className="h-12 w-full border border-input bg-transparent px-4"
              />
            </div>
          </div>

          {selectedRooms.length === 0 ? (
            <div className="rounded border border-dashed border-border p-6 text-muted-foreground">
              Корзина пуста. Добавьте номера на странице /rooms.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedRooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between gap-3 border border-border px-4 py-3">
                  <span>{room.name}</span>
                  <span className="text-primary">{room.pricePerNight.toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-muted-foreground">Итого</span>
                <span className="font-serif text-2xl">{total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handlePurchase}
            disabled={selectedRooms.length === 0 || !customerName.trim() || !customerPhone.trim()}
            className="mt-8 inline-flex h-12 items-center justify-center bg-primary px-6 text-sm uppercase tracking-wide text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Купить
          </button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}