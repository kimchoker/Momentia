import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDB } from '../../../firebase/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { idToken } = req.body;

    try {
      // 토큰 검증 및 UID 추출
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Firestore에서 UID에 해당하는 유저 정보 가져오기
      const userDocRef = adminDB.collection('user').doc(uid);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const userData = userDoc.data();
        res.status(200).json({ userData });
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}