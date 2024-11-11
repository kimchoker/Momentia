import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  privateKey: (process.env.PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

const storageBucket = `${process.env.NEXT_PUBLIC_PROJECT_ID}.appspot.com`;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
    storageBucket: storageBucket,
  });
}

const adminAuth = admin.auth();
const adminDB = admin.firestore();
const adminStorage = admin.storage().bucket(storageBucket);
const messaging = admin.messaging(); // 서버에서 푸시 메시지를 전송할 때 사용

export { admin, adminAuth, adminDB, adminStorage, messaging };
