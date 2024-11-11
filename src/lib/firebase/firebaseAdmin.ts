import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  privateKey: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
    storageBucket: `${process.env.NEXT_PUBLIC_PROJECT_ID}.appspot.com`, // storageBucket 설정 확인
  });
}

const adminAuth = admin.auth();
const adminDB = admin.firestore();
const adminStorage = admin.storage().bucket(); // `bucket()` 메서드로 Firebase Storage 사용
const adminMessaging = admin.messaging(); // 서버에서 푸시 메시지를 전송할 때 사용

export { admin, adminAuth, adminDB, adminStorage, adminMessaging };
