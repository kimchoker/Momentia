"use client";
import { ScrollArea, ScrollBar } from '../../components/ui/feed-scroll-area';
import { useRef } from 'react';
import MainProfile from '../../components/profile/mainprofile';
import FeedItem from '../../components/feed/feedItem';
import { useState, useEffect } from 'react';

const MyPage = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    console.log('클릭됨')
    if(scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] bg-[#d6d6d6] ">
      
          <MainProfile />

        
        <ScrollArea ref={scrollRef} className="w-full h-[calc(100vh-210px)] overflow-auto">
          <FeedItem/>
          <FeedItem/>
          <FeedItem/>
          <FeedItem/>
          <FeedItem/>
          <FeedItem/>
        </ScrollArea>
      </div>
      
    </div>
  );
};

export default MyPage;
