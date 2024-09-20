'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard'; // 프로필 카드 컴포넌트 import

const FollowingList = () => {
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const response = await axios.get('/api/following');
      setFollowing(response.data);
    };
    fetchFollowing();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {following.length > 0 ? (
        following.map((user) => (
          <ProfileCard
            key={user.id}
            profileImage={user.profileImage}
            nickname={user.nickname}
            isFollowing={user.isFollowing}
            userId={user.id}
          />
        ))
      ) : (
        <p>팔로잉한 유저가 없습니다.</p>
      )}
    </div>
  );
};

export default FollowingList;
