"use client"
import { useRef, useState, useEffect } from 'react';
import MainProfile from '../../../components/profile/mainprofile';
import { ScrollArea } from '../../../components/ui/feed-scroll-area';
import Cookies from 'js-cookie';

const MyPage = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if(scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] bg-[#d6d6d6]">
        <MainProfile/>
        <ScrollArea ref={scrollRef} className="w-full h-[calc(100vh-210px)] overflow-auto">
        </ScrollArea>
      </div>
    </div>
  );
};

export default MyPage;
