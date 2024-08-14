import { Timestamp } from "firebase/firestore";

// zustand
export interface User {
  uid: string;
  email: string;
  
}

export interface AuthState {
  user: User | null;
  error: string | null;
  login: (userData: User) => void;
  logout: () => void;
  setError: (error: string | null) => void;
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