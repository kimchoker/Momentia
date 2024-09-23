'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard'; // 프로필 카드 컴포넌트 import

const FollowingList = ({ email }) => {
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const response = await axios.get(`/api/follow/list?email=${email}&type=following`);
      setFollowing(response.data);
    };
    fetchFollowing();
  }, [email]);

  return (
    <div className="flex flex-col items-center">
      {following.length > 0 ? (
        following.map((user) => (
          <ProfileCard
            key={user.id}
            profileImage={user.profileImage}
            nickname={user.nickname}
            isFollowing={true} // 팔로잉 리스트이므로 기본적으로 팔로잉 상태
            userId={user.followingUserId} // followingUserId 사용
          />
        ))
      ) : (
        <p>팔로잉한 유저가 없습니다.</p>
      )}
    </div>
  );
};

export default FollowingList;
