"use client"
import Link from "next/link";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Menu } from "./admin-panel/menu";
import { PanelsTopLeft, Swords } from "lucide-react";
import { useSidebarToggle } from "../../states/store";
import { SidebarToggle } from "./admin-panel/sidebar-toggle";
import { useStore } from "zustand";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  PostModalDialog,
  PostModalDialogTrigger,
  PostModalDialogContent,
  PostModalDialogHeader,
  PostModalDialogFooter,
  PostModalDialogTitle,
  PostModalDialogDescription,
  PostModalDialogAction,
  PostModalDialogCancel,
} from "../feed/PostModal"

export function Sidebar() {
  const currentPath = usePathname();

  const invisibleRoutes = ["/login", "/signup"];
  const showSidebar = !invisibleRoutes.includes(currentPath)
  const sidebar = useStore(useSidebarToggle, (state) => state);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleMenuClick = (href :string) => {
    if (href === "/newpost") {
      setIsModalOpen(true); // 모달 열기
      console.log("씨빨")
    } else {
      router.push(href); // 페이지 이동
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  if(!sidebar || !showSidebar) return null;


  return (
    
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <PostModalDialog open={true} onOpenChange={setIsModalOpen}>
              <PostModalDialogContent>
                <PostModalDialogHeader>
                  <PostModalDialogTitle>{"새 글 쓰기"}</PostModalDialogTitle>
                  <PostModalDialogDescription>
                    
                  </PostModalDialogDescription>
                </PostModalDialogHeader>
                <PostModalDialogFooter>
                  <PostModalDialogCancel onClick={closeModal}>Cancel</PostModalDialogCancel>
                  <PostModalDialogAction>Continue</PostModalDialogAction>
                </PostModalDialogFooter>
              </PostModalDialogContent>
        </PostModalDialog>
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 border-none">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/" className="flex items-center gap-2">
            <Swords className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              
            </h1>
          </Link>
        </Button>
        
        <Menu isOpen={sidebar?.isOpen} onMenuItemClick={handleMenuClick}/>
      </div>
    </aside>
  );
}
