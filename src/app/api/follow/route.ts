import { NextRequest, NextResponse } from 'next/server';
import { getAdminDB } from '../../../lib/firebase/firebaseAdmin';

// 팔로우 추가 (POST)
export async function POST(req: NextRequest) {
  try {
    const { followingUserID, followerUserID } = await req.json();

    if (!followingUserID || !followerUserID) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const adminDB = getAdminDB(); // 함수 내부에서 Firebase Admin SDK 초기화

    // 이미 팔로우했는지 확인
    const followRef = adminDB
      .collection('follows')
      .where('followingUserID', '==', followingUserID)
      .where('followerUserID', '==', followerUserID);

    const snapshot = await followRef.get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { message: 'Already following' },
        { status: 409 },
      );
    }

    // 팔로우 데이터 추가
    await adminDB.collection('follows').add({
      followingUserID,
      followerUserID,
    });

    return NextResponse.json({ message: '팔로우 성공' }, { status: 200 });
  } catch (error) {
    console.error('Error adding follow:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// 팔로우 취소 (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { followingUserID, followerUserID } = await req.json();

    if (!followingUserID || !followerUserID) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const adminDB = getAdminDB(); // 함수 내부에서 Firebase Admin SDK 초기화

    // 팔로우 데이터 삭제
    const followRef = adminDB
      .collection('follows')
      .where('followingUserID', '==', followingUserID)
      .where('followerUserID', '==', followerUserID);

    const snapshot = await followRef.get();

    if (snapshot.empty) {
      return NextResponse.json(
        { message: 'Follow not found' },
        { status: 404 },
      );
    }

    // 문서 삭제
    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    return NextResponse.json({ message: '언팔로우 성공' }, { status: 200 });
  } catch (error) {
    console.error('Error removing follow:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
