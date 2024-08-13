import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
  privateKey: (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n'),
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

export { admin };
