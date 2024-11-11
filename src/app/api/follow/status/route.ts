import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/firebase';

// named export for POST method
export async function POST(req: NextRequest) {
  try {
    const { loggedInUserEmail, targetUserEmail } = await req.json();

    const followCollection = collection(db, 'Follow');
    const followQuery = query(
      followCollection,
      where('FollowerUserId', '==', loggedInUserEmail),
      where('FollowingUserId', '==', targetUserEmail),
    );

    const followSnapshot = await getDocs(followQuery);

    // 팔로우 상태 확인
    const isFollowing = !followSnapshot.empty;

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error('팔로우 상태 확인 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
