import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
  privateKey: (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
  clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

export { admin };
