'use client'
import React, { useRef } from 'react';
import { ScrollArea } from '../../../components/ui/feed-scroll-area';
import { profileEditStore, authStore } from '../../../states/store';
import MainProfile from '../../../components/profile/mainprofile';
import ProfileEdit from '../../../components/profile/new-neo-profileEdit';
import Sibar from '../../../components/new-neo-sidebar';
import FeedItem from '../../../components/feed/feedItem';
import Spinner from '../../../components/ui/spinner';
import { useInfiniteQuery } from '@tanstack/react-query';

const MyPage = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { isEditOpen } = profileEditStore();
  const { email } = authStore();

  const fetchFeeds = async ({ pageParam = 1 }) => {
    const response = await fetch(`/api/myfeed`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, page: pageParam }),
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
    queryKey: ['feeds', email],
    queryFn: fetchFeeds,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
  });

  const feeds = data?.pages.flatMap(page => page.feeds) || [];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] h-[100%] bg-[#d6d6d6] justify-center">
        <Sibar />
        <ProfileEdit isOpen={isEditOpen} />
        <MainProfile />
        <ScrollArea
          ref={scrollRef}
          className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
          onScroll={handleScroll}
        >
          {feeds.map(feed => (
            <FeedItem
              key={feed.postId}
              postId={feed.postId}
              nickname={feed.nickname}
              userId={feed.email}
              content={feed.content}
              images={feed.images}
            />
          ))}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <Spinner />
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MyPage;
