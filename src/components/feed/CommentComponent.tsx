"use client";
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

const CommentComponent = ({ postId, userId, nickname, currentUserId, comment, createdAt, commentId }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('댓글이 성공적으로 삭제되었습니다.');
      } else {
        console.error('Failed to delete comment:', await response.text());
        alert('댓글 삭제 실패');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('댓글 삭제 중 오류 발생');
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile/${userId}`);
  };

  const formattedCreatedAt = new Date(createdAt).toLocaleString();

  return (
    <div className="flex flex-row items-start p-2">
      <Avatar onClick={handleProfileClick} className="cursor-pointer">
        <AvatarImage src="https://via.placeholder.com/40" /> {/* 댓글 작성자 프로필 이미지 */}
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col ml-3">
        <p className="font-bold">{nickname}</p>
        <p className="text-xs text-gray-500">{userId}</p> {/* 회색 글씨로 ID 표시 */}
        <p className="text-xs text-gray-400 mt-1">{formattedCreatedAt}</p> {/* 작성 시간 표시 */}
        <p>{comment}</p> {/* 댓글 내용 표시 */}
      </div>
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
