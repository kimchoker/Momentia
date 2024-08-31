"use client"
import { useState, useEffect } from 'react';
import FeedItem from '../components/feed/feedItem';
import { ScrollArea } from '../components/ui/scroll-area';
import Sibar from '../components/new-neo-sidebar';
import { post } from '../types/types';
import Spinner from '../components/ui/spinner';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeedData } from '../services/clientApi';

const Home = () => {
  const [feeds, setFeeds] = useState<post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = async () => {
    try {
      const response = await fetch('/api/allfeed');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      if (Array.isArray(data.feeds)) {
        setFeeds(data.feeds);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching feeds:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  // const loadMore = async () => {
  //   if (nextPage) {
  //     setLoading(true);
  //     try {
  //       const data = await fetchFeedData(nextPage);
  //       setFeedItems((prev) => [...prev, ...data.items]);
  //       setNextPage(data.next);
  //     } catch (error) {
  //       console.error('Error loading more feed:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  return (
    <div className="flex justify-center items-center h-screen bg-[#ffffff] font-nanum-barun-gothic">
      <Sibar />
      <ScrollArea className="w-[40%] h-[100%] overflow-y-auto">
      {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner /> {/* 로딩 스피너 표시 */}
            </div>
          ) : (
            feeds.map(feed => (
              <FeedItem
                key={feed.postId}
                postId={feed.postId}
                nickname={feed.nickname}
                userId={feed.email}
                content={feed.content}
                images={feed.images}
              />
            ))
          )}
       
      </ScrollArea>
    </div>
  );
};

export default Home;
