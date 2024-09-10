"use client";
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useRouter } from 'next/navigation';
import { deleteComment } from '../../lib/api/feedApi';
import React, { useState } from 'react';
import { authStore } from '../../states/store';
import { X, ArrowUp } from 'lucide-react'; // 아이콘 추가
import { fetchComments, createComment, deleteCommentApi } from '../../lib/api/feedApi';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

const CommentSection = ({ postId }) => {
  const queryClient = useQueryClient();
  const { email, isLoggedIn } = authStore();
  const [commentText, setCommentText] = useState('');

  // useQuery로 댓글 불러오기
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  // 댓글 작성 Mutation
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  // 댓글 삭제 Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  // 댓글 저장 함수
  const handleCommentSave = () => {
    if (!commentText.trim()) return;
    if (!isLoggedIn || !email) {
      alert('로그인이 필요합니다.');
      setCommentText('');
      return;
    }

    const newComment = { postId, content: commentText, userId: email };
    createCommentMutation.mutate(newComment);
    setCommentText('');
  };

  if (isLoading) {
    return <p>댓글을 불러오는 중...</p>;
  }

  return (
    <div>
      <div className="mt-4 flex items-center space-x-2 w-full"> {/* 댓글 입력 영역 너비 조정 */}
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-grow p-2 m-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full" // 너비 조정
        />
        <button
          onClick={handleCommentSave}
          className="px-1 py-1 w-6 h-6 bg-black text-white rounded-full transition-all hover:bg-[#d6d6d6] m-2"
        >
          <ArrowUp />
        </button>
      </div>

      <div className="comments-list mt-4">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentComponent
              key={comment.id}
              profileImage={comment.profileImage}
              commentId={comment.id}
              postId={postId}
              currentUserId={email}
              userId={comment.userId}
              nickname={comment.nickname}
              comment={comment.content}
              createdAt={comment.createdAt}
              onDelete={() => deleteCommentMutation.mutate({ commentId: comment.id, postId })}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

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

export { CommentComponent, CommentSection };
