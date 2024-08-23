"use client"
import { useRef, useCallback } from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Sibar from '../../components/new-neo-sidebar';
const Sibal = () => {
  

  return (
    <div className="flex justify-center items-center h-screen bg-[#ffffff] font-nanum-barun-gothic relative">
      <Sibar/>
      <div className='bg-black w-10 h-20'></div>
    </div>
  );
};

export default Sibal;