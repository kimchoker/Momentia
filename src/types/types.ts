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
  uid: string | null;
  email: string | null;
  nickname: string | null;
  bio: string | null;
  follower: number | null 
  following: number | null 
  profileImage: string | null;
  login: (token :string) => void;
  logout: () => void;
  setUser: (userData: {
    uid: string;
    email: string;
    nickname: string;
    bio: string;
    follower: number;
    following: number;
    profileImage: string;
  }) => void;
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
  userId: string; // uid
  email: string; // 이메일
  nickname: string; // 닉네임
  content: string; // 글 내용
  images: { url: string; fileName: string }[]; // 첨부 이미지 
  likeCount: number;
  commentCount: number;
}

export interface fetchedPostData {
  userId: string; // uid
  email: string; // 이메일
  nickname: string; // 닉네임
  content: string; // 글 내용
  images: { url: string; fileName: string }[]; // 첨부 이미지 
  likeCount: number;
  commentCount: number;
  createdAt: Date
}

export interface Feed {
  id: string;
  nickname: string;
  email: string;
  userId: string;
  content: string;
  images: {
    fileName: string;
    url: string;
  }[];
}

export interface UserState {
  uid: string | null;
  email: string | null;
  nickname: string | null;
  bio: string | null;
  follower: number | null;
  following: number | null;
  profileImage: string | null;
  setUser: (user: Partial<UserState>) => void;
}