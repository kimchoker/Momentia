import { create } from 'zustand';
import { AuthState } from "../types/types";
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSidebarToggleStore } from '../types/types';
import Cookies from 'js-cookie';

const authStore = create<AuthState>((set) => {
  // 페이지 로드 시 쿠키에서 토큰을 불러와 상태 초기화 ㅁㄴㅇㄴㅁ
  const token = Cookies.get('token');
  const isLoggedIn = !!token;  // 토큰이 있으면 true, 없으면 false
  console.log("새로고침")

  return {
    isLoggedIn,
    token,

    // 로그인 액션
    login: (token: string) => {
      set({ isLoggedIn: true, token });
      Cookies.set('token', token, { expires: 7 });  // 쿠키에 토큰 저장
    },

    // 로그아웃 액션
    logout: () => {
      set({ isLoggedIn: false, token: null });
      Cookies.remove('token');  // 쿠키에서 토큰 삭제
    },

    // 쿠키에서 토큰을 불러오는 초기화 액션
    // initializeFromCookies: () => {
    //   const token = Cookies.get('token');
    //   if (token) {
    //     set({ isLoggedIn: true, token });
    //   }
    // }
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


export { authStore, useSidebarToggle };
