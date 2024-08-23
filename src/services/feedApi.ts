import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface FeedPost {
  id: string;
  nickname: string;
  email: string;
  content: string;
  images: { fileName: string; url: string }[];
}
