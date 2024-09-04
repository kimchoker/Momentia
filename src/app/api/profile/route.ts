import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../../firebase/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

// Firestore 초기화
const db = getFirestore();

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
    const userDocSnap = await userDocRef.get();

    // 문서가 존재하는지 확인
    if (!userDocSnap.exists) {
      return NextResponse.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // **프로필 수정** 요청 처리 (nickname, bio, profileImage가 있을 때)
    if (nickname || bio || profileImage) {
      await userDocRef.update({
        ...(nickname && { nickname }),
        ...(bio && { bio }),
        ...(profileImage && { profileImage }),
      });

      return NextResponse.json({ message: '프로필이 성공적으로 업데이트되었습니다.' }, { status: 200 });
    }

    // **프로필 조회** 요청 처리 (nickname, bio, profileImage가 없을 때)
    const userData = userDocSnap.data();
    const email = userData?.email;
    const fetchedNickname = userData?.nickname;
    const fetchedBio = userData?.bio;
    const follower = userData?.follower;
    const following = userData?.following;
    const fetchedProfileImage = userData?.profileImage;

    return NextResponse.json({
      uid,
      email,
      nickname: fetchedNickname,
      bio: fetchedBio,
      follower,
      following,
      profileImage: fetchedProfileImage,
    }, { status: 200 });

  } catch (error) {
    console.error('에러 발생:', error);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
