'use client';
import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { authStore } from '../../states/store';
import CommentComponent from './CommentComponent';
import axios from 'axios';

// 댓글 가져오기 함수
const fetchComments = async (postId) => {
  const response = await axios.get(`/api/comments?postId=${postId}`);
  return response.data;
};

// 댓글 작성 함수
const createComment = async (newComment) => {
  const response = await axios.post('/api/comments', newComment);
  return response.data;
};

// 댓글 삭제 함수
const deleteCommentApi = async ({ commentId, postId }) => {
  return await axios.delete(`/api/comments?commentId=${commentId}&postId=${postId}`);
};

const CommentSection = ({ postId }) => {
  const queryClient = useQueryClient();
  const { email, isLoggedIn } = authStore();
  const [commentText, setCommentText] = useState("");

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
      setCommentText("");
      return;
    }
    const newComment = { postId, content: commentText, userId: email };
    createCommentMutation.mutate(newComment);
    setCommentText("");
  };

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleCommentSave();
		}
	};

  if (isLoading) {
    return (
			<div className="flex justify-center items-center h-32">
					<ClipLoader color="#000" size={50} /> {/* 로딩 스피너 */}
			</div>
		)
  }

  return (
    <div>
      <div className="comment-input flex">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
					onKeyDown={handleKeyDown}
          placeholder="댓글을 입력하세요"
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleCommentSave} className="px-1 py-1 bg-black text-white rounded-full transition-all hover:bg-[#d6d6d6]">
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
            currentUserId={email}
            userId={comment.userId}
            nickname={comment.nickname}
            comment={comment.content}
            createdAt={comment.createdAt}
            onDelete={() => deleteCommentMutation.mutate({ commentId: comment.id, postId })}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
