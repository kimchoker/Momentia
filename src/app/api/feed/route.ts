import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';
import { post } from "../../../types/types";

export async function POST(req: NextRequest) {
  try {
    const { email, pageParam } = await req.json();
    
    const feedCollection = collection(db, 'Feed');
    let q;

    if (pageParam) {
      // pageParam이 있을 때, 해당 시간 이후의 데이터를 가져옴 (무한스크롤)
      const lastVisibleTimestamp = Timestamp.fromDate(new Date(pageParam));

      if (email) {
        // 특정 유저의 피드를 불러옴
        q = query(
          feedCollection,
          where('email', '==', email),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisibleTimestamp),
          limit(10)
        );
      } else {
        // 전체 피드를 불러옴
        q = query(
          feedCollection,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisibleTimestamp),
          limit(10)
        );
      }
    } else {
      // pageParam이 없을 때, 첫 페이지를 불러옴
      if (email) {
        // 특정 유저의 피드를 불러옴
        q = query(
          feedCollection,
          where('email', '==', email),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      } else {
        // 전체 피드를 불러옴
        q = query(
          feedCollection,
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      }
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
    const lastVisibleData = lastVisible.data() as post;
    const nextCursor = lastVisibleData.createdAt instanceof Timestamp
      ? lastVisibleData.createdAt.toDate().toISOString()
      : null;

    return NextResponse.json({ feeds, nextCursor });
  } catch (error) {
    console.error('에러 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
