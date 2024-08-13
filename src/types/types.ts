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