"use client"
import { useRef, useState, useEffect } from 'react';
import MainProfile from '../../../components/profile/mainprofile';
import { ScrollArea } from '../../../components/ui/feed-scroll-area';
import Cookies from 'js-cookie';
import { Button } from '../../../components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../../components/ui/drawer"
import { profileEditStore } from '../../../states/store';

const MyPage = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { isEditOpen, closeEdit } = profileEditStore();

  const scrollToTop = () => {
    if(scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }


  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] bg-[#d6d6d6] justify-center">
      <Drawer open={isEditOpen}>
        <DrawerContent className=''>
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

        <MainProfile/>
        <ScrollArea ref={scrollRef} className="w-full h-[calc(100vh-160px)] overflow-auto">
        </ScrollArea>
      </div>
    </div>
  );
};

export default MyPage;
