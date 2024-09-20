'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { authStore } from '../../states/store';
import { fetchFollowCounts } from '../../lib/api/followApi';
import { fetchUserFeeds } from '../../lib/api/feedApi';
import { ScrollArea } from '../../components/ui/feed-scroll-area';
import ProfileInfo from '../../components/profile/feedprofile';
import FeedItem from '../../components/feed/feedItem';
import Sibar from '../../components/sidebar/new-neo-sidebar';
import Spinner from '../../components/ui/spinner';

const MyProfilePage = () => {
  const { email, nickname, bio, profileImage } = authStore((state) => ({
    email: state.email,
    nickname: state.nickname,
    bio: state.bio,
    profileImage: state.profileImage,
  }));

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 팔로워 및 팔로잉 수를 가져오기 위한 useEffect
  useEffect(() => {
    const fetchCounts = async () => {
      if (email) {
        try {
          const { followerCount, followingCount } = await fetchFollowCounts(email);
          setFollowerCount(followerCount);
          setFollowingCount(followingCount);
        } catch (error) {
          console.error('팔로워 및 팔로잉 수를 가져오는 중 오류 발생:', error);
        }
      }
    };
    fetchCounts();
  }, [email]);

  const { data: feedData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['feeds', email],
    queryFn: ({ pageParam = null }) => fetchUserFeeds(email as string, pageParam),
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

  if (!email || !nickname || !profileImage) return <p>유저 정보를 가져오는 중 오류가 발생했습니다.</p>;

  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] h-[100%] bg-[#d6d6d6] justify-center">
        <Sibar />
        <ProfileInfo
          email={email}
          nickname={nickname}
          bio={bio || ''}
          follower={followerCount} // API로 가져온 팔로워 수
          following={followingCount} // API로 가져온 팔로잉 수
          profileImage={profileImage}
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
