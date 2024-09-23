'use client';
import "./globals.css";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useStore } from 'zustand';
import { authStore } from '../states/store'; // zustand 스토어 가져오기
import { fetchUserProfile } from '../lib/api/userApi'; // 사용자 정보를 가져오는 API

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, setUser, login } = useStore(authStore);

  // useEffect(() => {
  //   // 새로고침 시 쿠키에서 토큰을 읽고 상태 복원
  //   const storedToken = Cookies.get('token');
  //   if (storedToken && !token) {
  //     login(storedToken); // 토큰을 zustand 상태에 저장
  //     fetchUserProfile(storedToken) // 사용자 정보 불러오기
  //       .then((userData) => {
  //         setUser(userData); // 사용자 정보 저장
  //       })
  //       .catch((error) => {
  //         console.error('Failed to fetch user profile:', error);
  //       });
  //   }
  // }, [token, login, setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <Head>
          <meta name="description" content=""/>
        </Head>
        <body className="nanumbarungothic">
          {children}
        </body>
      </html>
    </QueryClientProvider>
  );
}
