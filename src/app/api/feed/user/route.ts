import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  getCountFromServer,
  doc as firestoreDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/firebase';

export async function POST(req: NextRequest) {
  try {
    const { email, pageParam } = await req.json();
    console.log('Received email:', email, 'PageParam:', pageParam);

    if (!email) {
      return NextResponse.json(
        { message: '이메일이 필요합니다.' },
        { status: 400 },
      );
    }

    const feedCollection = collection(db, 'Feed');

    // 피드의 전체 갯수를 가져오기 (특정 유저가 작성한 피드만 카운트)
    const totalFeedsSnapshot = await getCountFromServer(
      query(feedCollection, where('email', '==', email)),
    );
    const totalFeeds = totalFeedsSnapshot.data().count;

    if (totalFeeds === 0) {
      return NextResponse.json({ feeds: [], nextCursor: null, totalFeeds: 0 });
    }

    // 페이지네이션 처리
    const lastVisibleTimestamp = pageParam
      ? Timestamp.fromDate(new Date(pageParam))
      : null;

    // 특정 유저의 피드만 가져오기
    const q = query(
      feedCollection,
      where('email', '==', email),
      orderBy('createdAt', 'desc'),
      ...(lastVisibleTimestamp ? [startAfter(lastVisibleTimestamp)] : []),
      limit(10),
    );

    const querySnapshot = await getDocs(q);

    // 데이터가 없을 때 처리
    if (querySnapshot.empty) {
      return NextResponse.json({
        message: '피드의 마지막입니다.',
        feeds: [],
        nextCursor: null,
        totalFeeds,
      });
    }

    // 유저 정보 가져오기
    const userDocRef = firestoreDoc(db, 'user', email);
    const userDocSnap = await getDoc(userDocRef);

    let nickname = '';
    let profileImage = '';

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      nickname = userData?.nickname || 'Unknown';
      profileImage = userData?.profileImage || '';
    } else {
      console.warn('유저 정보가 없습니다:', email);
    }

    // 피드 데이터 처리
    const feeds = querySnapshot.docs.map((feedDoc) => {
      const data = feedDoc.data();
      return {
        postId: feedDoc.id,
        email: data.email,
        userId: data.userId,
        content: data.content,
        images: data.images || [],
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        nickname,
        profileImage,
      };
    });

    // 다음 페이지 커서
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const nextCursor =
      lastVisible.data().createdAt instanceof Timestamp
        ? lastVisible.data().createdAt.toDate().toISOString()
        : null;

    return NextResponse.json({ feeds, nextCursor, totalFeeds });
  } catch (error) {
    console.error('에러 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
