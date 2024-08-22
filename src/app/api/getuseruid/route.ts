// pages/api/getUserUid.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '../../../firebase/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { idToken } = req.body;

    try {
      // 토큰 검증 및 UID 추출
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      res.status(200).json({ uid });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
