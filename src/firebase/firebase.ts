import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, collection, CollectionReference } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAo-GG89U2cA723lNC9PtC9SpNrkwaO_xs",
  authDomain: "snsproject-85107.firebaseapp.com",
  projectId: "snsproject-85107",
  storageBucket: "snsproject-85107.appspot.com",
  messagingSenderId: "273535426800",
  appId: "1:273535426800:web:d14c2cf64fe2468a232235",
  measurementId: "G-ZJZ0LHQN67"
};


const app = initializeApp(firebaseConfig);


const analytics: Analytics = getAnalytics(app);
export const auth: Auth = getAuth(app);

export const db: Firestore = getFirestore(app);
export const USER_COLLECTION: CollectionReference = collection(db, "User");
