import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../services/firebase/firebase';
import { collection, getDocs, orderBy, query, doc, deleteDoc, updateDoc, increment, addDoc, Timestamp, where } from 'firebase/firestore';
import { comment } from '../../../types/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ message: 'postId가 없습니다.' }, { status: 400 });
  }

  try {
    const commentsCollection = collection(db, 'Feed', postId, 'comment');
    // 최신순 정렬을 위해 'createdAt'을 'desc'로 설정
    const commentsQuery = query(commentsCollection, orderBy('createdAt', 'asc'));
    const commentsSnapshot = await getDocs(commentsQuery);

    const commentsWithProfile = await Promise.all(
      commentsSnapshot.docs.map(async (commentDoc) => {
        const commentData = commentDoc.data();
        const userEmail = commentData.userId;

        const usersCollection = collection(db, 'user');
        const userQuery = query(usersCollection, where('email', '==', userEmail));
        const userSnapshot = await getDocs(userQuery);

        let nickname = 'Unknown';
        let profileImage = '';

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          nickname = userData?.nickname || 'Unknown';
          profileImage = userData?.profileImage || '';
        }

        return {
          id: commentDoc.id,
          postId: commentData.postId,
          userId: commentData.userId,
          content: commentData.content,
          createdAt: (commentData.createdAt as Timestamp).toDate().toISOString(),
          nickname,
          profileImage,
        };
      })
    );

    if (commentsWithProfile.length === 0) {
      return NextResponse.json({ message: '댓글이 없습니다.' });
    } else {
      return NextResponse.json(commentsWithProfile, { status: 200 });
    }
  } catch (error) {
    console.error('댓글을 가져오는 데 실패했습니다:', error);
    return NextResponse.json({ message: 'DB에서 가져오는 중 문제가 발생했습니다.' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Request body:', body);  // 요청 본문 출력

    const { postId, userId, content } = body;

    // 필수 값이 없을 경우 400 응답
    if (!postId || !userId || !content) {
      return NextResponse.json({ message: '필수 요소 중 없는 값이 있습니다.' }, { status: 400 });
    }

    const commentsCollection = collection(db, 'Feed', postId, 'comment');

    // 새로운 댓글 생성
    const newComment = {
      postId,
      userId,
      content,
      createdAt: Timestamp.now(),
    };

    const commentDoc = await addDoc(commentsCollection, newComment);

    // 댓글 수 증가
    const postRef = doc(db, 'Feed', postId);
    await updateDoc(postRef, { commentCount: increment(1) });

    return NextResponse.json({ message: '댓글 저장이 완료되었습니다.', commentId: commentDoc.id }, { status: 200 });
  } catch (error) {
    console.error('댓글 저장 중 오류 발생:', error);  // 에러 로그
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
    const commentRef = doc(db, 'Feed', postId, 'comment', commentId);
    await deleteDoc(commentRef);

    // 해당 게시물의 commentCount 감소
    const postRef = doc(db, 'Feed', postId);
    await updateDoc(postRef, {
      commentCount: increment(-1), // 댓글 수 감소
    });

    return NextResponse.json({ message: '댓글이 성공적으로 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('댓글 삭제 중 문제가 발생했습니다:', error);
    return NextResponse.json({ message: '댓글 삭제 중 문제가 발생했습니다.' }, { status: 500 });
  }
}