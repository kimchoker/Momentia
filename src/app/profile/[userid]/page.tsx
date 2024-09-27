'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import MainProfile from '../../../components/profile/mainprofile';
import FeedItem from '../../../components/feed/feedItem';
import { ScrollArea } from '../../../components/ui/feed-scroll-area';
import Sibar from '../../../components/sidebar/new-neo-sidebar';
import Spinner from '../../../components/ui/spinner';
import { useParams } from 'next/navigation';
import { fetchUserFeeds } from '../../../lib/api/feedApi';
import { fetchUserProfile } from '../../../lib/api/userApi';

// MainProfile의 Skeleton UI
const SkeletonProfileInfo = () => (
  <div className="p-5 flex items-center">
    <div className="w-16 h-16 bg-gradient-custom bg-custom rounded-full animate-shimmer"></div>
    <div className="ml-4 flex flex-col">
      <div className="w-32 h-6 bg-gradient-custom bg-custom animate-shimmer rounded-md mb-2"></div>
      <div className="w-48 h-4 bg-gradient-custom bg-custom animate-shimmer rounded-md"></div>
    </div>
  </div>
);

// FeedItem의 Skeleton UI
const SkeletonFeedItem = () => (
  <div
    className="relative w-full sm:w-[90%] md:w-[90%] h-[400px] bg-gray-200 rounded-2xl shadow-lg overflow-hidden ml-3 mt-3"
  >

    <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>


    <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
      <div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse"></div>
      <div>
        <div className="w-24 h-4 bg-gray-400 rounded-md animate-pulse mb-1"></div>
        <div className="w-16 h-3 bg-gray-400 rounded-md animate-pulse"></div>
      </div>
    </div>


    <div className="absolute top-3 right-3 flex items-center space-x-2 z-10 text-gray-400">
      <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="w-6 h-4 bg-gray-400 rounded-md animate-pulse"></div>
    </div>


    <div className="absolute bottom-10 left-3 text-white z-10">
      <div className="w-[200px] h-6 bg-gray-400 rounded-md animate-pulse mb-2"></div>
      <div className="w-[150px] h-6 bg-gray-400 rounded-md animate-pulse"></div>
    </div>
  </div>
);

const UserProfilePage = () => {
  const { userid } = useParams();
  const decodedUserid = decodeURIComponent(userid as string);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null);

  // 피드 가져오기
  const { data: feedData, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['feeds', decodedUserid],
    queryFn: ({ pageParam = null }) => fetchUserFeeds(decodedUserid, pageParam),
    getNextPageParam: (lastPage) => {
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    enabled: !!decodedUserid,
    initialPageParam: null,
  });

  const feeds = feedData?.pages.flatMap(page => page.feeds) || [];
  const fetchedFeedsCount = feeds.length;

  useEffect(() => {
    if (feedData?.pages[0]?.totalFeeds) {
      setTotalFeeds(feedData.pages[0].totalFeeds);
    }
  }, [feedData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          fetchedFeedsCount < (totalFeeds || 0)
        ) {
          fetchNextPage();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, fetchedFeedsCount, totalFeeds]);

  // 유저 프로필 로드
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile(decodedUserid);
        setUserProfile(profileData);
      } catch (error) {
        console.error('유저 정보를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (decodedUserid) {
      loadUserProfile();
    }
  }, [decodedUserid]);

  // 전체 로딩 중일 때 Skeleton UI 적용
  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
        <div className="w-[40%] min-w-[500px] h-[100%] justify-center">
          <Sibar />
          {/* Skeleton UI for MainProfile */}
          <div className="p-5">
            <SkeletonProfileInfo />
          </div>
          {/* Skeleton UI for FeedItem */}
          <ScrollArea
            ref={scrollRef}
            className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
          >
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <SkeletonFeedItem key={index} />
              ))}
          </ScrollArea>
        </div>
      </div>
    );
  }

  // 실제 유저 프로필 및 피드 렌더링
  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] h-[100%] justify-center">
        <Sibar />

        {/* 프로필 정보 표시 */}
        <MainProfile
          email={userProfile?.email || ""}
          nickname={userProfile?.nickname || ''}
          bio={userProfile?.bio || ''}
          follower={userProfile?.follower || 0}
          following={userProfile?.following || 0}
          profileImage={userProfile?.profileImage || ''}
          isCurrentUser={userProfile?.email === decodedUserid}
        />

        {/* 유저의 피드 표시 */}
        <ScrollArea
          ref={scrollRef}
          className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
        >
          {feeds.map(feed => (
            <FeedItem
              key={feed.postId}
              profileImage={userProfile?.profileImage}
              postId={feed.postId}
              nickname={userProfile?.nickname}
              userId={userProfile?.email}
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

export default UserProfilePage;
