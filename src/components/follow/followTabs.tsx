"use client"
import React, { useState } from 'react';
import FollowerList from './followerList';
import FollowingList from './followingList';

const FollowTabs = () => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveTab('followers')}
          className={`px-4 py-2 ${activeTab === 'followers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          팔로워
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 ${activeTab === 'following' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          팔로잉
        </button>
      </div>
      <div>
        {activeTab === 'followers' ? <FollowerList /> : <FollowingList />}
      </div>
    </div>
  );
};

export default FollowTabs;
