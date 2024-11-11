'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard'; // 프로필 카드 컴포넌트 import

function FollowerList({ email }) {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const response = await axios.get(
        `/api/follow/list?email=${email}&type=followers`,
      );
      setFollowers(response.data);
    };
    fetchFollowers();
  }, [email]);

  return (
    <div className="flex flex-col items-center">
      {followers.length > 0 ? (
        followers.map((user) => (
          <ProfileCard
            key={user.id}
            profileImage={user.profileImage}
            nickname={user.nickname}
            isFollowing={false} // 팔로워 리스트이므로 팔로잉 상태는 알 수 없음
            userId={user.followerUserId} // followerUserId 사용
          />
        ))
      ) : (
        <p>팔로워가 없습니다.</p>
      )}
    </div>
  );
}

export default FollowerList;
