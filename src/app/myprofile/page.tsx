'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { authStore } from '../../states/store';
import { fetchFollowCounts } from '../../lib/api/followApi';
import { ScrollArea } from '../../components/ui/feed-scroll-area';
import { fetchUserFeeds } from '../../lib/api/feedApi';
import ProfileInfo from '../../components/profile/feedprofile';
import FeedItem from '../../components/feed/feedItem';
import Sibar from '../../components/sidebar/new-neo-sidebar';
import Spinner from '../../components/ui/spinner';
import MainProfile from '../../components/profile/mainprofile';

// Skeleton 컴포넌트: 실제 UI와 동일한 구조로 스켈레톤 구현
const SkeletonProfileInfo = () => (
  <div className="p-5 flex items-center">
    <div className="w-16 h-16 bg-gradient-custom bg-custom rounded-full animate-shimmer"></div>
    <div className="ml-4 flex flex-col">
      <div className="w-32 h-6 bg-gradient-custom bg-custom animate-shimmer rounded-md mb-2"></div>
      <div className="w-48 h-4 bg-gradient-custom bg-custom animate-shimmer rounded-md"></div>
    </div>
  </div>
);

const SkeletonFeedItem = () => (
  <div className="p-4 bg-white rounded-lg shadow-md mb-4">
    <div className="flex items-center mb-2">
      <div className="w-10 h-10 bg-gradient-custom bg-custom rounded-full animate-shimmer"></div>
      <div className="ml-4">
        <div className="w-24 h-6 bg-gradient-custom bg-custom animate-shimmer rounded-md"></div>
      </div>
    </div>
    <div className="w-full h-4 bg-gradient-custom bg-custom animate-shimmer mb-2"></div>
    <div className="w-full h-4 bg-gradient-custom bg-custom animate-shimmer mb-2"></div>
    <div className="w-full h-24 bg-gradient-custom bg-custom animate-shimmer rounded-md"></div>
  </div>
);

const MyProfilePage = () => {
  const { email, nickname, bio, profileImage } = useStore(authStore);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // 프로필 로딩 상태

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 팔로워 및 팔로잉 수를 가져오기 위한 useEffect
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (email) {
          const { followerCount, followingCount } = await fetchFollowCounts(email);
          setFollowerCount(followerCount);
          setFollowingCount(followingCount);
          console.log('팔로우 불러오기 작업 실행됨')
        }
      } catch (error) {
        console.error('팔로워 및 팔로잉 수를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoadingProfile(false); // 프로필 로딩 완료
      }
    };

    if (email) {
      fetchCounts();
    }
  }, [email]);

  // 유저 피드 데이터 불러오기
  const { data: feedData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['feeds', email],
    queryFn: ({ pageParam = null }) => fetchUserFeeds(email as string, pageParam),
    getNextPageParam: (lastPage) => {
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    enabled: !!email,
    initialPageParam: null,
  });

  const feeds = feedData?.pages.flatMap((page) => page.feeds) || [];

  useEffect(() => {
    if (!email) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: '0px', threshold: 0.1 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, email]);

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
        <div className="w-[40%] min-w-[500px] h-[100%] justify-center">
          <Sibar />
          <div className="p-5">
            <SkeletonProfileInfo />
          </div>
          <ScrollArea ref={scrollRef} className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto">
            {Array(3)
              .fill(0)
              .map(() => (
                <SkeletonFeedItem key={crypto.randomUUID()} />
              ))}
          </ScrollArea>
        </div>
      </div>
    );
  }


  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] h-[100%] justify-center">
        <Sibar />
        <MainProfile
          email={email}
          nickname={nickname}
          bio={bio || ''}
          follower={followerCount}
          following={followingCount}
          profileImage={profileImage}
          isCurrentUser={true}
        />
        <ScrollArea ref={scrollRef} className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto">
          {feeds.map((feed) => (
            <FeedItem
              key={feed.postId}
              profileImage={profileImage}
              postId={feed.postId}
              nickname={nickname}
              userId={email}
              content={feed.content}
              images={feed.images}
              time={feed.createdAt}
              commentCount={feed.commentCount}
              likeCount={feed.likeCount}
            />
          ))}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center p-10">
              <Spinner />
            </div>
          )}
          <div ref={loadMoreRef} className="h-1" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default MyProfilePage;
