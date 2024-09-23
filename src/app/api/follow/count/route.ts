// api/follow/count.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '../../../../lib/firebase/firebaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: '이메일이 제공되지 않았습니다.' }, { status: 400 });
  }

  try {
    // 팔로워 수 가져오기
    const followersSnapshot = await adminDB
      .collection('Follow')
      .where('followingUserId', '==', email)
      .get();
    const followerCount = followersSnapshot.size;

    // 팔로잉 수 가져오기
    const followingSnapshot = await adminDB
      .collection('Follow')
      .where('followerUserId', '==', email)
      .get();
    const followingCount = followingSnapshot.size;

    return NextResponse.json({
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error('팔로워 및 팔로잉 수 가져오는 중 오류 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
