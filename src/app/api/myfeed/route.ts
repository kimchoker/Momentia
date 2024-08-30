import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

interface FeedDocument {
  userId: string;
  email: string;
  nickname: string;
  content: string;
  images?: { url: string; fileName: string }[];
  likeCount?: number;
  commentCount?: number;
  createdAt: any;
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const feedCollection = collection(db, 'Feed');
    const q = query(feedCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'No feeds found for this email' }, { status: 404 });
    }

    const feeds: FeedDocument[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as FeedDocument),
    }));

    return NextResponse.json({ feeds });
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return NextResponse.json({ message: 'Failed to fetch feeds' }, { status: 500 });
  }
}
