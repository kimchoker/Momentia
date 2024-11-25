'use client';

import './globals.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { messaging } from '../lib/firebase/firebase'; // 클라이언트 메시징 가져오기
import { onMessage } from 'firebase/messaging';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration('/firebase-messaging-sw.js')
        .then((registration) => {
          if (registration) {
            console.log('Service Worker 이미 등록됨:', registration);
          } else {
            navigator.serviceWorker
              .register('/firebase-messaging-sw.js')
              .then((newRegistration) => {
                console.log('Service Worker 등록 성공:', newRegistration);
              })
              .catch((error) => {
                console.error('Service Worker 등록 실패:', error);
              });
          }
        });
    }

    // 알림 권한 요청
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('알림 권한 허용됨');
      } else if (permission === 'denied') {
        console.warn('알림 권한 거부됨');
      }
    });

    // 포그라운드 메시지 처리
    if (messaging) {
      const handleMessage = (payload: any) => {
        console.log('포그라운드 메시지 수신:', payload);

        const notificationTitle =
          payload.notification?.title || '알림 제목 없음';
        const notificationOptions = {
          body: payload.notification?.body || '알림 내용 없음',
          icon: '/icon.png', // 알림 아이콘 경로
        };

        // 브라우저 알림 표시
        new Notification(notificationTitle, notificationOptions);
      };

      // onMessage 핸들러 등록
      const unsubscribe = onMessage(messaging, handleMessage);

      // 클린업 함수로 핸들러 제거
      return () => {
        unsubscribe();
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <Head>
          <meta name="Momentia" content="" />
        </Head>
        <body className="nanumbarungothic">{children}</body>
      </html>
    </QueryClientProvider>
  );
}
