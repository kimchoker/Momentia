import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

interface FeedDocument {
  userId: string;
  email: string;
  nickname: string;
  content: string;
  images?: { url: string; fileName: string }[];
  likeCount?: number;
  commentCount?: number;
  createdAt: any;
}

export async function POST(req: NextRequest) {
  const { email, pageParam } = await req.json(); // pageParam이 마지막 문서의 정보
  const pageSize = 10; // 한번에 불러올 피드의 개수

  if (!email) {
    return NextResponse.json({ message: '이메일이 없습니다.' }, { status: 400 });
  }

  try {
    const feedCollection = collection(db, 'Feed');
    const q = pageParam 
      ? query(
          feedCollection,
          where('email', '==', email),
          orderBy('createdAt', 'desc'),
          startAfter(pageParam),
          limit(pageSize)
        )
      : query(
          feedCollection,
          where('email', '==', email),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: '피드의 마지막입니다.' }, { status: 404 });
    }

    const feeds: FeedDocument[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as FeedDocument),
    }));

    // 마지막 문서의 정보도 반환
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return NextResponse.json({ feeds, lastVisible });
  } catch (error) {
    console.error('페이지 불러오기에 실패했습니다:', error);
    return NextResponse.json({ message: '페이지 불러오기에 실패했습니다:' }, { status: 500 });
  }
}
