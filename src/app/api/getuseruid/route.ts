import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../../firebase/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

// Firestore 초기화
const db = getFirestore();

// POST 메서드 처리 함수
export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    console.log(`백엔드로 들어온 토큰: ${idToken}`);

    // idToken이 문자열인지 확인
    if (typeof idToken !== 'string') {
      return NextResponse.json({ error: '토큰 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    // 토큰 검증 및 UID 추출
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Firestore에서 해당 유저의 문서 가져오기
    const userDocRef = db.collection('user').doc(uid); // user 컬렉션에서 uid로 문서 참조 생성
    const userDocSnap = await userDocRef.get();

    // 문서가 존재하는지 확인
    if (!userDocSnap.exists) {
      return NextResponse.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 유저 정보에서 email과 nickname 추출
    const userData = userDocSnap.data();
    const email = userData?.email;
    const nickname = userData?.nickname;
    const bio = userData?.bio;
    const follower = userData?.follower;
    const following = userData?.following;
    const profileImage = userData?.profileImage;

    return NextResponse.json({ uid, email, nickname, bio, follower, following, profileImage }, { status: 200 });
  } catch (error) {
    console.error('토큰 유효성 검증에 실패했습니다:', error);
    return NextResponse.json({ error: '허가되지 않은 토큰' }, { status: 401 });
  }
}
