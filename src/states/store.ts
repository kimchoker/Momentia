import { create } from 'zustand';
import { AuthState, ModalState, UserState } from "../types/types";
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSidebarToggleStore } from '../types/types';
import { auth } from '../firebase/firebase';
import Cookies from 'js-cookie';

const authStore = create<AuthState>((set) => {
  // 페이지 로드 시 쿠키에서 토큰을 불러와 상태 초기화 
  const token = Cookies.get('token');
  const isLoggedIn = !!token;
  console.log("새로고침 확인 - Token:", token, "IsLoggedIn:", isLoggedIn);

  // Firebase 인증 객체

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true);
        set({ token: newToken });
        Cookies.set('token', newToken, { expires: 7 });
        console.log("토큰이 갱신되었습니다.");
      }
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생:", error);
    }
  };

  // 로그인 상태 유지 및 갱신 설정
  const startTokenRefresh = () => {
    // 1시간마다 토큰 갱신 (Firebase ID 토큰은 보통 1시간 유효함)
    const intervalId = setInterval(refreshToken, 60);

    // 토큰 갱신 시작
    refreshToken();

    return intervalId;
  };

  return {
    isLoggedIn,
    token,
    intervalId: null,

    // 로그인 액션
    login: (token: string) => {
      set({ isLoggedIn: true, token });
      Cookies.set('token', token, { expires: 7 });

      // 토큰 갱신 타이머 시작
      const intervalId = startTokenRefresh();
      set({ intervalId });
    },

    // 로그아웃 액션
    logout: () => {
      set({ isLoggedIn: false, token: null });
      Cookies.remove('token'); // 쿠키에서 토큰 삭제

      // 갱신 타이머 해제
      const { intervalId } = authStore.getState();
      if (intervalId) {
        clearInterval(intervalId);
      }

      set({ intervalId: null });
    },
  };
});

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

const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));


const useUserStore = create<UserState>((set) => ({
  uid: null,
  email: null,
  nickname: null,
  bio: null,
  follower: null,
  following: null,
  profileImage: null,
  setUser: (user) => set((state) => ({ ...state, ...user })),
}));

export { authStore, useSidebarToggle, useModalStore, useUserStore };
