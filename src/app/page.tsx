"use client"

import FeedItem from '../components/feed/feedItem';
import { useRef, useCallback } from 'react';
import { ScrollArea } from '../components/ui/scroll-area';

const Home = () => {
  

  return (
    <div className="flex justify-center items-center h-screen bg-[#ffffff] font-nanum-barun-gothic">
      <ScrollArea className="w-[40%] h-[100%] overflow-y-auto">
        
      </ScrollArea>
    </div>
  );
};

export default Home;
