import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import axios from 'axios';
import { UserData } from '../../types/types';
import { db, auth, messaging } from '../firebase/firebase';
import { getToken } from 'firebase/messaging';

// 아이디 중복확인
const checkIDExists = async (id: string) => {
  const usersRef = collection(db, 'user');
  const q = query(usersRef, where('email', '==', id));
  const querySnapshot = await getDocs(q);

  // true면 중복된 아이디가 존재
  return !querySnapshot.empty;
};

// 회원가입
async function signUp(email: string, password: string, nickname: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    const now = Timestamp.now();

    const userData: UserData = {
      bio: '',
      createdAt: now,
      email,
      nickname,
      profileImage: '',
      updatedAt: now,
      fcmToken: '',
    };

    // Firestore에 사용자 데이터 저장 (문서 ID를 uid로)
    await setDoc(doc(db, 'user', user.uid), userData);

    console.log('DB에 회원정보 저장 성공:');
  } catch (error) {
    console.error('DB에 회원정보 저장 실패:', error);
  }
}

// 로그인
const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    if (user) {
      // 서비스 워커를 명시적으로 등록
      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      );

      // FCM 토큰 발급 시 등록된 서비스 워커를 사용하여 구독
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration,
      });

      if (fcmToken) {
        console.log('FCM 토큰 발급 성공');

        // Firestore의 user 문서에 FCM 토큰 업데이트
        const userRef = doc(db, 'user', user.uid);
        await updateDoc(userRef, { fcmToken });
        console.log('FCM 토큰 저장 성공');
      } else {
        console.log('FCM 토큰을 발급할 수 없습니다.');
      }
    }

    return user;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw new Error('로그인 실패');
  }
};

const fetchUserProfile = async (userId: string) => {
  try {
    const response = await axios.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('유저 프로필 정보를 가져오는 중 오류 발생', error);
  }
};

// 유저 정보 받아오기
const fetchUserInfo = async (token: string) => {
  try {
    if (!token) throw new Error('토큰이 없습니다. 로그인이 필요합니다.');

    const response = await axios.post(
      '/api/useruid',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('유저 정보 가져오기 실패:', error);
    throw error;
  }
};

export { checkIDExists, signUp, login, fetchUserProfile, fetchUserInfo };
