import React from 'react';
import AvatarProfile from '../profile/AvatarProfile';

const FeedHeader = ({ nickname, userId, profileImage, time }) => {
  const createdAt = new Date(time);
  const formattedTime = `${createdAt.getFullYear() % 100}년 ${
    createdAt.getMonth() + 1
  }월 ${createdAt.getDate()}일 ${createdAt.getHours()}시 ${createdAt.getMinutes()}분`;

  return (
    <div className="flex justify-between items-center mb-4">
      <AvatarProfile
        nickname={nickname}
        userId={userId}
        profileImage={profileImage}
      />
      <p className="text-gray-500 text-sm">{formattedTime}</p>
    </div>
  );
};

export default FeedHeader;
