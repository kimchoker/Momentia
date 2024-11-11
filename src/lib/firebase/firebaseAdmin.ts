import * as firebaseAdminModule from 'firebase-admin';

export function getFirebaseAdmin() {
  if (!firebaseAdminModule.apps.length) {
    const firebaseAdminConfig = {
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.PROJECT_ID,
    };

    firebaseAdminModule.initializeApp({
      credential: firebaseAdminModule.credential.cert(firebaseAdminConfig),
      storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
    });
  }
  return firebaseAdminModule;
}

// 필요한 곳에서 사용
const admin = getFirebaseAdmin();
const adminAuth = admin.auth();
const adminDB = admin.firestore();
const adminStorage = admin.storage().bucket();
const messaging = admin.messaging();
