'use client';

import React, { useEffect, useState } from 'react';
import FeedItem from '../../components/feed/feedItem';
import Sibar from '../../components/new-neo-sidebar';

interface Feed {
  id: string;
  nickname: string;
  email: string;
  userId: string;
  content: string;
  imageName: string;
  imageUrl: string;
}

const FeedList = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch feeds from the backend API
  const fetchFeeds = async () => {
    try {
      const response = await fetch('/api/getall');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Verify data structure
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="feed-list">
      <Sibar />
      {feeds.map(feed => (
        <FeedItem
          key={feed.id}
          nickname={feed.nickname}
          userId={feed.email}
          content={feed.content}
          imageName={feed.imageName}
          imageUrl={feed.imageUrl}
        />
      ))}
    </div>
  );
};

export default FeedList;