"use client";
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { deleteComment } from '../../lib/api/feedApi';

const CommentComponent = ({ postId, userId, nickname, currentUserId, comment, createdAt, profileImage, commentId, onDelete }) => {
  const router = useRouter();

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, postId);  // API 호출
      alert('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile/${userId}`);
  };

  const createdAtorg = new Date(createdAt);
  const formattedCreatedAt = `${createdAtorg.getFullYear() % 100}년 ${createdAtorg.getMonth() + 1}월 ${createdAtorg.getDate()}일 ${createdAtorg.getHours()}시 ${createdAtorg.getMinutes()}분`;

  return (
    <div className="flex flex-row items-start p-2">
      <Avatar onClick={handleProfileClick} className="cursor-pointer">
        <AvatarImage src={profileImage} /> {/* 댓글 작성자 프로필 이미지 */}
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col ml-3 flex-grow">
        <div className="flex justify-between items-center"> 
          <p className="font-bold">{nickname}</p>
          <p className="text-xs text-gray-400">{formattedCreatedAt}</p> 
        </div>
        <p className="text-xs text-gray-500 mb-2">{userId}</p> 
        <p>{comment}</p> {/* 댓글 내용 표시 */}
      </div>
      {currentUserId === userId && (
        <button
          onClick={() => handleDeleteComment(commentId)}
          className="ml-auto p-1 text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CommentComponent;
