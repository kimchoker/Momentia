import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

// 댓글 알림 보내기 함수
export const sendNotificationOnComment = onDocumentCreated(
  'posts/{postId}/comments/{commentId}',
  async (event) => {
    const commentData = event.data?.data() as {
      authorId: string;
      commentText: string;
    };
    const { postId } = event.params;

    // 게시글 작성자의 토큰 가져오기
    const postDoc = await admin
      .firestore()
      .collection('posts')
      .doc(postId)
      .get();
    const postAuthorId = postDoc.data()?.authorId;

    if (postAuthorId) {
      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(postAuthorId)
        .get();
      const userFcmToken = userDoc.data()?.fcmToken;

      // 알림 메시지 보내기
      if (userFcmToken) {
        const message = {
          notification: {
            title: '새 댓글이 달렸습니다!',
            body: `${commentData.authorId}가 댓글을 남겼습니다.`,
          },
          token: userFcmToken,
        };

        await admin.messaging().send(message);
      }
    }
  },
);

// 좋아요 알림 보내기 함수
export const sendNotificationOnLike = onDocumentCreated(
  'posts/{postId}/likes/{likeId}',
  async (event) => {
    const likeData = event.data?.data() as { userId: string };
    const { postId } = event.params;

    // 게시글 작성자의 토큰 가져오기
    const postDoc = await admin
      .firestore()
      .collection('posts')
      .doc(postId)
      .get();
    const postAuthorId = postDoc.data()?.authorId;

    if (postAuthorId) {
      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(postAuthorId)
        .get();
      const userFcmToken = userDoc.data()?.fcmToken;

      // 알림 메시지 보내기
      if (userFcmToken) {
        const message = {
          notification: {
            title: '좋아요를 받았습니다!',
            body: `${likeData.userId}가 게시글을 좋아합니다.`,
          },
          token: userFcmToken,
        };

        await admin.messaging().send(message);
      }
    }
  },
);
