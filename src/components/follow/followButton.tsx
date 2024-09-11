'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { authStore } from '../../states/store'; // 사용자의 정보를 가져오는 store
import { useModalStore } from '../../states/store';

type FollowButtonProps = {
  targetUserId: string; // 팔로우할 사용자의 ID
  isFollowing: boolean; // 초기 팔로우 상태
};

const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, isFollowing }) => {
  const queryClient = useQueryClient();
  const { email: followerUserID } = authStore(); // 로그인한 사용자 정보
  const [following, setFollowing] = useState(isFollowing); // 현재 팔로우 상태 관리
  const { closeModal } = useModalStore();

	const followMutation = useMutation({
		mutationFn: async () => {
			return await axios.post('/api/follow', { followingUserID: targetUserId, followerUserID });
		},
		onMutate: async () => {
			// 'user'와 targetUserId를 queryKey로 사용하는 것 확인
			await queryClient.cancelQueries({ queryKey: ['user', targetUserId] });
			setFollowing(true); // 낙관적 업데이트
		},
		onError: (error) => {
			console.error('팔로우 중 오류 발생:', error);
			setFollowing(false); // 오류 시 복구
		},
		onSettled: () => {
			// 'user'와 targetUserId를 queryKey로 invalidateQueries 호출
			queryClient.invalidateQueries({ queryKey: ['user', targetUserId] });
		},
	});
	

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      return await axios.delete('/api/follow', { data: { followingUserID: targetUserId, followerUserID } });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', targetUserId] });
      setFollowing(false); // 낙관적 업데이트
    },
    onError: (error) => {
      console.error('언팔로우 중 오류 발생:', error);
      setFollowing(true); // 오류 시 복구
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', targetUserId] });
    },
  });

  const handleFollowClick = () => {
    if (following) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <button
      onClick={handleFollowClick}
      className={`px-4 py-2 text-white rounded ${
        following ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {following ? '언팔로우' : '팔로우'}
    </button>
  );
};

export default FollowButton;
