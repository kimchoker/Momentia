'use client';

import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { useMutation, useQuery } from '@tanstack/react-query';
import { likePost, unlikePost, checkLikeStatus } from '../../lib/api/likeApi';

const FeedActions = ({ postId, likeCount, commentCount, user }) => {
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [hasLiked, setHasLiked] = useState(false);

  // 좋아요 상태 가져오기
  const { data: initialLikeStatus } = useQuery({
    queryKey: ['likeStatus', postId, user?.email],
    queryFn: () => checkLikeStatus(postId, user.email),
    enabled: !!user, // user가 있을 때만 실행
    staleTime: 300000, // 5분 동안 캐시 유지
  });

  // 초기 좋아요 상태 설정
  useEffect(() => {
    if (initialLikeStatus !== undefined) {
      setHasLiked(initialLikeStatus);
    }
  }, [initialLikeStatus]);

  // 좋아요 추가 Mutation
  const likeMutation = useMutation({
    mutationFn: () => likePost(postId, user.email),
    onMutate: () => {
      setHasLiked(true); // Optimistic Update
      setCurrentLikeCount((prev) => prev + 1);
    },
    onError: () => {
      setHasLiked(false);
      setCurrentLikeCount((prev) => prev - 1);
    },
  });

  // 좋아요 취소 Mutation
  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(postId, user.email),
    onMutate: () => {
      setHasLiked(false); // Optimistic Update
      setCurrentLikeCount((prev) => prev - 1);
    },
    onError: () => {
      setHasLiked(true);
      setCurrentLikeCount((prev) => prev + 1);
    },
  });

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    hasLiked ? unlikeMutation.mutate() : likeMutation.mutate();
  };

  return (
    <div className="flex items-center justify-between mt-4 text-gray-500">
      <div className="flex items-center space-x-2">
        <button
          className="flex items-center space-x-1 focus:outline-none"
          onClick={handleLikeClick}
        >
          <FaHeart
            className={`text-lg ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}
          />
          <span>{currentLikeCount}</span>
        </button>
        <div className="flex items-center space-x-1">
          <FaComment className="text-lg text-gray-500" />
          <span>{commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedActions;
