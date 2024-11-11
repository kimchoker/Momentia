import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  privateKey: (process.env.PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
    storageBucket: `${process.env.NEXT_PUBLIC_PROJECT_ID}.appspot.com`,
  });
}

const adminAuth = admin.auth();
const adminDB = admin.firestore();
const adminStorage = admin.storage().bucket();
const messaging = admin.messaging(); // 서버에서 푸시 메시지를 전송할 때 사용


export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    const firebaseAdminConfig = {
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.PROJECT_ID,
    };

    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
      storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
    });
  }
  return admin;
}
export function getAdminStorage() {
  const admin = getFirebaseAdmin();
  return admin.storage().bucket();
}

export function getAdminDB() {
  const admin = getFirebaseAdmin();
  return admin.firestore();
}

export { admin, adminAuth, adminDB, adminStorage, messaging };
