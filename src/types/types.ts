import { Timestamp } from 'firebase/firestore';
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
  follower: number | null;
  following: number | null;
  profileImage: string | null;
  login: (token: string) => void;
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
  setNickname: (nickname: string) => void;
  setBio: (bio: string) => void;
  setProfileImage: (profileImage: string) => void;
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
  fcmToken: string;
}

// layout.tsx 설정용
export interface LayoutProps {
  children: ReactNode;
}

// 글쓰기/수정 모달 상태 관리용
export interface ModalState {
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  modalTitle: string;
  openModal: () => void;
  closeModal: () => void;
  setModalContent: (content: ReactNode) => void;
  setModalTitle: (title: string) => void;
}

export interface DrawerState {
  isEditOpen: boolean;
  openEdit: () => void;
  closeEdit: () => void;
}

// 글쓰기 관련 타입
export interface PostData {
  userId: string; // uid
  email: string; // 이메일
  content: string; // 글 내용
  images: { url: string; fileName: string }[]; // 첨부 이미지
  likeCount: number;
  commentCount: number;
}

export interface post {
  postId: string; // 글 식별값
  nickname: string; // 닉네임
  email: string; // 이메일
  userId: string; // uid
  content: string; // 글 내용
  profileImage: string;
  images: {
    fileName: string;
    url: string;
  }[];
  likeCount: number;
  commentCount: number;
  createdAt: string | Timestamp;
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

export interface imageArray {
  url: string;
  fileName: string;
}

export interface UpdatePostData {
  content: string;
  images: { url: string; fileName: string }[];
}

export interface comment {
  userId: string;
  postId: string;
  content: string;
  createdAt: string | Timestamp;
  nickname: string;
  profileImage: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment';
  content: string;
  user: string;
  postId?: string;
  commentId?: string;
  createdAt: string;
}

// 프로필 관련
export interface MainProfileProps {
  email: string;
  nickname: string;
  bio?: string;
  follower?: number;
  following?: number;
  profileImage?: string;
  isCurrentUser: boolean;
}
