import { create } from 'zustand';

interface LoginFormState {
  username: string;
  password: string;
}

interface SignupFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthStore {
  loginForm: LoginFormState;
  signupForm: SignupFormState;
  setLoginForm: (name: keyof LoginFormState, value: string) => void;
  setSignupForm: (name: keyof SignupFormState, value: string) => void;
  resetForms: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loginForm: {
    username: '',
    password: '',
  },
  signupForm: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  setLoginForm: (name, value) =>
    set((state) => ({
      loginForm: {
        ...state.loginForm,
        [name]: value,
      },
    })),
  setSignupForm: (name, value) =>
    set((state) => ({
      signupForm: {
        ...state.signupForm,
        [name]: value,
      },
    })),
  resetForms: () =>
    set({
      loginForm: {
        username: '',
        password: '',
      },
      signupForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    }),
}));
