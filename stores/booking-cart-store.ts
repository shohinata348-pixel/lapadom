"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ROOMS } from "@/data/rooms";

export type CartItem = {
  roomId: string;
  visitDate: string;
  checkInDate: string;
};

export type OrderItem = {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  roomId: string;
  roomName: string;
  visitDate: string;
  checkInDate: string;
  pricePerNight: number;
  createdAt: string;
};

type SubmitOrderPayload = {
  userId: string;
  userName: string;
  userPhone: string;
};

type BookingCartState = {
  cartItems: CartItem[];
  orders: OrderItem[];
  upsertRoomBooking: (payload: CartItem) => void;
  addRoom: (roomId: string) => void;
  removeRoom: (roomId: string) => void;
  clearCart: () => void;
  hasRoom: (roomId: string) => boolean;
  getRoomBooking: (roomId: string) => CartItem | undefined;
  submitOrder: (payload: SubmitOrderPayload) => { ok: true; count: number } | { ok: false; message: string };
};

export const useBookingCartStore = create<BookingCartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      orders: [],
      upsertRoomBooking: ({ roomId, visitDate, checkInDate }) => {
        set((state) => {
          const exists = state.cartItems.some((item) => item.roomId === roomId);
          if (exists) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.roomId === roomId ? { ...item, visitDate, checkInDate } : item,
              ),
            };
          }

          return {
            cartItems: [...state.cartItems, { roomId, visitDate, checkInDate }],
          };
        });
      },
      addRoom: (roomId) => {
        if (get().cartItems.some((item) => item.roomId === roomId)) {
          return;
        }

        set((state) => ({
          cartItems: [
            ...state.cartItems,
            {
              roomId,
              visitDate: "",
              checkInDate: "",
            },
          ],
        }));
      },
      removeRoom: (roomId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.roomId !== roomId),
        }));
      },
      clearCart: () => set({ cartItems: [] }),
      hasRoom: (roomId) => get().cartItems.some((item) => item.roomId === roomId),
      getRoomBooking: (roomId) => get().cartItems.find((item) => item.roomId === roomId),
      submitOrder: ({ userId, userName, userPhone }) => {
        const { cartItems } = get();
        if (cartItems.length === 0) {
          return { ok: false, message: "Корзина пуста." };
        }

        if (!userName.trim() || !userPhone.trim()) {
          return { ok: false, message: "Заполните имя и телефон профиля." };
        }

        const invalid = cartItems.some((item) => !item.visitDate || !item.checkInDate);
        if (invalid) {
          return { ok: false, message: "Укажите дату посещения и заселения для каждого номера." };
        }

        const now = new Date().toISOString();
        const orders: OrderItem[] = cartItems
          .map((item) => {
            const room = ROOMS.find((entry) => entry.id === item.roomId);
            if (!room) {
              return null;
            }

            return {
              id: crypto.randomUUID(),
              userId,
              userName: userName.trim(),
              userPhone: userPhone.trim(),
              roomId: room.id,
              roomName: room.name,
              visitDate: item.visitDate,
              checkInDate: item.checkInDate,
              pricePerNight: room.pricePerNight,
              createdAt: now,
            };
          })
          .filter((entry): entry is OrderItem => entry !== null);

        set((state) => ({
          orders: [...orders, ...state.orders],
          cartItems: [],
        }));

        return { ok: true, count: orders.length };
      },
    }),
    {
      name: "booking-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        orders: state.orders,
      }),
    },
  ),
);
