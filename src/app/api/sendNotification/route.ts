import { NextResponse } from 'next/server';
import { adminDB, messaging } from '../../../lib/firebase/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { postId, actionUserId, actionContent, type } = await request.json();

    // 원 글 작성자의 fcmToken 가져오기
    const postDoc = await adminDB.collection('Feed').doc(postId).get();
    const postAuthorId = postDoc.data()?.userId;

    if (!postAuthorId) {
      return NextResponse.json(
        { error: '원 글 작성자를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const userDoc = await adminDB.collection('user').doc(postAuthorId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      return NextResponse.json(
        { error: 'FCM 토큰을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 알림 메시지 구성 - type에 따라 다른 메시지 설정
    let title = '';
    let body = '';

    if (type === 'comment') {
      title = '새로운 댓글이 달렸습니다!';
      body = `${actionUserId}님이 댓글을 남겼습니다: "${actionContent}"`;
    } else if (type === 'like') {
      title = '새로운 좋아요가 있습니다!';
      body = `${actionUserId}님이 게시글을 좋아합니다.`;
    } else {
      return NextResponse.json(
        { error: '잘못된 알림 유형입니다.' },
        { status: 400 },
      );
    }

    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
    };

    // FCM 알림 전송
    try {
      await messaging.send(message);
      return NextResponse.json(
        { message: '알림이 전송되었습니다.' },
        { status: 200 },
      );
    } catch (sendError) {
      console.error('FCM 메시지 전송 실패:', sendError);
      return NextResponse.json(
        { error: 'FCM 메시지 전송 실패', details: sendError.message },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('알림 전송 실패:', error);
    return NextResponse.json(
      { error: '알림 전송 중 오류 발생', details: error.message },
      { status: 500 },
    );
  }
}
