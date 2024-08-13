import { create } from 'zustand';
import { AuthState, User } from "../types/types";

const authStore = create<AuthState>((set) => ({
  user: null,
  error: null,
  login: (userData: User) => set({ user: userData }),
  logout: () => set({ user: null }),
  setError: (error: string | null) => set({ error }),
}));

export default authStore;
