import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  CollectionReference,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: 'snsproject-85107.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const USER_COLLECTION: CollectionReference = collection(db, 'User');

let messaging;
(async () => {
  // `messaging`은 클라이언트에서만 사용할 수 있도록 조건부로 초기화
  if (typeof window !== 'undefined' && (await isSupported())) {
    messaging = getMessaging(app);
  }
})();

export { storage, auth, db, USER_COLLECTION, messaging };
