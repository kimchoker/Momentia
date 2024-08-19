import { Timestamp } from "firebase/firestore";
import { ReactNode } from 'react';

// zustand
export interface User {
  uid: string;
  email: string;
  
}

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  login: (token :string) => void;
  logout: () => void;
}

export interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
}

export interface UserData {
  bio: string;
  createdAt: Timestamp;
  email: string;
  nickname: string;
  profileImage: string;
  updatedAt: Timestamp;
}

// layout.tsx 설정용
export interface LayoutProps {
  children: ReactNode;
}