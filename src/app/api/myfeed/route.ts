import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';
import { post } from "../../../types/types";

export async function POST(req: NextRequest) {
  try {
    const { email, pageParam } = await req.json();
    if (!email) {
      return NextResponse.json({ message: '이메일이 없습니다.' }, { status: 400 });
    }

    const feedCollection = collection(db, 'Feed');
    let q;

    if (pageParam) {
      const lastVisibleTimestamp = Timestamp.fromDate(new Date(pageParam));
      q = query(
        feedCollection,
        where('email', '==', email),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleTimestamp),
        limit(10)
      );
    } else {
      q = query(
        feedCollection,
        where('email', '==', email),
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
        ...data,
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
