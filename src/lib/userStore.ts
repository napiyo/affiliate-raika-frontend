import { User } from '@/types/user';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Don't persist anything - let the cookie be the source of truth
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: (user: User) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
