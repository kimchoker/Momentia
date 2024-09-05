import { collection, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { PostData, UpdatePostData } from '../../types/types';
import { getAuth } from "firebase/auth";
import axios from 'axios';

// 이미지 업로드
const uploadImage = async (file: File): Promise<{ url: string, fileName: string }> => {
  try {
    const uploadedFileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `images/${uploadedFileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { url, fileName: uploadedFileName };
  } catch (error) {
    console.error('Upload failed:', error);
    alert("이미지 업로드에 실패했습니다.");
    throw new Error('Image upload failed');
  }
};

// 글 업로드
const savePost = async (postData: PostData) => {
  try {
    await addDoc(collection(db, 'Feed'), {
      ...postData,
      createdAt: serverTimestamp(),
    });
    console.log('글 작성에 성공했습니다!');
  } catch (e) {
    console.error('Error adding post: ', e);
  }
};

const updatePost = async (postId: string, updatedData: UpdatePostData, removedImages: { url: string; fileName: string }[]) => {
  try {
    if (!postId) {
      throw new Error("postId가 유효하지 않습니다.");
    }

    const postRef = doc(db, 'Feed', postId);

    // 삭제된 이미지가 있는 경우 Firebase Storage에서 삭제
    for (const image of removedImages) {
      const imageRef = ref(storage, `images/${image.fileName}`);
      await deleteObject(imageRef);
    }

    await updateDoc(postRef, {
      content: updatedData.content,
      images: updatedData.images,
    });

    console.log('포스트가 성공적으로 수정되었습니다.');
  } catch (error) {
    console.error('포스트 수정 중 오류가 발생했습니다:', error);
    throw new Error('포스트 수정 실패');
  }
};

// 글 삭제
const deletePost = async (postId: string) => {
  try {
    const auth = getAuth();
    const idToken = await auth.currentUser?.getIdToken();

    if (!idToken) {
      throw new Error("User not authenticated");
    }

    const response = await axios.post("/api/deletepost", {
      postId,
      idToken,
    });

    return response.data;
  } catch (error) {
    console.error("글 삭제 중 오류가 발생했습니다:", error);
    throw error;
  }
};

const deleteComment = async (commentId: string, postId: string) => {
  try {
    const response = await axios.delete(`/api/comments`, {
      params: {
        commentId: commentId, // 삭제할 댓글의 ID
        postId: postId,       // 게시물의 ID
      }
    });

    return response.data;
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error);
    throw new Error(error.response?.data?.message || '댓글 삭제 실패');
  }
};

export { uploadImage, savePost, updatePost, deletePost, deleteComment };
