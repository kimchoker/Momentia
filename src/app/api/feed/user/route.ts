import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/firebase/firebase";
import { collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';  

export async function POST(req: NextRequest) {
  try {
    const { email, pageParam } = await req.json();
    
    if (!email) {
      return NextResponse.json({ message: '이메일이 필요합니다.' }, { status: 400 });
    }

    const feedCollection = collection(db, 'Feed');
    const lastVisibleTimestamp = pageParam ? Timestamp.fromDate(new Date(pageParam)) : null;

    const q = query(
      feedCollection,
      where('email', '==', email),  // 특정 유저의 피드만 가져옴
      orderBy('createdAt', 'desc'),
      ...(lastVisibleTimestamp ? [startAfter(lastVisibleTimestamp)] : []),
      limit(10)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: '피드의 마지막입니다.' }, { status: 404 });
    }

    const feeds = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const nextCursor = lastVisible.data().createdAt instanceof Timestamp
      ? lastVisible.data().createdAt.toDate().toISOString()
      : null;

    return NextResponse.json({ feeds, nextCursor });
  } catch (error) {
    console.error('에러 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
