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

// Firebase 서비스들을 지연 로딩으로 제공

export const adminAuth = firebaseAdminModule.auth();

export function getAdminAuth() {
  const admin = getFirebaseAdmin();
  return admin.auth();
}

export function getAdminDB() {
  const admin = getFirebaseAdmin();
  return admin.firestore();
}

export function getAdminStorage() {
  const admin = getFirebaseAdmin();
  return admin.storage().bucket();
}

export function getMessaging() {
  const admin = getFirebaseAdmin();
  return admin.messaging();
}
