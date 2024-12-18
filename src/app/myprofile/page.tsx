'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowCounts } from '../../lib/api/followApi';
import { ScrollArea } from '../../components/ui/feed-scroll-area';
import { fetchUserFeeds } from '../../lib/api/feedApi';
import FeedItem from '../../components/feed/feedItem';
import Sibar from '../../components/sidebar/new-neo-sidebar';
import Spinner from '../../components/ui/spinner';
import MainProfile from '../../components/profile/mainprofile';

// Skeleton 컴포넌트: 실제 UI와 동일한 구조로 스켈레톤 구현
function SkeletonProfileInfo() {
  return (
    <div className="p-5 flex items-center">
      <div className="w-16 h-16 bg-gradient-custom bg-custom rounded-full animate-shimmer" />
      <div className="ml-4 flex flex-col">
        <div className="w-32 h-6 bg-gradient-custom bg-custom animate-shimmer rounded-md mb-2" />
        <div className="w-48 h-4 bg-gradient-custom bg-custom animate-shimmer rounded-md" />
      </div>
    </div>
  );
}

function SkeletonFeedItem() {
  return (
    <div className="relative w-full sm:w-[90%] md:w-[90%] h-[400px] bg-gray-200 rounded-2xl shadow-lg overflow-hidden ml-3 mt-3">
      {/* Overlay for shimmer effect */}
      <div className="absolute inset-0 bg-gray-300 animate-pulse" />

      {/* User profile and time skeleton */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
        <div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse" />
        <div>
          <div className="w-24 h-4 bg-gray-400 rounded-md animate-pulse mb-1" />
          <div className="w-16 h-3 bg-gray-400 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Comments and likes skeleton */}
      <div className="absolute top-3 right-3 flex items-center space-x-2 z-10 text-gray-400">
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" />
        <div className="w-6 h-4 bg-gray-400 rounded-md animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="absolute bottom-10 left-3 text-white z-10">
        <div className="w-[200px] h-6 bg-gray-400 rounded-md animate-pulse mb-2" />
        <div className="w-[150px] h-6 bg-gray-400 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

function MyProfilePage() {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // 프로필 로딩 상태
  const [userData, setUserData] = useState(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true); // 유저 데이터 로딩 상태 추가
  const [totalFeedCount, setTotalFeedCount] = useState(0); // 전체 피드 수 상태 추가

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } else {
      alert('로그인이 필요합니다.');
      // 필요하다면 로그인 페이지로 리다이렉트
      // router.push('/login');
    }
    setIsUserDataLoading(false); // 유저 데이터 로딩 완료
  }, []);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 팔로워 및 팔로잉 수를 가져오기 위한 useEffect
  useEffect(() => {
    if (isUserDataLoading || !userData?.email) return;

    const fetchCounts = async () => {
      try {
        const { followerCount, followingCount } = await fetchFollowCounts(
          userData.email,
        );
        setFollowerCount(followerCount);
        setFollowingCount(followingCount);
      } catch (error) {
        console.error('팔로워 및 팔로잉 수를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoadingProfile(false); // 프로필 로딩 완료
      }
    };

    fetchCounts();
  }, [isUserDataLoading, userData?.email]);

  // 유저 피드 데이터 불러오기
  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feeds', userData?.email],
    queryFn: ({ pageParam = null }) =>
      fetchUserFeeds(userData?.email as string, pageParam),
    getNextPageParam: (lastPage) => {
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    enabled: !!userData?.email,
    initialPageParam: null,
  });

  const feeds = feedData?.pages.flatMap((page) => page.feeds) || [];

  // 전체 피드 수 업데이트
  useEffect(() => {
    if (feedData?.pages?.length) {
      const totalFeeds = feedData.pages[0]?.totalFeeds;
      setTotalFeedCount(totalFeeds);
    }
  }, [feedData]);

  useEffect(() => {
    if (!userData?.email || feeds.length >= totalFeedCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: '0px', threshold: 0.1 },
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    userData?.email,
    feeds.length,
    totalFeedCount,
  ]);

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
        <div className="w-[40%] min-w-[500px] h-[100%] justify-center">
          <Sibar />
          <div className="p-5">
            <SkeletonProfileInfo />
          </div>
          <ScrollArea
            ref={scrollRef}
            className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
          >
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
          email={userData.email}
          nickname={userData.nickname}
          bio={userData.bio || ''}
          follower={followerCount}
          following={followingCount}
          profileImage={userData.profileImage}
          isCurrentUser
        />
        <ScrollArea
          ref={scrollRef}
          className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
        >
          {feeds.map((feed) => (
            <FeedItem
              key={feed.postId}
              profileImage={userData.profileImage}
              postId={feed.postId}
              nickname={userData.nickname}
              userId={userData.email}
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
}

export default MyProfilePage;
