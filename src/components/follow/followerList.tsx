'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard'; // 프로필 카드 컴포넌트 import

const FollowerList = () => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const response = await axios.get('/api/followers');
      setFollowers(response.data);
    };
    fetchFollowers();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {followers.length > 0 ? (
        followers.map((follower) => (
          <ProfileCard
            key={follower.id}
            profileImage={follower.profileImage}
            nickname={follower.nickname}
            isFollowing={follower.isFollowing}
            userId={follower.id}
          />
        ))
      ) : (
        <p>팔로워가 없습니다.</p>
      )}
    </div>
  );
};

export default FollowerList;
