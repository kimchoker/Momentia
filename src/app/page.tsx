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
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null); // 상태 추가

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

  // 데이터가 변경될 때마다 totalFeeds 값을 업데이트하는 useEffect
  useEffect(() => {
    if (data?.pages[0]?.totalFeeds) {
      setTotalFeeds(data.pages[0].totalFeeds);
    }
  }, [data]);

  // Intersection Observer로 무한 스크롤 기능 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          fetchedFeedsCount < totalFeeds // 불러온 피드 수와 총 피드 수를 비교
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

  // 10초마다 최신 피드를 가져오는 기능
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    }, 10000);

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <div className="flex justify-center items-center h-screen bg-[#ffffff] font-nanum-barun-gothic">
      <Sibar />
      <ScrollArea ref={scrollRef} className="w-[40%] h-[100%] overflow-y-auto">
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
