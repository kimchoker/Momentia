"use client";

import Link from "next/link";
import { Ellipsis, LogOut, LogIn, SquarePen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../../lib/utils";
import { getMenuList } from "../../../lib/menu-list";
import { Button } from "../../ui/button";
import { CollapseMenuButton } from "./collapse-menu-button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../ui/tooltip";
import { authStore } from "../../../states/store";
import { useState, useEffect } from "react";
import { useModalStore } from "../../../states/store";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const router = useRouter();
  const { openModal } = useModalStore();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 상태를 읽도록 설정
    const { isLoggedIn } = authStore.getState();
    setIsLoggedIn(isLoggedIn);
  }, []);

  const handleUserState = () => {
    if (isLoggedIn) {
      authStore.getState().logout();
    } else {
      router.push('/login');
    }
  };

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(prevState => !prevState);
  }

  return (
    
      <nav className="mt-8 h-screen w-full overflow-hidden">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2 overflow-hidden">

        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant={isClicked ? "secondary" : "ghost"}
                onClick={openModal}
                className={cn(isOpen ? "w-[248px]" : "w-[50px]", "justify-start h-10 mb-1")}
              >
                <span className={cn(isOpen === false ? "" : "mr-4")}>
                  <SquarePen size={18} />
                </span>
                <p className={cn("max-w-[200px] truncate", isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100")}>
                  Create New Post
                </p>
              </Button>
            </TooltipTrigger>
            {isOpen === false && <TooltipContent side="right">Create New Post</TooltipContent>}
          </Tooltip>
        </TooltipProvider>




          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end mb-5">
            <Button
              onClick={handleUserState}
              className="w-full justify-center h-10 mt-5"
              variant="ghost"
            >
              <span className={cn(isOpen ? "mr-4" : "")}>
                {isLoggedIn ? <LogOut size={18} /> : <LogIn size={18} />}
              </span>
              <p className={cn("whitespace-nowrap", isOpen ? "opacity-100" : "opacity-0 hidden")}>
                {isLoggedIn ? "Sign out" : "Sign in"}
              </p>
            </Button>
          </li>
        </ul>
      </nav>
    
  );
}
