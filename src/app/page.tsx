"use client";
import React, { useRef, useEffect, useState } from 'react';
import FeedItem from '../components/feed/feedItem';
import { ScrollArea } from '../components/ui/scroll-area';
import Sibar from '../components/sidebar/new-neo-sidebar';
import Spinner from '../components/ui/spinner';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

const Home = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null);

  const fetchFeeds = async ({ pageParam }) => {
    const response = await fetch(`/api/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pageParam: pageParam }),
    });
    if (!response.ok) {
      throw new Error("서버에서 피드를 불러오는 데 실패했습니다.");
    }
    return response.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feeds'],
    queryFn: ({ pageParam = null }) => fetchFeeds({ pageParam }),
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

  // 무한 스크롤 설정
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
      {/* ScrollArea 폭을 700px로 고정 */}
      <ScrollArea ref={scrollRef} className="w-full max-w-[700px] h-[100%] overflow-y-visible overflow-visible">
        {/* 그리드 레이아웃: FeedItem 크기에 맞춰 배치 */}
        <div className="grid grid-cols-1  sm:grid-cols-2 gap-4 ">
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
  );
};

export default Home;
