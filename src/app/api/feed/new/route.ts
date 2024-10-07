import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAfter,
  Timestamp,
  doc as firestoreDoc,
  getDoc,
} from 'firebase/firestore';
import { post } from '../../../../types/types';

export async function POST(request: Request) {
  try {
    const { email, type, lastCreatedAt } = await request.json();

    const feedCollection = collection(db, 'Feed');

    let q;

    if (type === 'following' && email) {
      const followCollection = collection(db, 'Follow');
      const followQuery = query(
        followCollection,
        where('FollowerUserId', '==', email)
      );

      const followSnapshot = await getDocs(followQuery);
      const followingUserIds = followSnapshot.docs.map(
        (doc) => doc.data().followingUserId
      );
      followingUserIds.push(email);

      if (followingUserIds.length === 0) {
        return NextResponse.json({ feeds: [] });
      }

      q = query(
        feedCollection,
        where('email', 'in', followingUserIds),
        orderBy('createdAt', 'asc'),
        startAfter(Timestamp.fromDate(new Date(lastCreatedAt)))
      );
    } else {
      q = query(
        feedCollection,
        orderBy('createdAt', 'asc'),
        startAfter(Timestamp.fromDate(new Date(lastCreatedAt)))
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ feeds: [] });
    }

    const feeds = await Promise.all(
      querySnapshot.docs.map(async (feedDoc) => {
        const data = feedDoc.data() as post;
        const userId = data.userId;

        const userDocRef = firestoreDoc(db, 'user', userId);
        const userDocSnap = await getDoc(userDocRef);

        let nickname = '';
        let profileImage = '';

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          nickname = userData?.nickname || 'Unknown';
          profileImage = userData?.profileImage || '';
        }

        return {
          postId: feedDoc.id,
          nickname,
          profileImage,
          email: data.email,
          userId: data.userId,
          content: data.content,
          images: data.images || [],
          likeCount: data.likeCount || 0,
          commentCount: data.commentCount || 0,
          createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        };
      })
    );

    return NextResponse.json({ feeds });
  } catch (error) {
    console.error('새 피드를 가져오는 중 오류 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
