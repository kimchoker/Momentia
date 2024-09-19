import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/firebase'; // Firebase 초기화 코드 경로

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  const { userid } = params;
  const decodedUserId = decodeURIComponent(userid);

  try {
    // Firebase Firestore에서 유저 데이터를 가져오는 쿼리
    const usersCollectionRef = collection(db, 'user');
    const q = query(usersCollectionRef, where('email', '==', decodedUserId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: '유저 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
