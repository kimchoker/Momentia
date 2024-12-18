import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '../../../lib/firebase/firebaseAdmin'; // Firebase Admin 초기화 코드

// 팔로우 추가 (POST)
export async function POST(req: NextRequest) {
  try {
    const { followingUserID, followerUserID } = await req.json();

    // 요청에 필요한 값이 없을 경우
    if (!followingUserID || !followerUserID) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    // 이미 팔로우했는지 확인 (중복 팔로우 방지)
    const followRef = adminDB
      .collection('follows')
      .where('followingUserID', '==', followingUserID)
      .where('followerUserID', '==', followerUserID);

    const snapshot = await followRef.get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { message: 'Already following' },
        { status: 409 },
      ); // 이미 팔로우된 경우
    }

    // 팔로우 데이터 Firestore에 추가
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

    // 요청에 필요한 값이 없을 경우
    if (!followingUserID || !followerUserID) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

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
      ); // 팔로우 관계가 없을 때
    }

    // 문서 삭제
    snapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    return NextResponse.json({ message: '언팔로우 성공' }, { status: 200 });
  } catch (error) {
    console.error('Error removing follow:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
