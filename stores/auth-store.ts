"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
};

type RegisterPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type AuthResult = { ok: true } | { ok: false; message: string };

type AuthState = {
  users: AuthUser[];
  currentUserId: string | null;
  register: (payload: RegisterPayload) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  getCurrentUser: () => AuthUser | null;
};

const ADMIN_USER: AuthUser = {
  id: "admin-lapadom",
  name: "Администратор",
  phone: "+7 (999) 123-45-67",
  email: "admin@lapadom.ru",
  password: "AdminLapadom2026!",
  role: "admin",
};

const withDefaultAdmin = (users: AuthUser[]) => {
  const hasAdmin = users.some((user) => user.role === "admin" && user.email === ADMIN_USER.email);
  return hasAdmin ? users : [ADMIN_USER, ...users];
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [ADMIN_USER],
      currentUserId: null,
      register: ({ name, phone, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (get().users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
          return { ok: false, message: "Пользователь с таким email уже зарегистрирован." };
        }

        const user: AuthUser = {
          id: crypto.randomUUID(),
          name: name.trim(),
          phone: phone.trim(),
          email: normalizedEmail,
          password,
          role: "user",
        };

        set((state) => ({
          users: [...state.users, user],
          currentUserId: user.id,
        }));

        return { ok: true };
      },
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = get().users.find(
          (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
        );

        if (!user) {
          return { ok: false, message: "Неверный email или пароль." };
        }

        set({ currentUserId: user.id });
        return { ok: true };
      },
      logout: () => set({ currentUserId: null }),
      getCurrentUser: () => {
        const { users, currentUserId } = get();
        if (!currentUserId) {
          return null;
        }

        return users.find((user) => user.id === currentUserId) ?? null;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        currentUserId: state.currentUserId,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<AuthState>) ?? {};
        return {
          ...currentState,
          ...persisted,
          users: withDefaultAdmin(persisted.users ?? currentState.users),
        };
      },
    },
  ),
);

export const ADMIN_CREDENTIALS = {
  email: ADMIN_USER.email,
  password: ADMIN_USER.password,
};
