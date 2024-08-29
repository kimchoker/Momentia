// pages/api/feed.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { post } from '../../../types/types';

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
    const items: post[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as post; // 데이터 타입을 FeedDocument으로 단언
      return {
        postId: doc.id,
        userId: data.userId,
        email: data.email,
        nickname: data.nickname,
        content: data.content,
        images: data.images || [],
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
        createdAt: data.createdAt
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
