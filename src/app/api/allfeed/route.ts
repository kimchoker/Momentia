import { NextResponse } from 'next/server';
import { adminDB } from '../../../firebase/firebaseAdmin';
import { QueryDocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase-admin/firestore';
import { post } from '../../../types/types';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const next = url.searchParams.get('next');
    const limitNum = url.searchParams.get('limitNum');

    const feedCollection = adminDB.collection('Feed');
    let feedQuery;

    if (next) {
      const nextDoc = JSON.parse(next) as QueryDocumentSnapshot<DocumentData>;
      feedQuery = feedCollection
        .orderBy('createdAt', 'desc')
        .startAfter(nextDoc)
        .limit(Number(limitNum) || 20);
    } else {
      feedQuery = feedCollection
        .orderBy('createdAt', 'desc')
        .limit(Number(limitNum) || 20);
    }

    const feedSnapshot: QuerySnapshot<DocumentData> = await feedQuery.get();

    if (feedSnapshot.empty) {
      return NextResponse.json({ message: 'No feeds found' }, { status: 404 });
    }

    const feeds: post[] = feedSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        postId: doc.id, 
        nickname: data.nickname,
        email: data.email,
        userId: data.userId,
        content: data.content,
        images: data.images || [],
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
        createdAt: data.createdAt.toDate()
      };
    });

    const lastVisible = feedSnapshot.docs[feedSnapshot.docs.length - 1];
    return NextResponse.json({
      feeds,
      next: lastVisible ? JSON.stringify(lastVisible) : null
    });
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
