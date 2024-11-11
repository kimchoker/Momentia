import { NextRequest, NextResponse } from 'next/server';
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/firebase';

// Firestore에서 사용자 데이터를 삭제하는 함수
const deleteUserData = async (userId: string) => {
  const userDocRef = doc(db, 'user', userId);
  await deleteDoc(userDocRef);
  console.log('Firestore에서 사용자 데이터 삭제 완료');
};

// 회원탈퇴 처리 API
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json(); // 클라이언트에서 이메일과 비밀번호 받아옴
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json(
        { error: '사용자가 인증되지 않았습니다.' },
        { status: 401 },
      );
    }

    // 사용자 재인증 (Firebase는 민감한 작업에 재인증 필요)
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);

    // Firebase Auth에서 사용자 삭제
    await deleteUser(user);

    // Firestore에서 사용자 데이터 삭제
    await deleteUserData(user.uid);

    return NextResponse.json({ message: '계정이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('회원탈퇴 중 오류 발생:', error);
    return NextResponse.json(
      { error: '회원탈퇴 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
