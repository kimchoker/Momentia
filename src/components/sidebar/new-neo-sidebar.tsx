"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swords, SquarePen, Users, Settings, MessageSquare, Bell, ChevronLeft, LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { PostModalDialog, PostModalDialogContent } from "../../components/feed/PostModal"
import { useSidebarToggle, useModalStore, authStore } from "../../states/store";
import { useStore } from "zustand";
import { usePathname } from "next/navigation";
import { fetchProfile } from "../../lib/api/userApi";
import WritingComponent from "../feed/PostWriting";
import Link from "next/link";


const Sibar= () => {
	const currentPath = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const { isModalOpen, closeModal, openModal, modalContent, setModalContent } = useModalStore();
	const sidebar = useStore(useSidebarToggle, (state) => state);
	const invisibleRoutes = ["/login", "/signup"];
  const showSidebar = !invisibleRoutes.includes(currentPath)
	const router = useRouter();

	const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { isLoggedIn: storeIsLoggedIn } = useStore(authStore);

  useEffect(() => {
    // 클라이언트에서 상태를 가져옵니다.
    setIsLoggedIn(storeIsLoggedIn);
		console.log(isLoggedIn)
  }, [storeIsLoggedIn]);

	
	const handleLogin = () => {
		if(isLoggedIn) {
			authStore.getState().logout();
		} else {
			router.push("/login")
		}
	}

	
	const handleProfile = async () => {
		await fetchProfile();
		
		const email = authStore.getState().email;

		if (email) {
			router.push(`/profile/${email}`);
		} else {
			alert("로그인이 필요한 작업입니다.")
			router.push("/login")
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
		setModalContent(
			<WritingComponent/>
		)
		openModal();
	}


  if(!sidebar || !showSidebar) return null;
	

	return(
		<aside
			className={`fixed top-0 left-0 z-20 h-screen transition-[width, transform] ease-in-out duration-300 bg-white ${!isOpen ? "w-[90px]" : "w-72"} ${isOpen ? "translate-x-0" : "lg:translate-x-0"}`}>

			<div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 border-none overflow-x-hidden ">
				<PostModalDialog open={isModalOpen} onOpenChange={closeModal}>
					<PostModalDialogContent>
						{modalContent}
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
						onClick={handleNewPost}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<SquarePen size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							글쓰기
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
							메시지
						</p>
					</Button>

					<Button
						variant="ghost"
						onClick={handleNotification}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<Bell size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							알림
						</p>
					</Button>

					<Button
						variant="ghost"
						onClick={handleProfile}
						className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mb-3`}
					>
						<span className={`${isOpen === false ? "" : "mr-4"}`}>
							<Users size={18} />
						</span>
						<p className={`max-w-[200px] truncate ${!isOpen ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100"}`}>
							프로필
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
							계정 설정
						</p>
					</Button>
				
				
					
						<Button onClick={handleLogin} className={`${isOpen ? "w-[248px]" : "w-[50px]"} justify-start h-10 mt-5 fixed bottom-5`} variant="ghost">
              <span className={`${isOpen ? "mr-4" : ""}`}>
                {isLoggedIn ? <LogOut size={18} /> : <LogIn size={18} />}
              </span>
              <p className={`whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
                {isLoggedIn ? "로그아웃" : "로그인"}
              </p>
            </Button>

				</div>
				
				
		</aside>
	)
}

export default Sibar;