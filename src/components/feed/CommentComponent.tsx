/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

const CommentComponent = ({
  postId,
  userId,
  nickname,
  currentUserId,
  comment,
  createdAt,
  profileImage,
  commentId,
  isDeleting,
  onDelete,
}) => {
  const router = useRouter();

  // 프로필 클릭 핸들러
  const handleProfileClick = () => {
    router.push(`/profile/${userId}`);
  };

  const createdAtObj = new Date(createdAt);
  const formattedCreatedAt = `${createdAtObj.getFullYear() % 100}년 ${
    createdAtObj.getMonth() + 1
  }월 ${createdAtObj.getDate()}일 ${createdAtObj.getHours()}시 ${createdAtObj.getMinutes()}분`;

  return (
    <div className="flex flex-row items-start p-2">
      <Avatar onClick={handleProfileClick} className="cursor-pointer">
        <AvatarImage src={profileImage} alt={`${nickname}의 프로필`} />
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col ml-3 flex-grow">
        <div className="flex justify-between items-center">
          <p className="font-bold">{nickname}</p>
          <p className="text-xs text-gray-400">{formattedCreatedAt}</p>
        </div>
        <p className="text-xs text-gray-500 mb-2">{userId}</p>
        <p>{comment}</p>
      </div>
      {currentUserId === userId && (
        <button
          onClick={onDelete}
          className="ml-auto p-1 text-red-500 hover:text-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? '삭제 중...' : <X className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

export default CommentComponent;
