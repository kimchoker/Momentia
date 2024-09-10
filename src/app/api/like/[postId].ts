import { NextApiRequest, NextApiResponse } from 'next';
import { adminDB } from '../../../lib/firebase/firebaseAdmin';
import admin from 'firebase-admin';

// POST /api/like/[postId]: 좋아요 추가
// DELETE /api/like/[postId]: 좋아요 취소

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;
  const userId = req.body.userId; // 클라이언트에서 사용자 ID를 받음

  if (!userId || typeof postId !== 'string') {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const likesRef = adminDB.collection('likes').doc(`${postId}_${userId}`); // postId와 userId로 문서 이름 생성
    const postRef = adminDB.collection('posts').doc(postId); // 포스트 참조

    if (req.method === 'POST') {
      // 좋아요 추가
      await likesRef.set({
        postId,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 포스트의 likeCount 증가
      await postRef.update({
        likeCount: admin.firestore.FieldValue.increment(1),
      });

      return res.status(200).json({ message: 'Liked post successfully' });
    }

    if (req.method === 'DELETE') {
      // 좋아요 취소
      const doc = await likesRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: 'Like not found' });
      }

      await likesRef.delete();

      // 포스트의 likeCount 감소
      await postRef.update({
        likeCount: admin.firestore.FieldValue.increment(-1),
      });

      return res.status(200).json({ message: 'Unliked post successfully' });
    }

    // 허용되지 않은 메서드
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling like:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
