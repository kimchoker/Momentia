"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard'; 

const FollowerList = () => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    // API 호출로 팔로워 목록 가져오기
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
