import { NextApiRequest, NextApiResponse } from 'next';
import { adminDB, adminStorage } from '../../../firebase/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: '올바른 요청이 아닙니다' });
  }

  const { postId, imageFiles } = req.body;

  if (!postId) {
    return res.status(400).json({ error: 'postId가 없습니다' });
  }

  try {
    // Firestore에서 포스트 삭제
    await adminDB.collection('Feed').doc(postId).delete();

    // Firebase Storage에서 이미지 삭제
    if (imageFiles && imageFiles.length > 0) {
      for (const fileName of imageFiles) {
        const file = adminStorage.file(`images/${fileName}`);
        await file.delete();
      }
    }

    return res.status(200).json({ message: '포스트 삭제에 성공했습니다' });
  } catch (error) {
    console.error('포스트 삭제 중 오류가 발생했습니다:', error);
    return res.status(500).json({ error: '포스트 삭제 중 오류가 발생했습니다' });
  }
}
