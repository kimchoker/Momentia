import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, collection, CollectionReference } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const USER_COLLECTION: CollectionReference = collection(db, "User");

let messaging: Messaging | undefined;

if (typeof window !== "undefined") {
  // 클라이언트 환경에서만 `messaging` 초기화
  (async () => {
    if (await isSupported()) {
      messaging = getMessaging(app);
    }
  })();
}

export { storage, auth, db, USER_COLLECTION, messaging };
