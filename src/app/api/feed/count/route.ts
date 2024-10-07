import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export async function GET() {
  try {
    const feedCollection = collection(db, 'Feed');
    const totalFeedsSnapshot = await getCountFromServer(feedCollection);
    const totalFeeds = totalFeedsSnapshot.data().count;

    return NextResponse.json({ totalFeeds });
  } catch (error) {
    console.error('피드 개수를 가져오는 중 오류 발생:', error);
    return NextResponse.json({ message: '서버 오류 발생' }, { status: 500 });
  }
}
