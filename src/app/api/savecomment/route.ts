import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebase/firebase'; 
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { postId, userId, nickname, text } = await req.json();

    if (!postId || !userId || !nickname || !text) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const commentsCollection = collection(db, 'Feed', postId, 'comments');

    const newComment = {
      userId,
      nickname,
      text,
      createdAt: Timestamp.now(),
    };

    await addDoc(commentsCollection, newComment);

    return NextResponse.json({ message: 'Comment added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ message: 'Failed to add comment' }, { status: 500 });
  }
}
