import { create } from 'zustand';
import { AuthState, User } from "../types/types";
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSidebarToggleStore } from '../types/types';

const authStore = create<AuthState>((set) => ({
  user: null,
  error: null,
  login: (userData: User) => set({ user: userData }),
  logout: () => set({ user: null }),
  setError: (error: string | null) => set({ error }),
}));


const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    (set, get) => ({
      isOpen: true,
      setIsOpen: () => {
        set({ isOpen: !get().isOpen });
      }
    }),
    {
      name: 'sidebarOpen',
      storage: createJSONStorage(() => localStorage)
    }
  )
);


export { authStore, useSidebarToggle };
