// src/store/authStore.ts
import { User } from '@/types/user';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';





interface AuthState {
  user: User | null;
  isLoggedIn: boolean; // Persisted for UX, but not for security
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user: User) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage', // A unique name for your store
      storage: createJSONStorage(() => localStorage),
      // Only persist the 'isLoggedIn' flag
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    }
  )
);
