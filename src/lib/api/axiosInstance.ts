import axios from 'axios';
import { getAuth } from 'firebase/auth';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러가 발생하고, 재시도하지 않은 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // 토큰 갱신
        const token = await user.getIdToken(true);
        sessionStorage.setItem('token', token);

        // 요청 헤더에 새로운 토큰 설정
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        // 요청 재시도
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
