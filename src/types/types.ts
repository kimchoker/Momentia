import { Timestamp } from "firebase/firestore";
import { ReactNode } from 'react';

// zustand
export interface User {
  uid: string;
  email: string;
  
}

// 유저 인증상태
export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  login: (token :string) => void;
  logout: () => void;
}

// 사이드바 열림 닫힘
export interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
}

// 유저 데이터
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

// 글쓰기/수정 모달 상태 관리용
export interface ModalState {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

// 글쓰기/수정 관련 타입
export interface PostData {
  content: string;
  userId: string;
  images: { url: string; fileName: string }[];
  likeCount: number;
  commentCount: number;
}