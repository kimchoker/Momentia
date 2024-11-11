'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchFeeds,
  fetchNewFeeds,
  fetchFeedCount,
} from '../../lib/api/feedApi';
import { ScrollArea } from '../../components/ui/scroll-area';
import FeedItem from '../../components/feed/feedItem';
import Sibar from '../../components/sidebar/new-neo-sidebar';
import Spinner from '../../components/ui/spinner';

function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState('all');
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      alert('로그인이 필요합니다.');
    }
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, // isLoading 추가
  } = useInfiniteQuery({
    queryKey: ['feeds', selectedTab],
    queryFn: ({ pageParam = null }) =>
      fetchFeeds({
        email: userData?.email,
        pageParam,
        type: selectedTab,
      }),
    getNextPageParam: (lastPage) => {
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    initialPageParam: null,
    enabled: !!userData,
  });

  const feeds = data?.pages.flatMap((page) => page.feeds) || [];

  const latestFeedCreatedAt = useMemo(
    () => (feeds.length > 0 ? feeds[0].createdAt : null),
    [feeds],
  );

  // 폴링 메커니즘 구현
  useEffect(() => {
    if (!latestFeedCreatedAt || !userData || !userData.email) return;

    const fetchNewFeedsInterval = async () => {
      try {
        // 서버에서 현재 전체 피드 개수 가져오기
        const currentTotalFeeds = await fetchFeedCount();

        // 클라이언트의 피드 개수와 비교
        if (currentTotalFeeds > feeds.length) {
          // 새 피드가 있으므로 서버에서 새 피드 데이터를 가져옴
          const newFeedsData = await fetchNewFeeds({
            email: userData.email,
            type: selectedTab,
            lastCreatedAt: latestFeedCreatedAt,
          });

          if (newFeedsData.feeds && newFeedsData.feeds.length > 0) {
            // 새 피드를 기존 피드 앞에 추가
            const newFeeds = newFeedsData.feeds.reverse();

            queryClient.setQueryData(['feeds', selectedTab], (oldData: any) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: [
                  {
                    ...oldData.pages[0],
                    feeds: [...newFeeds, ...oldData.pages[0].feeds],
                  },
                  ...oldData.pages.slice(1),
                ],
              };
            });

            setTotalFeeds(currentTotalFeeds);
          }
        }
      } catch (error) {
        console.error('새 피드를 가져오는 중 오류 발생:', error);
      }
    };

    const interval = setInterval(fetchNewFeedsInterval, 5000); // 5초마다 실행

    return () => clearInterval(interval);
  }, [latestFeedCreatedAt, selectedTab, userData, queryClient, feeds.length]);

  useEffect(() => {
    if (data?.pages[0]?.totalFeeds) {
      setTotalFeeds(data.pages[0].totalFeeds);
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          feeds.length < (totalFeeds || 0)
        ) {
          fetchNextPage();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: '0px',
        threshold: 0.1,
      },
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
    feeds.length,
    totalFeeds,
  ]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#f0f4f8] font-sans">
      <Sibar />

      <div className="flex flex-col w-full max-w-[700px] h-[100%] overflow-y-visible overflow-visible">
        <div className="flex w-full justify-between bg-white rounded-xl shadow-md">
          <button
            className={`flex-grow py-4 flex items-center justify-center font-semibold transition duration-300 
                ${
                  selectedTab === 'all'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            onClick={() => handleTabChange('all')}
          >
            전체 피드
          </button>
          <button
            className={`flex-grow py-4 flex items-center justify-center font-semibold transition duration-300
                ${
                  selectedTab === 'following'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            onClick={() => handleTabChange('following')}
          >
            팔로잉 피드
          </button>
        </div>

        <ScrollArea ref={scrollRef} className="w-full mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mr-5 ml-8">
            {!userData || isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative w-full sm:w-[90%] md:w-[90%] h-[400px] bg-gray-200 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform ml-3 mt-3 animate-pulse"
                  >
                    <div className="absolute inset-0 bg-gray-300" />

                    <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
                      {/* 프로필 이미지 스켈레톤 */}
                      <div className="w-10 h-10 bg-gray-400 rounded-full" />
                      <div className="flex flex-col space-y-1">
                        {/* 닉네임 스켈레톤 */}
                        <div className="w-24 h-4 bg-gray-400 rounded" />
                        {/* 시간 스켈레톤 */}
                        <div className="w-16 h-3 bg-gray-400 rounded" />
                      </div>
                    </div>

                    {/* 좋아요와 댓글 스켈레톤 */}
                    <div className="absolute top-3 right-3 flex items-center space-x-2 z-10">
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                      <div className="w-6 h-3 bg-gray-400 rounded" />
                    </div>

                    {/* 글 내용 스켈레톤 */}
                    <div className="absolute bottom-10 left-3 z-10">
                      <div className="w-64 h-6 bg-gray-400 rounded mb-2" />
                      <div className="w-56 h-6 bg-gray-400 rounded" />
                    </div>
                  </div>
                ))
              : feeds.map((feed) => (
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
          </div>

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

export default Home;
