"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BookingCartState = {
  roomIds: string[];
  customerName: string;
  customerPhone: string;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  addRoom: (roomId: string) => void;
  removeRoom: (roomId: string) => void;
  clearCart: () => void;
  hasRoom: (roomId: string) => boolean;
};

export const useBookingCartStore = create<BookingCartState>()(
  persist(
    (set, get) => ({
      roomIds: [],
      customerName: "",
      customerPhone: "",
      setCustomerName: (name) => set({ customerName: name }),
      setCustomerPhone: (phone) => set({ customerPhone: phone }),
      addRoom: (roomId) => {
        if (get().roomIds.includes(roomId)) {
          return;
        }

        set((state) => ({ roomIds: [...state.roomIds, roomId] }));
      },
      removeRoom: (roomId) => {
        set((state) => ({
          roomIds: state.roomIds.filter((id) => id !== roomId),
        }));
      },
      clearCart: () => set({ roomIds: [] }),
      hasRoom: (roomId) => get().roomIds.includes(roomId),
    }),
    {
      name: "booking-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        roomIds: state.roomIds,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
      }),
    },
  ),
);
