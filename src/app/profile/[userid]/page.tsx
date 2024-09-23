'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'; // useQueryClient import
import MainProfile from '../../../components/profile/mainprofile';
import FeedItem from '../../../components/feed/feedItem';
import { ScrollArea } from '../../../components/ui/feed-scroll-area';
import Sibar from '../../../components/sidebar/new-neo-sidebar';
import Spinner from '../../../components/ui/spinner';
import { useParams } from 'next/navigation';
import { fetchUserFeeds } from '../../../lib/api/feedApi'; // API 함수 import
import { fetchUserProfile } from '../../../lib/api/userApi'; // API 함수 import

// Skeleton 컴포넌트: Shimmer 효과를 적용한 Skeleton UI
const Skeleton = () => (
  <div className="animate-shimmer bg-gradient-custom bg-custom h-12 w-full rounded-md mb-4"></div>
);

const UserProfilePage = () => {
  const { userid } = useParams();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient(); // useQueryClient 추가
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null); // 최대 피드 수 상태 추가

  // 피드 가져오기
  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch, // refetch 추가
  } = useInfiniteQuery({
    queryKey: ['feeds', userid],
    queryFn: ({ pageParam = null }) => fetchUserFeeds(userid as string, pageParam),
    getNextPageParam: (lastPage) => {
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    enabled: !!userid,
    initialPageParam: null,
  });

  const feeds = feedData?.pages.flatMap(page => page.feeds) || [];
  const fetchedFeedsCount = feeds.length;

  // 전체 피드의 최대 갯수 받아오기
  useEffect(() => {
    if (feedData?.pages[0]?.totalFeeds) {
      setTotalFeeds(feedData.pages[0].totalFeeds); // 전체 피드의 최대 갯수 설정
    }
  }, [feedData]);

  // 피드가 업데이트될 때마다 refetch하도록 설정
  useEffect(() => {
    const handleNewPost = async () => {
      await refetch(); // 새 글 작성 후 피드를 다시 가져옴
    };
    // 새 글이 추가되었을 때 refetch 호출하는 로직 추가 필요
    // handleNewPost를 글 작성 후 호출하는 방식을 추가할 수 있음
  }, [refetch]);

  // IntersectionObserver로 스크롤 감지 및 다음 페이지 로드
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          fetchedFeedsCount < totalFeeds // 현재 로딩된 피드 수가 최대 피드 수보다 작을 때만 추가 요청
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
        const profileData = await fetchUserProfile(userid as string);
        setUserProfile(profileData);
      } catch (error) {
        console.error('유저 정보를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoadingProfile(false);  // 로딩 완료
      }
    };

    if (userid) {
      loadUserProfile();
    }
  }, [userid]);

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
          isCurrentUser={userProfile?.email === userid}  // 현재 로그인한 유저인지 확인
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
