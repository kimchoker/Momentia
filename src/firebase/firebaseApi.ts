import { collection, query, where, getDocs, addDoc, Timestamp  } from "firebase/firestore";
import { db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "./firebase"

interface UserData {
  bio: string;
  createdAt: Timestamp;
  email: string;
  nickname: string;
  password: string;
  profileImage: string;
  updatedAt: Timestamp;
}

// 아이디 중복확인
const checkIDExists = async (id: string) => {
  const usersRef = collection(db, "user"); 
  const q = query(usersRef, where("email", "==", id));
  const querySnapshot = await getDocs(q);

  // true면 중복된 아이디가 존재
  return !querySnapshot.empty; 
};

// 닉네임 중복확인
const checkNicknameExists = async (nickname: string) => {
  const usersRef = collection(db, "user"); 
  const q = query(usersRef, where("nickname", "==", nickname));
  const querySnapshot = await getDocs(q);
  // true면 중복된 닉네임이 존재
  return !querySnapshot.empty; 
};

// 회원가입
async function signUp(email: string, password: string, nickname: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const now = Timestamp.now();

    const userData: UserData = {
      bio: "",
      createdAt: now,
      email: email,
      nickname: nickname,
      password: password,
      profileImage: "",
      updatedAt: now,
    };

    // Firestore에 사용자 데이터 저장 (문서 ID 자동 생성)
    const docRef = await addDoc(collection(db, "user"), userData);

    console.log("DB에 회원정보 저장 성공:", docRef.id);
  } catch (error) {
    console.error("DB에 회원정보 저장 실패:", error);
  }
}

// 로그인
const login = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw new Error(error.message);
  }
};


export { checkIDExists, checkNicknameExists, signUp, login };