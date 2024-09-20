'use client';
import React from 'react';
import FollowButton from './followButton';

interface ProfileCardProps {
  profileImage: string;
  nickname: string;
  isFollowing: boolean;
  userId: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profileImage, nickname, isFollowing, userId }) => {
  return (
    <div className="flex items-center w-full p-4 border-b border-gray-200">
      <img
        src={profileImage}
        alt={`${nickname} 프로필`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 ml-4">
        <p className="font-bold">{nickname}</p>
      </div>
      <FollowButton targetUserId={userId} isFollowing={isFollowing} />
    </div>
  );
};

export default ProfileCard;
