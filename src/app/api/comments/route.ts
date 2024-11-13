import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
  increment,
  addDoc,
  Timestamp,
  where,
  getDoc,
} from 'firebase/firestore';
import admin from 'firebase-admin';
import { db } from '../../../lib/firebase/firebase';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, userID, content } = body;

    if (!postId || !userID || !content) {
      return NextResponse.json(
        { message: '필수 요소 중 없는 값이 있습니다.' },
        { status: 400 },
      );
    }

    // 댓글 추가
    const commentsCollection = collection(db, 'Feed', postId, 'comment');
    const newComment = {
      postId,
      userID,
      content,
      createdAt: Timestamp.now(),
    };
    const commentDoc = await addDoc(commentsCollection, newComment);

    // 게시글의 댓글 수 증가
    const postRef = doc(db, 'Feed', postId);
    await updateDoc(postRef, { commentCount: increment(1) });

    // 게시물 작성자의 FCM 토큰 가져오기 (문서 ID가 postAuthorId와 같음)
    const postSnapshot = await getDoc(postRef);
    const postAuthorId = postSnapshot.data()?.userId;

    if (postAuthorId) {
      // postAuthorId를 문서 ID로 사용하여 fcmToken 가져오기
      const userDoc = await getDoc(doc(db, 'user', postAuthorId));
      const fcmToken = userDoc.data()?.fcmToken;

      if (fcmToken) {
        const message = {
          token: fcmToken,
          notification: {
            title: '새 댓글이 달렸습니다!',
            body: `${userID}님이 댓글을 남겼습니다: "${content}"`,
          },
        };

        // FCM 메시지 전송
        await admin.messaging().send(message);
      }
    }

    return NextResponse.json(
      { message: '댓글 저장이 완료되었습니다.', commentId: commentDoc.id },
      { status: 200 },
    );
  } catch (error) {
    console.error('댓글 저장 중 오류 발생:', error);
    return NextResponse.json(
      { message: '댓글 저장 중 문제가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json(
      { message: 'postId가 없습니다.' },
      { status: 400 },
    );
  }

  try {
    const commentsCollection = collection(db, 'Feed', postId, 'comment');
    // 최신순 정렬을 위해 'createdAt'을 'desc'로 설정
    const commentsQuery = query(
      commentsCollection,
      orderBy('createdAt', 'asc'),
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    const commentsWithProfile = await Promise.all(
      commentsSnapshot.docs.map(async (commentDoc) => {
        const commentData = commentDoc.data();
        const userEmail = commentData.userId;

        const usersCollection = collection(db, 'user');
        const userQuery = query(
          usersCollection,
          where('email', '==', userEmail),
        );
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
          createdAt: (commentData.createdAt as Timestamp)
            .toDate()
            .toISOString(),
          nickname,
          profileImage,
        };
      }),
    );

    if (commentsWithProfile.length === 0) {
      return NextResponse.json({ message: '댓글이 없습니다.' });
    }
    return NextResponse.json(commentsWithProfile, { status: 200 });
  } catch (error) {
    console.error('댓글을 가져오는 데 실패했습니다:', error);
    return NextResponse.json(
      { message: 'DB에서 가져오는 중 문제가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get('commentId');
  const postId = searchParams.get('postId');

  if (!commentId || !postId) {
    return NextResponse.json(
      { message: 'commentId 또는 postId가 없습니다.' },
      { status: 400 },
    );
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

    return NextResponse.json(
      { message: '댓글이 성공적으로 삭제되었습니다.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('댓글 삭제 중 문제가 발생했습니다:', error);
    return NextResponse.json(
      { message: '댓글 삭제 중 문제가 발생했습니다.' },
      { status: 500 },
    );
  }
}
