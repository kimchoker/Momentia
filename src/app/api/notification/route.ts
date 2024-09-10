// import { NextApiRequest, NextApiResponse } from 'next';
// import { messaging } from '../../../lib/firebase/firebaseAdmin';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { token, title, body } = req.body;

//     if (!token || !title || !body) {
//       return res.status(400).json({ message: '전송에 필요한 필수 요소가 부족합니다.' });
//     }

//     try {
//       const message = {
//         token,
//         notification: {
//           title,
//           body,
//         },
//       };

//       await messaging.send(message);
//       return res.status(200).json({ message: '알림이 정상적으로 전송되었습니다.' });
//     } catch (error) {
//       console.error('FCM 송신 에러: ', error);
//       return res.status(500).json({ message: 'FCM 송신 에러' });
//     }
//   } else {
//     return res.status(405).json({ message: '이건 없는 메소든데' });
//   }
// }
