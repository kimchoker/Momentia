import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { db, storage } from '../firebase/firebase';
import { PostData, UpdatePostData } from '../../types/types';
import { convertToWebp } from '../imageResize/imageResizing';

// 이미지 업로드
const uploadImage = async (
  file: File,
): Promise<{ url: string; fileName: string }> => {
  try {
    // 이미지를 WebP로 변환
    const webpBlob = await convertToWebp(file);
    const uploadedFileName = `${Date.now()}_${file.name.replace(/\.[^/.]+$/, '.webp')}`;

    // Firebase에 업로드
    const storageRef = ref(storage, `images/${uploadedFileName}`);
    const snapshot = await uploadBytes(storageRef, webpBlob);
    const url = await getDownloadURL(snapshot.ref);

    return { url, fileName: uploadedFileName };
  } catch (error) {
    console.error('Upload failed:', error);
    alert('이미지 업로드에 실패했습니다.');
    throw new Error('Image upload failed');
  }
};

// 전체 피드 글 불러오기(과거 글, 무한스크롤 기능에 사용)
const fetchFeeds = async ({ email, pageParam, type }) => {
  const response = await fetch('/api/feed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      pageParam,
      type,
    }),
  });

  if (!response.ok) {
    throw new Error('피드를 불러오는 데 실패했습니다.');
  }

  return response.json();
};

// 전체 피드 갯수를 비교하기 위한 피드 갯수 요청용 api
const fetchFeedCount = async () => {
  const response = await fetch('/api/feed/count', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('피드 개수를 불러오는 데 실패했습니다.');
  }

  const data = await response.json();
  return data.totalFeeds;
};

// 새 피드 가져오기 (polling 기능을 이용한 새 피드 불러오는 기능)
const fetchNewFeeds = async ({ email, type, lastCreatedAt }) => {
  const response = await fetch('/api/feed/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      type,
      lastCreatedAt,
    }),
  });

  if (!response.ok) {
    throw new Error('새 피드를 불러오는 데 실패했습니다.');
  }

  return response.json();
};

// 특정 유저 피드 글 불러오기
const fetchUserFeeds = async (userId: string, pageParam: string | null) => {
  try {
    const response = await axios.post('/api/feed/user', {
      email: userId,
      pageParam,
    });
    return response.data;
  } catch (error) {
    throw new Error('유저 피드를 불러오는 데 실패했습니다.', error);
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

const updatePost = async (
  postId: string,
  updatedData: UpdatePostData,
  removedImages: { url: string; fileName: string }[],
) => {
  try {
    if (!postId) {
      throw new Error('postId가 유효하지 않습니다.');
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
      throw new Error('User not authenticated');
    }

    const response = await axios.post('/api/deletepost', {
      postId,
      idToken,
    });

    return response.data;
  } catch (error) {
    console.error('글 삭제 중 오류가 발생했습니다:', error);
    throw error;
  }
};

const deleteComment = async (commentId: string, postId: string) => {
  try {
    const response = await axios.delete(`/api/comments`, {
      params: {
        commentId, // 삭제할 댓글의 ID
        postId, // 게시물의 ID
      },
    });

    return response.data;
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error);
    throw new Error(error.response?.data?.message || '댓글 삭제 실패');
  }
};

// 댓글 가져오기 함수
const fetchComments = async (postId) => {
  const response = await axios.get(`/api/comments?postId=${postId}`);
  return response.data;
};

// 댓글 작성 함수
const createComment = async (newComment) => {
  // 댓글 작성 요청
  const response = await axios.post('/api/comments', newComment);
  const { postId, userId, content } = response.data;

  // 댓글 알림 전송
  await axios.post('/api/sendNotification', {
    postId,
    actionUserId: userId,
    actionContent: content,
    type: 'comment',
  });

  return response.data;
};
// 댓글 삭제 함수
const deleteCommentApi = async ({ commentId, postId }) =>
  axios.delete(`/api/comments?commentId=${commentId}&postId=${postId}`);

// 좋아요 추가 함수
const likePost = async (postId: string, email: string) => {
  // 좋아요 요청
  const response = await axios.post('/api/like', {
    postId,
    email, // 요청 바디에 email 포함
  });

  // 좋아요 알림 전송
  await axios.post('/api/sendNotification', {
    postId,
    actionUserId: email,
    type: 'like',
  });

  return response.data;
};

// 좋아요 취소
const unlikePost = async (postId: string, email: string) => {
  const response = await axios.delete('/api/like', {
    data: {
      postId,
      email, // 요청 바디에 email 포함
    },
  });
  return response.data;
};
export {
  uploadImage,
  savePost,
  updatePost,
  deletePost,
  deleteComment,
  likePost,
  unlikePost,
  fetchComments,
  createComment,
  deleteCommentApi,
  fetchUserFeeds,
  fetchFeeds,
  fetchFeedCount,
  fetchNewFeeds,
};
