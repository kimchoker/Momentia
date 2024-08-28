import { NextResponse } from 'next/server';
import { adminDB } from '../../../firebase/firebaseAdmin';
import { QueryDocumentSnapshot, DocumentData, CollectionReference, QuerySnapshot } from 'firebase-admin/firestore';
import { Feed } from '../../../types/types';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const uid = url.searchParams.get('uid'); // 요청에서 uid 쿼리 파라미터 가져오기

    if (!uid) {
      return NextResponse.json({ message: 'UID가 전달되지 않았습니다' }, { status: 400 });
    }

    const feedCollection = adminDB.collection('Feed');
    const feedQuery = feedCollection.where('userId', '==', uid).orderBy('createdAt', 'desc'); // 사용자 UID로 필터링

    const feedSnapshot: QuerySnapshot<DocumentData> = await feedQuery.get();

    if (feedSnapshot.empty) {
      return NextResponse.json({ message: '불러올 수 있는 피드가 없습니다' }, { status: 404 });
    }

    const feeds = feedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feed[];

    return NextResponse.json({ feeds });
  } catch (error) {
    console.error('DB에서 데이터를 불러오는 데 실패했습니다:', error);
    return NextResponse.json({ message: 'DB에서 데이터를 불러오는 데 실패했습니다:' }, { status: 500 });
  }
}
