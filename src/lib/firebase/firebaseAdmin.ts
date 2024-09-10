import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
  privateKey: (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n'),
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
const messaging = admin.messaging();

export { admin, adminAuth, adminDB, adminStorage, messaging };
