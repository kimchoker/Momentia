import axios from 'axios';

export const fetchFollowCounts = async (email: string) => {
  try {
    const response = await axios.get(`/api/follow/count`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    throw new Error('팔로워 및 팔로잉 수를 가져오는 데 실패했습니다.');
  }
};
