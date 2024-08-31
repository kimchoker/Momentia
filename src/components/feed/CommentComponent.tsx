"use client";
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { authStore } from '../../states/store';
import { X } from 'lucide-react';

const CommentComponent = ({ comment, currentUserId }) => {
  const { nickname, userId, text } = comment;

  const handleDelete = () => {
    // 댓글 삭제 로직을 추가하세요
    console.log("댓글 삭제:", text);
  };

  return (
    <div className="flex flex-row items-center p-2 border-b border-gray-300">
      <Avatar>
        <AvatarImage src="https://via.placeholder.com/40" /> {/* 댓글 작성자 프로필 이미지 */}
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col ml-3">
        <p className="font-bold">{nickname}</p>
        <p className="text-xs">{userId}</p>
      </div>
      <p className="ml-4">{text}</p>
      {/* 삭제 버튼 - 댓글 작성자와 현재 로그인 한 사용자가 같을 때만 표시 */}
      {currentUserId === userId && (
        <button
          onClick={handleDelete}
          className="ml-auto p-1 text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CommentComponent;
