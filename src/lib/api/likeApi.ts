import axios from 'axios';

// 좋아요 상태 확인
const checkLikeStatus = async (postId: string, email: string) => {
  try {
    const response = await axios.get('/api/like', {
      params: { postId, email },
    });
    return response.data.hasLiked; // 서버에서 반환하는 `hasLiked` 값
  } catch (error) {
    console.error('좋아요 상태 확인 중 오류 발생:', error);
    throw new Error('좋아요 상태 확인 실패');
  }
};

// 좋아요 추가
const likePost = async (postId: string, email: string) => {
  try {
    const response = await axios.post('/api/like', { postId, userId: email });
    return response.data;
  } catch (error) {
    console.error('좋아요 추가 중 오류 발생:', error);
    throw new Error('좋아요 추가 실패');
  }
};

// 좋아요 취소
const unlikePost = async (postId: string, email: string) => {
  try {
    const response = await axios.delete('/api/like', {
      data: { postId, userId: email },
    });
    return response.data;
  } catch (error) {
    console.error('좋아요 취소 중 오류 발생:', error);
    throw new Error('좋아요 취소 실패');
  }
};

export { checkLikeStatus, likePost, unlikePost };
