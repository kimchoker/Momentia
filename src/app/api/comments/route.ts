import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebase/firebase';
import { collection, getDocs, orderBy, query, doc, deleteDoc, updateDoc, increment, addDoc, Timestamp } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ message: 'postId가 없습니다.' }, { status: 400 });
  }

  try {
    const commentsCollection = collection(db, 'Feed', postId, 'comment');
    const commentsQuery = query(commentsCollection, orderBy('createdAt', 'desc'));
    const commentsSnapshot = await getDocs(commentsQuery);

    const comments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (comments.length === 0) {
      return NextResponse.json({ message: '댓글이 없습니다.' });
    } else {
      return NextResponse.json(comments, { status: 200 });
    }
  } catch (error) {
    console.error('댓글을 가져오는 데 실패했습니다:', error);
    return NextResponse.json({ message: 'DB에서 가져오는 중 문제가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { postId, userId, nickname, text } = await req.json();

    if (!postId || !userId || !nickname || !text) {
      return NextResponse.json({ message: '필수 요소 중 없는 값이 있습니다.' }, { status: 400 });
    }

    const commentsCollection = collection(db, 'Feed', postId, 'comment');

    const newComment = {
      userId,
      nickname,
      text,
      createdAt: Timestamp.now(),
    };

    await addDoc(commentsCollection, newComment);

    // 댓글 추가 후 원 글의 commentCount를 1 증가시킴
    const postRef = doc(db, 'Feed', postId);
    await updateDoc(postRef, {
      commentCount: increment(1),
    });

    return NextResponse.json({ message: '댓글 저장이 완료되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('댓글 저장에 실패했습니다:', error);
    return NextResponse.json({ message: '댓글 저장 중 문제가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get('commentId');
  const postId = searchParams.get('postId');

  if (!commentId || !postId) {
    return NextResponse.json({ message: 'commentId 또는 postId가 없습니다.' }, { status: 400 });
  }

  try {
    // 댓글 삭제
    const commentRef = doc(db, 'Feed', postId, 'comments', commentId);
    await deleteDoc(commentRef);

    // 해당 게시물의 commentCount 감소
    const postRef = doc(db, 'Feed', postId);
    await updateDoc(postRef, {
      commentCount: increment(-1), // commentCount 값을 1 감소
    });

    return NextResponse.json({ message: '댓글이 성공적으로 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('댓글 삭제 중 문제가 발생했습니다:', error);
    return NextResponse.json({ message: '댓글 삭제 중 문제가 발생했습니다.' }, { status: 500 });
  }
}
