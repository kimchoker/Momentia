'use client';

import React, { useEffect, useState } from 'react';
import FeedTabs from '../../components/feed/feedTabs';
import FeedList from '../../components/feed/feedList';
import Sibar from '../../components/sidebar/new-neo-sidebar';

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      alert('로그인이 필요합니다.');
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-[#f0f4f8] font-sans">
      <Sibar />

      <div className="flex flex-col w-full max-w-[700px] h-[100%] overflow-y-visible">
        {/* 탭 UI */}
        <FeedTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

        {/* 피드 리스트 */}
        {userData && <FeedList selectedTab={selectedTab} userData={userData} />}
      </div>
    </div>
  );
};

export default Home;
