import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query, DocumentData, where } from 'firebase/firestore';

interface FeedDocument extends DocumentData {
  userId: string;
  email: string;
  nickname: string;
  content: string;
  images?: { url: string; fileName: string }[];
  likeCount?: number;
  commentCount?: number;
  createdAt: any; // Firestore Timestamp 타입
}

type Data = {
  feeds?: FeedDocument[];
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const feedCollection = collection(db, 'Feed');
    const q = query(feedCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No feeds found for this email' });
    }

    const feeds: FeedDocument[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as FeedDocument),
    }));

    return res.status(200).json({ feeds });
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return res.status(500).json({ message: 'Failed to fetch feeds' });
  }
}