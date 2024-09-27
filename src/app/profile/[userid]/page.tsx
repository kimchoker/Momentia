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

const Skeleton = () => (
  <div className="animate-shimmer bg-gradient-custom bg-custom h-12 w-full rounded-md mb-4"></div>
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
    const handleNewPost = async () => {
      await refetch(); 
    };
    // 새 글이 추가되었을 때 refetch 호출하는 로직 추가 필요
    // handleNewPost를 글 작성 후 호출하는 방식을 추가할 수 있음
  }, [refetch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          fetchedFeedsCount < (totalFeeds || 0) // totalFeeds가 있을 때만 작동
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

  // API로부터 유저 프로필을 가져오는 로직
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);  // 프로필 로딩 상태

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile(decodedUserid);
        setUserProfile(profileData);
      } catch (error) {
        console.error('유저 정보를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoadingProfile(false);  // 로딩 완료
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
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          {/* Skeleton UI for FeedItem */}
          <ScrollArea
            ref={scrollRef}
            className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
          >
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} />
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
          follower={userProfile?.follower || 0}  // 팔로워 정보
          following={userProfile?.following || 0}  // 팔로잉 정보
          profileImage={userProfile?.profileImage || ''}
          isCurrentUser={userProfile?.email === decodedUserid}  // 현재 로그인한 유저인지 확인
        />

        {/* 유저의 피드 표시 */}
        <ScrollArea
          ref={scrollRef}
          className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
        >
          {feeds.map(feed => (
            <FeedItem
              key={feed.postId}
              profileImage={feed.profileImage}
              postId={feed.postId}
              nickname={feed.nickname}
              userId={feed.email}
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
