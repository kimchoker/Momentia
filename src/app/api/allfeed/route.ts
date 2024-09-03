import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';
import { post } from "../../../types/types";

export async function POST(req: NextRequest) {
  try {
    const { pageParam } = await req.json();
 
    const feedCollection = collection(db, 'Feed');
    let q;

    if (pageParam) {
      const lastVisibleTimestamp = Timestamp.fromDate(new Date(pageParam));
      q = query(
        feedCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleTimestamp),
        limit(10)
      );
    } else {
      q = query(
        feedCollection,
        orderBy('createdAt', 'desc'),
        limit(10)
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: '피드의 마지막입니다.' }, { status: 404 });
    }

    const feeds: post[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as post;

      return {
        postId: doc.id,
        nickname: data.nickname,
        email: data.email,
        userId: data.userId,
        content: data.content,
        images: data.images || [],
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
      };
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const lastVisibleData = lastVisible.data() as post; // 여기에 타입 캐스팅을 추가합니다.
    const nextCursor = lastVisibleData.createdAt instanceof Timestamp
      ? lastVisibleData.createdAt.toDate().toISOString()
      : null;

    return NextResponse.json({ feeds, nextCursor });
  } catch (error) {
    console.error('에러 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
