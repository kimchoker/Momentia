import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminDB } from '../../../lib/firebase/firebaseAdmin';

// POST 요청 핸들러
export async function POST(req: NextRequest) {
  try {
    const { postId, email } = await req.json();

    if (!postId || !email) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const likesRef = adminDB.collection('Like').doc(`${postId}_${email}`);
    const postRef = adminDB.collection('Feed').doc(postId);

    await likesRef.set({
      feedID: postId,
      userID: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await postRef.update({
      likeCount: admin.firestore.FieldValue.increment(1),
    });

    return NextResponse.json(
      { message: 'Liked post successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// DELETE 요청 핸들러
export async function DELETE(req: NextRequest) {
  try {
    const { postId, email } = await req.json();

    if (!postId || !email) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const likesRef = adminDB.collection('Like').doc(`${postId}_${email}`);
    const postRef = adminDB.collection('Feed').doc(postId);

    const doc = await likesRef.get();
    if (!doc.exists) {
      return NextResponse.json({ message: 'Like not found' }, { status: 404 });
    }

    await likesRef.delete();
    await postRef.update({
      likeCount: admin.firestore.FieldValue.increment(-1),
    });

    return NextResponse.json(
      { message: 'Unliked post successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling unlike:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
