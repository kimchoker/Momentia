'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import {
  fetchComments,
  createComment,
  deleteCommentApi,
} from '../../lib/api/feedApi';
import { CommentComponent } from './CommentComponent';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [userData, setUserData] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } else {
      alert('로그인이 필요합니다.');
    }
  }, []);

  const { data: comments = [], isInitialLoading: commentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setCommentText('');
    },
    onError: () => {
      alert('댓글 작성 중 오류가 발생했습니다.');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: () => {
      alert('댓글 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleCommentSave = () => {
    if (!commentText.trim() || !userData?.email) return;

    const newComment = {
      postId,
      userID: userData.email,
      content: commentText,
    };

    createCommentMutation.mutate(newComment);
  };

  if (commentsLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#000" size={50} />
      </div>
    );
  }

  return (
    <div>
      <div className="comment-input flex">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleCommentSave}
          className="px-1 py-1 bg-black text-white rounded-full transition-all hover:bg-[#d6d6d6]"
          disabled={createCommentMutation.isPending}
        >
          <ArrowUp />
        </button>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            profileImage={comment.profileImage}
            commentId={comment.id}
            postId={postId}
            currentUserId={userData?.email}
            userId={comment.userId}
            nickname={comment.nickname}
            comment={comment.content}
            createdAt={comment.createdAt}
            onDelete={() =>
              deleteCommentMutation.mutate({ commentId: comment.id, postId })
            }
            isDeleting={
              deleteCommentMutation.isPending &&
              deleteCommentMutation.variables?.commentId === comment.id
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
