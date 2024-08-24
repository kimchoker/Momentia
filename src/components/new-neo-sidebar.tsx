"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swords, SquarePen, Users, Settings, MessageSquare, Bell, ChevronLeft, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import WritingComponent from "./feed/PostWriting";
import { PostModalDialog, PostModalDialogContent, PostModalDialogHeader, PostModalDialogFooter, PostModalDialogTitle, PostModalDialogDescription } from "../components/feed/PostModal"
import { useSidebarToggle, useModalStore } from "../states/store";
import { useStore } from "zustand";
import { authStore } from "../states/store";
import { usePathname } from "next/navigation";



const Sibar= () => {
	const currentPath = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const { isModalOpen, closeModal, openModal } = useModalStore();
	const sidebar = useStore(useSidebarToggle, (state) => state);
	const invisibleRoutes = ["/login", "/signup"];
  const showSidebar = !invisibleRoutes.includes(currentPath)
	const router = useRouter();

	const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { isLoggedIn: storeIsLoggedIn } = useStore(authStore);

  useEffect(() => {
    // 클라이언트에서 상태를 가져옵니다.
    setIsLoggedIn(storeIsLoggedIn);
  }, [storeIsLoggedIn]);

	
	const handleLogin = () => {
		if(isLoggedIn) {
			authStore.getState().logout();
		} else {
			router.push("/login")
		}
	}



  if(!sidebar || !showSidebar) return null;
	

	return(
		<aside
      className={`fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-black" ${!isOpen ? "w-[90px]" : "w-72"} `}>
			<div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 border-none overflow-x-hidden ">
				<PostModalDialog open={isModalOpen} onOpenChange={closeModal}>
					<PostModalDialogContent>
						<PostModalDialogHeader>
							<PostModalDialogTitle></PostModalDialogTitle>
							<div>
								<PostModalDialogDescription>
								</PostModalDialogDescription>
								<WritingComponent/>
							</div>
						</PostModalDialogHeader>
						<PostModalDialogFooter>
						</PostModalDialogFooter>
					</PostModalDialogContent>
				</PostModalDialog>
				<div className=" absolute top-[60px] -right-[0px] z-20">
					<Button
						onClick={() => setIsOpen(prevState => !prevState)}
						className="rounded-md w-8 h-8 border-none border-opacity-0"
						variant="outline"
						size="icon"
					>
						<ChevronLeft
							className={`h-4 w-4 transition-transform ease-in-out duration-700 ${!isOpen ? "rotate-180" : "rotate-0"}`}
						/>
					</Button>
				</div>

				<Button className={`transition-transform ease-in-out duration-300 mb-8 ${isOpen ? "translate-x-1" : "translate-x-0"}`} variant="link" asChild>
						<Link href="/" className="flex items-center gap-2">
							<Swords className="w-6 h-6 mr-1" />
							<h1
								className={`first-line:font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
									${isOpen === false? "-translate-x-96 opacity-0 hidden" : "translate-x-0 opacity-100" }`}>
									Lane
							</h1>
						</Link>
					</Button>

					<Button
						variant="ghost"
						onClick={openModal}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<SquarePen size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							Create New Post
						</p>
					</Button>

					<Button
						variant="ghost"
						onClick={openModal}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<MessageSquare size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							DM
						</p>
					</Button>

					<Button
						variant="ghost"
						onClick={openModal}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<Bell size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							notification
						</p>
					</Button>

					<Button
						variant="ghost"
						onClick={openModal}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<Users size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							My Profile
						</p>
					</Button>

					<Button
						variant="ghost"
						onClick={openModal}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<Settings size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							Account
						</p>
					</Button>
				
				
					
						<Button onClick={handleLogin} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mt-5 fixed bottom-5`} variant="ghost">
              <span className={`${isOpen ? "mr-4" : ""}`}>
                {isLoggedIn ? <LogOut size={18} /> : <LogIn size={18} />}
              </span>
              <p className={`whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
                {isLoggedIn ? "Sign out" : "Sign in"}
              </p>
            </Button>

				</div>
				
				
		</aside>
	)
}

export default Sibar;