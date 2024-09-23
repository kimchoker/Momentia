'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import FeedItem from '../../components/feed/feedItem';
import { ScrollArea } from '../../components/ui/scroll-area';
import Sibar from '../../components/sidebar/new-neo-sidebar';
import Spinner from '../../components/ui/spinner';
import { fetchFeeds } from '../../lib/api/feedApi';

const Home = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  
  const [selectedTab, setSelectedTab] = useState('all');
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feeds', selectedTab],
    queryFn: ({ pageParam = null }) => fetchFeeds(selectedTab, pageParam), // 분리한 fetchFeeds 함수 사용
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

  return (
    <div className="flex justify-center items-center h-screen bg-[#f0f4f8] font-sans">
      <Sibar />
      
      <div className="flex flex-col w-full max-w-[700px] h-[100%] overflow-y-visible overflow-visible">
        
        {/* 탭 UI: 전체 피드와 팔로우한 사람들의 피드를 선택하는 버튼 */}
        <div className="flex w-full justify-between bg-white rounded-xl shadow-md">
          <button
            className={`flex-grow py-4 flex items-center justify-center font-semibold transition duration-300 
            ${selectedTab === 'all' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setSelectedTab('all')}
          >
            전체 피드
          </button>
          <button
            className={`flex-grow py-4 flex items-center justify-center font-semibold transition duration-300
            ${selectedTab === 'following' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setSelectedTab('following')}
          >
            팔로잉 피드
          </button>
        </div>

        <ScrollArea ref={scrollRef} className="w-full mt-5">
          {/* 그리드 레이아웃: FeedItem 크기에 맞춰 배치 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mr-5 ml-8 ">
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
