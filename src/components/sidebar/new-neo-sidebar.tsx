"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SquarePen, Users, Settings, MessageSquare, Bell, ChevronLeft, LogIn, LogOut, Home } from "lucide-react";
import { Button } from "../ui/button";
import { PostModalDialog, PostModalDialogContent } from "../../components/feed/PostModal"
import { useSidebarToggle, useModalStore, authStore } from "../../states/store";
import { useStore } from "zustand";
import { usePathname } from "next/navigation";
import { fetchProfile } from "../../lib/api/userApi";
import WritingComponent from "./../feed/PostWriting";
import Link from "next/link";
import useMediaQuery from "../../hooks/useMediaQuery";
import Image from "next/image";
import Modal from "../feed/modal";

const Sibar = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isModalOpen, closeModal, openModal, modalContent, setModalContent } = useModalStore();
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const invisibleRoutes = ["/login", "/signup"];
  const showSidebar = !invisibleRoutes.includes(currentPath);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");  // 모바일 화면 감지

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { isLoggedIn: storeIsLoggedIn } = useStore(authStore);

  useEffect(() => {
    setIsLoggedIn(storeIsLoggedIn);
  }, [storeIsLoggedIn]);

  const handleLogin = () => {
    if (isLoggedIn) {
      authStore.getState().logout();
    } else {
      router.push("/login");
    }
  };

  const handleProfile = async () => {
    await fetchProfile();
    const email = authStore.getState().email;
    if (email) {
      router.push(`/profile/${email}`);
    } else {
      alert("로그인이 필요한 작업입니다.");
      router.push("/login");
    }
  };

  const handleNotification = async () => {
    const email = authStore.getState().email;
    const isLoggedIn = authStore.getState().isLoggedIn;

    if (email && isLoggedIn) {
      router.push(`/notification`);
    } else {
      alert("로그인이 필요한 작업입니다.");
      router.push("/login");
    }
  };

  const handleNewPost = () => {
    setModalContent(<WritingComponent />);
    openModal();
  };

  const openModalex = () => setIsOpen(true);
  const closeModalex = () => setIsOpen(false);

  if (!sidebar || !showSidebar) return null;

  return isMobile ? (
    // 모바일 화면에서의 하단바
    <div className="fixed bottom-0 left-0 z-20 w-full bg-white shadow-lg flex justify-between items-center p-4">
      <Button variant="ghost" onClick={() => router.push("/")} className="flex flex-col items-center text-[#414868]">
        <Home size={24} className="text-[#414868]" />
      </Button>

      <Button variant="ghost" onClick={handleNotification} className="flex flex-col items-center text-[#414868]">
        <Bell size={24} className="text-[#414868]" />
      </Button>

      <Button variant="ghost" onClick={handleProfile} className="flex flex-col items-center text-[#414868]">
        <Users size={24} className="text-[#414868]" />
      </Button>

      <Button variant="ghost" onClick={openModal} className="flex flex-col items-center text-[#414868]">
        <Settings size={24} className="text-[#414868]" />
      </Button>

      {/* 글쓰기 버튼 (우측 상단 고정, 검정색 원형) */}
      <Button
        onClick={handleNewPost}
        className="fixed right-5 bottom-24 bg-black text-white rounded-full w-14 h-14 p-3 text-[#414868]"
        variant="ghost"
      >
        <SquarePen size={24} className="text-[#414868]" />
      </Button>

      {/* 모달 */}
      <PostModalDialog open={isModalOpen} onOpenChange={closeModal}>
        <PostModalDialogContent>{modalContent}</PostModalDialogContent>
      </PostModalDialog>
    </div>
  ) : (
    // 데스크탑에서의 사이드바
    <aside
      className={`fixed top-0 left-0 z-20 h-screen transition-[width, transform] ease-in-out duration-300 bg-white ${!isOpen ? "w-[90px]" : "w-72"} ${
        isOpen ? "translate-x-0" : "lg:translate-x-0"
      }`}
    >
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 border-none overflow-x-hidden justify-start">
        <PostModalDialog open={isModalOpen} onOpenChange={closeModal}>
          <PostModalDialogContent>{modalContent}</PostModalDialogContent>
        </PostModalDialog>

        <Modal isOpen={isOpen} onClose={closeModal} title="Modal Title">
        <p>This is the modal content area. You can put anything here.</p>
        </Modal>

        <div className="absolute top-[10px] -right-[0px] z-20">
          <Button
            onClick={() => setIsOpen((prevState) => !prevState)}
            className="rounded-md w-8 h-8 border-none border-opacity-0 text-[#414868]"
            variant="outline"
            size="icon"
          >
            <ChevronLeft className={`h-4 w-4 text-[#414868] transition-transform ease-in-out duration-700 ${!isOpen ? "rotate-180" : "rotate-0"}`} />
          </Button>
        </div>

        <Button className={`transition-all ease-in-out duration-500 text-[#414868] ${isOpen ? "mb-12 mt-8" : "mb-6 mt-8"} ${isOpen ? "translate-x-1" : "translate-x-0"}`} variant="link" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={isOpen ? "/images/Logo.png" : "/images/Logo2.png"} // isOpen에 따라 다른 이미지 로드
              alt="Logo"
              width={128} // 너비 설정
              height={128} // 높이 설정
            />
          </Link>
        </Button>

        <Button variant="ghost" onClick={handleNewPost} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3 text-[#414868]`}>
          <span className={`${isOpen === false ? "" : "mr-4"}`}>
            <SquarePen size={18} className="text-[#414868]" />
          </span>
          <p className={`max-w-[200px] truncate text-[#414868] ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>글쓰기</p>
        </Button>

        <Button variant="ghost" onClick={openModal} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3 text-[#414868]`}>
          <span className={`${isOpen === false ? "" : "mr-4"}`}>
            <MessageSquare size={18} className="text-[#414868]" />
          </span>
          <p className={`max-w-[200px] truncate text-[#414868] ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>메시지</p>
        </Button>

        <Button variant="ghost" onClick={handleNotification} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3 text-[#414868]`}>
          <span className={`${isOpen === false ? "" : "mr-4"}`}>
            <Bell size={18} className="text-[#414868]" />
          </span>
          <p className={`max-w-[200px] truncate text-[#414868] ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>알림</p>
        </Button>

        <Button variant="ghost" onClick={handleProfile} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3 text-[#414868]`}>
          <span className={`${isOpen === false ? "" : "mr-4"}`}>
            <Users size={18} className="text-[#414868]" />
          </span>
          <p className={`max-w-[200px] truncate text-[#414868] ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>프로필</p>
        </Button>

        <Button variant="ghost" onClick={openModal} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3 text-[#414868]`}>
          <span className={`${isOpen === false ? "" : "mr-4"}`}>
            <Settings size={18} className="text-[#414868]" />
          </span>
          <p className={`max-w-[200px] truncate text-[#414868] ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>계정 설정</p>
        </Button>

        <Button onClick={handleLogin} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mt-5 fixed bottom-5 text-[#414868]`} variant="ghost">
          <span className={`${isOpen ? "mr-4" : ""}`}>{isLoggedIn ? <LogOut size={18} className="text-[#414868]" /> : <LogIn size={18} className="text-[#414868]" />}</span>
          <p className={`whitespace-nowrap text-[#414868] ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>{isLoggedIn ? "로그아웃" : "로그인"}</p>
        </Button>
      </div>
    </aside>
  );
};

export default Sibar;
