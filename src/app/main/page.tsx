'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeeds } from '../../lib/api/feedApi';
import { useStore } from 'zustand';
import { authStore } from '../../states/store';
import { ScrollArea } from '../../components/ui/scroll-area';
import FeedItem from '../../components/feed/feedItem';
import Sibar from '../../components/sidebar/new-neo-sidebar';
import Spinner from '../../components/ui/spinner';


const Home = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [selectedTab, setSelectedTab] = useState('all');
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null);
  const { email } = useStore(authStore);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feeds', selectedTab],
    queryFn: ({ pageParam = null }) =>
      fetchFeeds({
        email: email, // 현재 로그인한 유저의 이메일을 추가
        pageParam,
        type: selectedTab, // 탭 정보를 POST 요청의 body에 포함
      }),
    getNextPageParam: (lastPage) => {
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    initialPageParam: null,
  });

  const feeds = data?.pages.flatMap((page) => page.feeds) || [];
  const fetchedFeedsCount = feeds.length;

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
          fetchedFeedsCount < totalFeeds
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

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab); // 탭 변경 시 상태 업데이트
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#f0f4f8] font-sans">
      <Sibar />

      <div className="flex flex-col w-full max-w-[700px] h-[100%] overflow-y-visible overflow-visible">
        <div className="flex w-full justify-between bg-white rounded-xl shadow-md">
          <button
            className={`flex-grow py-4 flex items-center justify-center font-semibold transition duration-300 
            ${selectedTab === 'all' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => handleTabChange('all')}
          >
            전체 피드
          </button>
          <button
            className={`flex-grow py-4 flex items-center justify-center font-semibold transition duration-300
            ${selectedTab === 'following' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => handleTabChange('following')}
          >
            팔로잉 피드
          </button>
        </div>

        <ScrollArea ref={scrollRef} className="w-full mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mr-5 ml-8">
            {feeds.map((feed) => (
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
};

export default Home;
