import { create } from 'zustand';
import { ModalState, useSidebarToggleStore, DrawerState } from "../types/types";
import { persist, createJSONStorage } from 'zustand/middleware';

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
  modalContent: null,
  modalTitle: '',  // 추가: 모달 제목 상태
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setModalContent: (content) => set({ modalContent: content }),
  setModalTitle: (title: string) => set({ modalTitle: title }),  // 추가: 모달 제목 설정 함수
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

export { useSidebarToggle, useModalStore, profileEditStore };
