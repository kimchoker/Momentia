'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import FeedItem from './feedItem';
import SkeletonLoader from './skeletonLoader';
import InfiniteScrollObserver from './infiniteScrollObserver';
import { ScrollArea } from '../../components/ui/scroll-area';
import { fetchFeeds, fetchFeedCount } from '../../lib/api/feedApi';
import { useEffect, useState } from 'react';
import Spinner from '../../components/ui/spinner';

const FeedList = ({ selectedTab, userData }) => {
  const [totalFeeds, setTotalFeeds] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['feeds', selectedTab],
      queryFn: ({ pageParam = null }) =>
        fetchFeeds({
          email: userData?.email,
          pageParam,
          type: selectedTab,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.feeds.length
          ? lastPage.feeds[lastPage.feeds.length - 1].createdAt
          : undefined,
      initialPageParam: null,
      enabled: !!userData,
    });

  const feeds = data?.pages.flatMap((page) => page.feeds) || [];

  // 서버에서 전체 피드 개수를 가져옴
  useEffect(() => {
    const fetchTotalFeeds = async () => {
      try {
        const feedCount = await fetchFeedCount();
        setTotalFeeds(feedCount);
      } catch (error) {
        console.error('전체 피드 개수 가져오기 오류:', error);
      }
    };

    fetchTotalFeeds();
  }, []);

  // 옵저버가 fetch 요청을 멈추는 조건
  const disableObserver = feeds.length >= (totalFeeds || 0);

  return (
    <ScrollArea className="w-full mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
        {isLoading ? (
          <SkeletonLoader count={6} />
        ) : (
          feeds.map((feed) => (
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
          ))
        )}
      </div>

      {/* 무한 스크롤 로딩 상태 */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center p-10">
          <Spinner />
        </div>
      )}

      {/* 옵저버를 통해 더 많은 피드 요청 */}
      {!disableObserver && (
        <InfiniteScrollObserver
          onIntersect={() => hasNextPage && fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        />
      )}
    </ScrollArea>
  );
};

export default FeedList;
