'use client'
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '../../../components/ui/feed-scroll-area';
import { profileEditStore, authStore } from '../../../states/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import MainProfile from '../../../components/profile/mainprofile';
import ProfileEdit from '../../../components/profile/new-neo-profileEdit';
import Sibar from '../../../components/new-neo-sidebar';
import FeedItem from '../../../components/feed/feedItem';
import Spinner from '../../../components/ui/spinner';
import Cookies from 'js-cookie';


const MyPage = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { isEditOpen } = profileEditStore();
  const { email, login } = authStore();
  const router = useRouter();

  const fetchFeeds = async ({ pageParam }) => {
    const response = await fetch(`/api/myfeed`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, pageParam: pageParam }),
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
    queryFn: ({ pageParam = null }) => fetchFeeds({ pageParam }),
    getNextPageParam: (lastPage) => {
      // 마지막 페이지의 feeds 배열에서 마지막 피드의 createdAt 값을 다음 pageParam으로 설정
      const lastFeed = lastPage.feeds[lastPage.feeds.length - 1];
      return lastFeed ? lastFeed.createdAt : undefined;
    },
    initialPageParam: null,
  });
  

  const feeds = data?.pages.flatMap(page => page.feeds) || [];

  useEffect(() => {
    const token = Cookies.get('token');

    if(token) {
      login(token);
    } else {
      alert("로그인이 필요합니다");
      router.push('/login');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('옵저버 작동', entries);
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();  // 요소가 뷰포트에 들어올 때 데이터 가져오기
          
        }
      },
      {
        root: scrollRef.current, // ScrollArea를 root로 설정
        rootMargin: '0px',
        threshold: 0.1,  // 10%가 보이면 트리거
      }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);  // 마지막 요소에 옵저버 붙이기
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);  // 컴포넌트 언마운트 시 옵저버 해제
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex justify-center items-center h-screen font-nanum-barun-gothic p-0 mt-0 mb-0">
      <div className="w-[40%] min-w-[500px] h-[100%] bg-[#d6d6d6] justify-center">
        <Sibar />
        <ProfileEdit isOpen={isEditOpen} />
        <MainProfile />
        <ScrollArea
          ref={scrollRef}
          className="w-full min-w-[500px] h-[calc(100vh-160px)] overflow-auto"
        >
          {feeds.map(feed => (
            <FeedItem
              key={feed.postId}
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
          <div ref={loadMoreRef} className="h-1" />  {/* 옵저버를 붙일 더미 요소 */}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MyPage;
