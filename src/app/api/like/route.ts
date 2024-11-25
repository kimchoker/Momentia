import { NextRequest, NextResponse } from 'next/server';
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/firebase';

// 단일 라우터에서 모든 메서드 처리
export async function POST(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const postRef = doc(db, 'Feed', postId);
    const likeRef = doc(db, 'Feed', postId, 'likes', userId);

    // 좋아요 데이터 추가
    await setDoc(likeRef, {
      userId,
      createdAt: new Date(),
    });

    // 좋아요 카운트 증가
    await updateDoc(postRef, {
      likeCount: increment(1),
    });

    return NextResponse.json(
      { message: 'Liked post successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const postRef = doc(db, 'Feed', postId);
    const likeRef = doc(db, 'Feed', postId, 'likes', userId);

    // 좋아요 데이터 삭제
    await deleteDoc(likeRef);

    // 좋아요 카운트 감소
    await updateDoc(postRef, {
      likeCount: increment(-1),
    });

    return NextResponse.json(
      { message: 'Unliked post successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling unlike:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const email = searchParams.get('email');

    // 파라미터가 없는 경우 400 반환
    if (!postId || !email) {
      console.error('Missing parameters:', { postId, email });
      return NextResponse.json(
        { message: 'Invalid request parameters' },
        { status: 400 },
      );
    }

    // URL 디코딩 적용
    const decodedPostId = decodeURIComponent(postId);
    const decodedEmail = decodeURIComponent(email);

    console.log('Decoded parameters:', {
      postId: decodedPostId,
      email: decodedEmail,
    });

    // Firestore에서 문서 참조
    const likeRef = doc(db, 'Feed', decodedPostId, 'likes', decodedEmail);
    const likeDoc = await getDoc(likeRef);

    // 좋아요 상태 반환
    return NextResponse.json({ hasLiked: likeDoc.exists() }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/like:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
