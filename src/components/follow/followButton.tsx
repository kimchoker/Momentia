'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type FollowButtonProps = {
  targetUserId: string;
  isFollowing: boolean;
};

const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  isFollowing,
}) => {
  const queryClient = useQueryClient();
  const storedUserData = sessionStorage.getItem('userData');
  const userData = JSON.parse(storedUserData);
  const followerUserID = userData.email;
  const [following, setFollowing] = useState(isFollowing);

  const followMutation = useMutation({
    mutationFn: async () =>
      axios.post('/api/follow', {
        followingUserID: targetUserId,
        followerUserID,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', targetUserId] });
      setFollowing(true);
    },
    onError: (error) => {
      console.error('팔로우 중 오류 발생:', error);
      setFollowing(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', targetUserId] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () =>
      axios.delete('/api/follow', {
        data: { followingUserID: targetUserId, followerUserID },
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', targetUserId] });
      setFollowing(false);
    },
    onError: (error) => {
      console.error('언팔로우 중 오류 발생:', error);
      setFollowing(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', targetUserId] });
    },
  });

  const handleFollowClick = () => {
    following ? unfollowMutation.mutate() : followMutation.mutate();
  };

  return (
    <button
      onClick={handleFollowClick}
      className={`px-4 py-2 rounded ${following ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
    >
      {following ? '언팔로우' : '팔로우'}
    </button>
  );
};

export default FollowButton;
