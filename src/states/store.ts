import { create } from 'zustand';
import { AuthState, User } from "../types/types";
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSidebarToggleStore } from '../types/types';

const authStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  login: (token) => set({ isLoggedIn: true, token }),
  logout: () => set({ isLoggedIn: false, token: null }),
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

const handleLogout = () => {
  authStore.getState().logout();
}


export { authStore, useSidebarToggle, handleLogout };
