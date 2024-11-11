import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { messaging, db } from './firebase';

const saveTokenToFirestore = async (userId: string): Promise<void> => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });
    if (currentToken) {
      await setDoc(
        doc(db, 'users', userId),
        { fcmToken: currentToken },
        { merge: true },
      );
      console.log('FCM 토큰 저장 완료:', currentToken);
    } else {
      console.log('토큰을 가져오지 못했습니다.');
    }
  } catch (error) {
    console.error('토큰 저장 중 오류 발생:', error);
  }
};

export default saveTokenToFirestore;
