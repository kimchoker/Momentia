'use client';
import React, { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { authStore } from '../../states/store';
import ProfileInfo from '../../components/profile/feedprofile';
import FeedItem from '../../components/feed/feedItem';
import { ScrollArea } from '../../components/ui/feed-scroll-area';
import Sibar from '../../components/sidebar/new-neo-sidebar';
import Spinner from '../../components/ui/spinner';

const fetchUserFeeds = async (userId: string, { pageParam }) => {
  const response = await fetch(`/api/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userId, pageParam }),
  });
  if (!response.ok) {
    throw new Error('피드를 불러오는 데 실패했습니다.');
  }
  return response.json();
};

const MyProfilePage = () => {
  const { email, nickname, bio, profileImage } = authStore((state) => ({
    email: state.email,
    nickname: state.nickname,
    bio: state.bio,
    profileImage: state.profileImage,
  }));

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: feedData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['feeds', email],
    queryFn: ({ pageParam = null }) => fetchUserFeeds(email as string, { pageParam }),
    getNextPageParam: (lastPage) => {
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    enabled: !!email,
    initialPageParam: null,
  });

  const feeds = feedData?.pages.flatMap((page) => page.feeds) || [];

  useEffect(() => {
    if (!email) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: '0px', threshold: 0.1 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, email]);

  if (!email || !nickname || !bio || !profileImage) return <p>유저 정보를 가져오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] h-[100%] bg-[#d6d6d6] justify-center">
        <Sibar />
        <ProfileInfo
          email={email}
          nickname={nickname || ''}
          bio={bio || ''}
          follower={0} // 기본값 설정
          following={0}
          profileImage={profileImage || ''}
          isCurrentUser={true} // 본인의 프로필임을 확인
        />
        <ScrollArea ref={scrollRef} className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto">
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
    </div>
  );
};

export default MyProfilePage;
