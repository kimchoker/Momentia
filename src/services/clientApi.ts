import { collection, query, where, getDocs, setDoc, doc, Timestamp, addDoc, serverTimestamp  } from "firebase/firestore";
import { db, auth, storage } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PostData, UserData } from '../types/types';


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
      profileImage: "",
      updatedAt: now,
    };

    // Firestore에 사용자 데이터 저장 (문서 ID를 uid로)
    await setDoc(doc(db, "user", user.uid), userData);

    console.log("DB에 회원정보 저장 성공:");
  } catch (error) {
    console.error("DB에 회원정보 저장 실패:", error);
  }
}

// 로그인
const login = async (email: string, password: string): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    return token;

  } catch (error) {
    throw new Error('로그인에 실패했습니다.');
  }
};

// 이미지 업로드
const uploadImage = async (file: File): Promise<{url :string, fileName :string}> => {
  try {
    // 이미지 파일의 수정/삭제를 위한 고유 이름 붙여 업로드
    const uploadedFileName = `${Date.now()}_${file.name}`;
    // Firebase Storage의 'images' 폴더를 지정
    const storageRef = ref(storage, `images/${uploadedFileName}`);
    // 이미지 파일 업로드
    const snapshot = await uploadBytes(storageRef, file);
    // 업로드된 파일의 다운로드 URL을 가져옴
    const url = await getDownloadURL(snapshot.ref);
    // 업로드 된 이미지의 url과 파일이름을 return
    return { url, fileName: uploadedFileName };

  } catch (error) {
    console.error('Upload failed:', error);
    alert("이미지 업로드에 실패했습니다.")
    throw new Error('Image upload failed');
  }
};


// 글 업로드
const savePost = async (postData: PostData) => {
  try {
    await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: serverTimestamp(),
    });
    console.log('글 작성에 성공했습니다!');
  } catch (e) {
    console.error('Error adding post: ', e);
  }
};

export { checkIDExists, checkNicknameExists, signUp, login, uploadImage, savePost };