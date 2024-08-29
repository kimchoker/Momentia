import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../../firebase/firebaseAdmin'; // firebaseAdmin 초기화 경로에 맞게 수정하세요.
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

// POST 메서드 처리 함수
export async function POST(req: NextRequest) {
  try {
    const { idToken, nickname, bio, profileImage } = await req.json();
    console.log(`백엔드로 들어온 토큰: ${idToken}`);

    // idToken이 문자열인지 확인
    if (typeof idToken !== 'string') {
      return NextResponse.json({ error: '토큰 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    // 토큰 검증 및 UID 추출
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Firestore에서 해당 유저의 문서 참조 가져오기
    const userDocRef = db.collection('user').doc(uid);

    // Firestore에서 유저 문서 업데이트
    await userDocRef.update({
      nickname,
      bio,
      profileImage,
    });

    return NextResponse.json({ message: '프로필이 성공적으로 업데이트되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('프로필 업데이트에 실패했습니다:', error);
    return NextResponse.json({ error: '프로필 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
