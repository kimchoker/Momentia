"use client"
import { useState, useEffect } from 'react';
import FeedItem from '../components/feed/feedItem';
import { ScrollArea } from '../components/ui/scroll-area';
import Sibar from '../components/new-neo-sidebar';
import { fetchedPostData } from '../types/types';
import { fetchFeedData } from '../services/clientApi';

const Home = () => {
  const [feedItems, setFeedItems] = useState<fetchedPostData[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialFeed = async () => {
      setLoading(true);
      try {
        const data = await fetchFeedData(); // 초기 데이터 가져오기
        setFeedItems(data.items);
        setNextPage(data.next);
      } catch (error) {
        console.error('Error loading initial feed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialFeed();
  }, []);

  const loadMore = async () => {
    if (nextPage) {
      setLoading(true);
      try {
        const data = await fetchFeedData(nextPage);
        setFeedItems((prev) => [...prev, ...data.items]);
        setNextPage(data.next);
      } catch (error) {
        console.error('Error loading more feed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#ffffff] font-nanum-barun-gothic">
      <Sibar />
      <ScrollArea className="w-[40%] h-[100%] overflow-y-auto">
        {feedItems.map((item, index) => (
          <FeedItem
            key={`${item.userId}-${index}`} // 고유한 key 설정
            nickname={item.nickname}
            userId={item.userId}
            content={item.content}
            imageName={item.images.length > 0 ? item.images[0].fileName : ''}
            imageUrl={item.images.length > 0 ? item.images[0].url : ''}
          />
        ))}
        {loading && <p className="text-center">Loading...</p>}
        {nextPage && !loading && (
          <button
            onClick={loadMore}
            className="w-full text-center bg-blue-500 text-white p-3 mt-4"
          >
            Load More
          </button>
        )}
      </ScrollArea>
    </div>
  );
};

export default Home;
