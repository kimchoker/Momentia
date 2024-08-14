import { initializeApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, Firestore, collection, CollectionReference } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { authStore } from "../states/store";
import { User } from "../types/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};



const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const auth: Auth = getAuth();
export const db: Firestore = getFirestore(app);
export const USER_COLLECTION: CollectionReference = collection(db, "User");
export { storage };

onAuthStateChanged(auth, (user) => {
  if (user) {
    authStore.getState().login({
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName,
    } as User);
  } else {
    authStore.getState().logout();
  }
});