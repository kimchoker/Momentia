import { NextResponse } from 'next/server';
import { adminDB, messaging } from '../../../lib/firebase/firebaseAdmin';

export async function POST(request: Request) {
  try {
    console.log('알림 API 호출 시작'); // 호출 시점 확인

    // 요청 본문 파싱
    const { postId, actionUserId, actionContent, type } = await request.json();
    console.log('요청 데이터:', { postId, actionUserId, actionContent, type });

    // postId 확인
    if (!postId) {
      console.error('postId가 유효하지 않습니다.');
      return NextResponse.json(
        { error: 'postId가 제공되지 않았습니다.' },
        { status: 400 },
      );
    }

    // 원 글 작성자의 userId 가져오기
    const postDoc = await adminDB.collection('Feed').doc(postId).get();
    if (!postDoc.exists) {
      console.error('해당 postId로 게시글을 찾을 수 없습니다:', postId);
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const postAuthorId = postDoc.data()?.userId;
    console.log('게시글 작성자 ID:', postAuthorId);

    if (!postAuthorId) {
      console.error('게시글 작성자의 ID가 없습니다.');
      return NextResponse.json(
        { error: '게시글 작성자를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 작성자의 FCM 토큰 가져오기
    const userDoc = await adminDB.collection('user').doc(postAuthorId).get();
    if (!userDoc.exists) {
      console.error('해당 userId로 사용자를 찾을 수 없습니다:', postAuthorId);
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const fcmToken = userDoc.data()?.fcmToken;
    console.log('FCM 토큰:', fcmToken);

    if (!fcmToken) {
      console.error('FCM 토큰이 없습니다. 알림을 보낼 수 없습니다.');
      return NextResponse.json(
        { error: 'FCM 토큰을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 알림 메시지 구성
    let title = '';
    let body = '';

    if (type === 'comment') {
      title = '새로운 댓글이 달렸습니다!';
      body = `${actionUserId}님이 댓글을 남겼습니다: "${actionContent}"`;
    } else if (type === 'like') {
      title = '새로운 좋아요가 있습니다!';
      body = `${actionUserId}님이 게시글을 좋아합니다.`;
    } else {
      console.error('잘못된 알림 유형:', type);
      return NextResponse.json(
        { error: '잘못된 알림 유형입니다.' },
        { status: 400 },
      );
    }

    console.log('알림 메시지 생성:', { title, body });

    // FCM 알림 메시지 설정
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
    };

    // FCM 메시지 전송
    try {
      const response = await messaging.send(message);
      console.log('FCM 메시지 전송 성공:', response);
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
    console.error('알림 전송 중 예외 발생:', error);
    return NextResponse.json(
      { error: '알림 전송 중 오류 발생', details: error.message },
      { status: 500 },
    );
  }
}
