// pages/api/feed.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { fetchedPostData } from '../../../types/types';


// Firestore 문서 데이터 구조를 명시하는 타입
interface FeedDocument extends DocumentData {
  userId: string;
  email: string;
  nickname: string;
  content: string;
  images?: { url: string; fileName: string }[];
  likeCount?: number;
  commentCount?: number;
  createdAt: any; // Firestore Timestamp 타입
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { next, limitNum } = req.query;
  console.log(next, limitNum)
  
  try {
    const feedCollection = collection(db, "Feed");
    let feedQuery;
    console.log(next, limitNum)
    if (next) {
      const nextDoc = JSON.parse(next as string) as QueryDocumentSnapshot;
      feedQuery = query(feedCollection, orderBy("createdAt", "desc"), startAfter(nextDoc), limit(Number(limitNum) || 20));
    } else {
      feedQuery = query(feedCollection, orderBy("createdAt", "desc"), limit(Number(limitNum) || 20));
    }

    const querySnapshot = await getDocs(feedQuery);
    const items: fetchedPostData[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as FeedDocument; // 데이터 타입을 FeedDocument으로 단언
      return {
        userId: data.userId,
        email: data.email,
        nickname: data.nickname,
        content: data.content,
        images: data.images || [],
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
        createdAt: data.createdAt.toDate(),
      };
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    res.status(200).json({
      items,
      next: lastVisible ? JSON.stringify(lastVisible) : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '피드 데이터를 불러오는 것에 실패했습니다.' });
  }
}
