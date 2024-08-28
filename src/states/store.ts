import { create } from 'zustand';
import { AuthState, ModalState, UserState } from "../types/types";
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSidebarToggleStore } from '../types/types';
import { auth } from '../firebase/firebase';
import Cookies from 'js-cookie';
import { DrawerState } from '../types/types';

const authStore = create<AuthState>((set) => {
  const token = Cookies.get('token');
  const isLoggedIn = !!token;
  console.log("새로고침 확인 - Token:", token, "IsLoggedIn:", isLoggedIn);

  return {
    isLoggedIn,
    token,
    intervalId: null,
    uid: null,
    email: null,
    nickname: null,
    bio: null,
    follower: null,
    following: null,
    profileImage: null,

    // 로그인
    login: (token: string) => {
      set({ isLoggedIn: true, token });
      Cookies.set('token', token, { expires: 7 });
    },

    // 로그아웃
    logout: () => {
      set({
        isLoggedIn: false,
        token: null,
        uid: null,
        email: null,
        nickname: null,
        bio: null,
        follower: null,
        following: null,
        profileImage: null,
      });
      Cookies.remove('token'); // 쿠키에서 토큰 삭제
    },

    // 사용자 정보를 업데이트하는 메서드
    setUser: (userData) => {
      set({
        uid: userData.uid,
        email: userData.email,
        nickname: userData.nickname,
        bio: userData.bio,
        follower: userData.follower,
        following: userData.following,
        profileImage: userData.profileImage,
      });
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


// const useUserStore = create<UserState>((set) => ({
//   uid: null,
//   email: null,
//   nickname: null,
//   bio: null,
//   follower: null,
//   following: null,
//   profileImage: null,
//   setUser: (user) => set((state) => ({ ...state, ...user })),
// }));

const profileEditStore = create<DrawerState>((set) => ({
  isEditOpen: false,
  openEdit: () => set({ isEditOpen: true }),
  closeEdit: () => set({ isEditOpen: false }),
}))

export { authStore, useSidebarToggle, useModalStore, profileEditStore };
