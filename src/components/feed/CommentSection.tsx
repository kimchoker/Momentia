'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchComments,
  createComment,
  deleteCommentApi,
} from '../../lib/api/feedApi';
import CommentComponent from '../feed/CommentComponent';

const CommentSection = ({ postId }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } else {
      alert('로그인이 필요합니다.');
    }
  }, []);

  // 댓글 불러오기
  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const fetchedComments = await fetchComments(postId);
      return Array.isArray(fetchedComments) ? fetchedComments : [];
    },
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
    if (!commentText.trim()) {
      console.error('댓글 내용이 비어 있습니다.');
      return;
    }
    if (!userData?.email) {
      alert('로그인이 필요합니다.');
      return;
    }
    const newComment = { postId, content: commentText, userId: userData.email };
    createCommentMutation.mutate(newComment);
    setCommentText('');
  };

  return (
    <div>
      <div className="mt-4 flex items-center space-x-2 w-full">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-grow p-2 m-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <button
          onClick={handleCommentSave}
          className="w-6 h-6 bg-black text-white rounded-full transition-all hover:bg-[#d6d6d6] m-2"
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
              currentUserId={userData?.email || ''} // userData가 null일 때 대비
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
          ))
        ) : (
          <p className="text-gray-400 text-center">댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
