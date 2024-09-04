import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';  // doc을 firestoreDoc으로 변경
import { post } from "../../../types/types";

export async function POST(req: NextRequest) {
  try {
    const { email, pageParam } = await req.json();
    
    const feedCollection = collection(db, 'Feed');
    let q;

    // 페이지네이션 처리
    if (pageParam) {
      const lastVisibleTimestamp = Timestamp.fromDate(new Date(pageParam));

      if (email) {
        // 특정 유저의 피드 불러오기
        q = query(
          feedCollection,
          where('email', '==', email),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisibleTimestamp),
          limit(10)
        );
      } else {
        // 전체 피드 불러오기
        q = query(
          feedCollection,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisibleTimestamp),
          limit(10)
        );
      }
    } else {
      // 첫 페이지 불러오기
      if (email) {
        // 특정 유저의 피드 불러오기
        q = query(
          feedCollection,
          where('email', '==', email),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      } else {
        // 전체 피드 불러오기
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

    // 피드 데이터 처리
    const feeds = await Promise.all(querySnapshot.docs.map(async (feedDoc) => {
      const data = feedDoc.data() as post;
      const userId = data.userId;

      // 작성자의 유저 정보를 가져옴
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
        postId: feedDoc.id,  // feedDoc으로 변경
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
    }));

    // 다음 페이지를 위한 커서 처리
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
