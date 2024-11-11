import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '../../../../lib/firebase/firebaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const type = searchParams.get('type'); // 'followers' 또는 'following'

  if (!email || !type) {
    return NextResponse.json(
      { message: '이메일 또는 타입이 제공되지 않았습니다.' },
      { status: 400 },
    );
  }

  try {
    let querySnapshot;

    if (type === 'followers') {
      querySnapshot = await adminDB
        .collection('Follow')
        .where('followingUserId', '==', email)
        .get();
    } else if (type === 'following') {
      querySnapshot = await adminDB
        .collection('Follow')
        .where('followerUserId', '==', email)
        .get();
    }

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: '리스트가 없습니다.' },
        { status: 404 },
      );
    }

    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(list);
  } catch (error) {
    console.error('리스트 가져오는 중 오류 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
