import { NextResponse } from 'next/server';
import { adminDB } from '../../../firebase/firebaseAdmin';
import { QueryDocumentSnapshot, DocumentData, CollectionReference, QuerySnapshot } from 'firebase-admin/firestore';
import { Feed } from '../../../types/types';



// Handle GET requests
export async function GET(request: Request) {
  try {
    // Extract query parameters from the request URL
    const url = new URL(request.url);
    const next = url.searchParams.get('next');
    const limitNum = url.searchParams.get('limitNum');

    const feedCollection = adminDB.collection('Feed');
    let feedQuery;

    if (next) {
      const nextDoc = JSON.parse(next) as QueryDocumentSnapshot<DocumentData>;
      feedQuery = feedCollection
        .orderBy('createdAt', 'desc')
        .startAfter(nextDoc)
        .limit(Number(limitNum) || 20);
    } else {
      feedQuery = feedCollection
        .orderBy('createdAt', 'desc')
        .limit(Number(limitNum) || 20);
    }

    const feedSnapshot: QuerySnapshot<DocumentData> = await feedQuery.get();

    if (feedSnapshot.empty) {
      return NextResponse.json({ message: 'No feeds found' }, { status: 404 });
    }

    const feeds = feedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feed[];

    const lastVisible = feedSnapshot.docs[feedSnapshot.docs.length - 1];
    return NextResponse.json({
      feeds,
      next: lastVisible ? JSON.stringify(lastVisible) : null
    });
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
