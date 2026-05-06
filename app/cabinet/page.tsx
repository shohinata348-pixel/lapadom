"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ROOMS } from "@/data/rooms";
import { ADMIN_CREDENTIALS, useAuthStore } from "@/stores/auth-store";
import { useBookingCartStore } from "@/stores/booking-cart-store";

export default function CabinetPage() {
  const users = useAuthStore((state) => state.users);
  const currentUser = useAuthStore((state) => state.getCurrentUser());
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useBookingCartStore((state) => state.cartItems);
  const orders = useBookingCartStore((state) => state.orders);
  const submitOrder = useBookingCartStore((state) => state.submitOrder);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", phone: "", email: "", password: "" });

  const selectedRooms = useMemo(
    () =>
      cartItems
        .map((item) => {
          const room = ROOMS.find((entry) => entry.id === item.roomId);
          if (!room) {
            return null;
          }
          return { room, booking: item };
        })
        .filter((entry): entry is { room: (typeof ROOMS)[number]; booking: (typeof cartItems)[number] } => entry !== null),
    [cartItems],
  );

  const total = selectedRooms.reduce((sum, entry) => sum + entry.room.pricePerNight, 0);

  const handleLogin = () => {
    const result = login(loginData.email, loginData.password);
    if (!result.ok) {
      window.alert(result.message);
      return;
    }

    setLoginData({ email: "", password: "" });
  };

  const handleRegister = () => {
    if (!registerData.name.trim() || !registerData.phone.trim() || !registerData.email.trim() || !registerData.password.trim()) {
      window.alert("Заполните все поля регистрации.");
      return;
    }

    const result = register(registerData);
    if (!result.ok) {
      window.alert(result.message);
      return;
    }

    setRegisterData({ name: "", phone: "", email: "", password: "" });
  };

  const handlePurchase = () => {
    if (!currentUser) {
      return;
    }

    const result = submitOrder({
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
    });

    if (!result.ok) {
      window.alert(result.message);
      return;
    }

    window.alert(`Спасибо, ${currentUser.name}! Оформлено бронирований: ${result.count}.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader compact />
      <main className="container mx-auto px-6 py-16 md:py-24">
        <section className="mx-auto max-w-5xl border border-border bg-card p-8 md:p-10">
          {!currentUser ? (
            <>
              <div className="mb-8">
                <h1 className="mb-2 font-serif text-4xl">Личный кабинет</h1>
                <p className="text-muted-foreground">
                  Зарегистрируйтесь как пользователь
                 
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-3 border border-border p-6">
                  <h2 className="font-serif text-2xl">Вход</h2>
                  <input
                    value={loginData.email}
                    onChange={(event) => setLoginData((state) => ({ ...state, email: event.target.value }))}
                    placeholder="Email"
                    className="h-11 w-full border border-input bg-transparent px-3"
                  />
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(event) => setLoginData((state) => ({ ...state, password: event.target.value }))}
                    placeholder="Пароль"
                    className="h-11 w-full border border-input bg-transparent px-3"
                  />
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="h-11 w-full bg-primary text-xs uppercase tracking-wide text-primary-foreground"
                  >
                    Войти
                  </button>
                </div>

                <div className="space-y-3 border border-border p-6">
                  <h2 className="font-serif text-2xl">Регистрация</h2>
                  <input
                    value={registerData.name}
                    onChange={(event) => setRegisterData((state) => ({ ...state, name: event.target.value }))}
                    placeholder="Имя"
                    className="h-11 w-full border border-input bg-transparent px-3"
                  />
                  <input
                    value={registerData.phone}
                    onChange={(event) => setRegisterData((state) => ({ ...state, phone: event.target.value }))}
                    placeholder="Телефон"
                    className="h-11 w-full border border-input bg-transparent px-3"
                  />
                  <input
                    value={registerData.email}
                    onChange={(event) => setRegisterData((state) => ({ ...state, email: event.target.value }))}
                    placeholder="Email"
                    className="h-11 w-full border border-input bg-transparent px-3"
                  />
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(event) => setRegisterData((state) => ({ ...state, password: event.target.value }))}
                    placeholder="Пароль"
                    className="h-11 w-full border border-input bg-transparent px-3"
                  />
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="h-11 w-full bg-foreground text-xs uppercase tracking-wide text-background"
                  >
                    Зарегистрироваться
                  </button>
                </div>
              </div>
            </>
          ) : currentUser.role === "admin" ? (
            <>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="mb-1 font-serif text-4xl">Кабинет администратора</h1>
                  <p className="text-muted-foreground">Все заказы пользователей в одной таблице.</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="h-11 border border-border px-4 text-xs uppercase tracking-wide hover:bg-muted"
                >
                  Выйти
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="rounded border border-dashed border-border p-6 text-muted-foreground">Пока нет оформленных заказов.</div>
              ) : (
                <div className="overflow-x-auto border border-border">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 font-medium">Клиент</th>
                        <th className="px-4 py-3 font-medium">Телефон</th>
                        <th className="px-4 py-3 font-medium">Номер</th>
                        <th className="px-4 py-3 font-medium">Посещение</th>
                        <th className="px-4 py-3 font-medium">Заселение</th>
                        <th className="px-4 py-3 font-medium">Цена/сутки</th>
                        <th className="px-4 py-3 font-medium">Создан</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t border-border">
                          <td className="px-4 py-3">{order.userName}</td>
                          <td className="px-4 py-3">{order.userPhone}</td>
                          <td className="px-4 py-3">{order.roomName}</td>
                          <td className="px-4 py-3">{order.visitDate}</td>
                          <td className="px-4 py-3">{order.checkInDate}</td>
                          <td className="px-4 py-3">{order.pricePerNight.toLocaleString("ru-RU")} ₽</td>
                          <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString("ru-RU")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="mb-1 font-serif text-4xl">Ваши бронирования</h1>
                  <p className="text-muted-foreground">
                    Пользователь: {currentUser.name}, {currentUser.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="h-11 border border-border px-4 text-xs uppercase tracking-wide hover:bg-muted"
                >
                  Выйти
                </button>
              </div>

              {selectedRooms.length === 0 ? (
                <div className="rounded border border-dashed border-border p-6 text-muted-foreground">
                  Корзина пуста. Добавьте номера на странице /rooms.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRooms.map(({ room, booking }) => (
                    <div key={room.id} className="space-y-2 border border-border px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span>{room.name}</span>
                        <span className="text-primary">{room.pricePerNight.toLocaleString("ru-RU")} ₽</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Дата заселения: {booking.visitDate || "не указана"} · Дата выселения: {booking.checkInDate || "не указана"}
                      </p>
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
                disabled={selectedRooms.length === 0}
                className="mt-8 inline-flex h-12 items-center justify-center bg-primary px-6 text-sm uppercase tracking-wide text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Оформить заказ
              </button>
            </>
          )}
          {currentUser && currentUser.role === "admin" ? null : (
            <p className="mt-8 text-xs text-muted-foreground">
              Всего зарегистрировано пользователей: {users.filter((user) => user.role === "user").length}
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}