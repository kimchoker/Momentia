importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAo-GG89U2cA723lNC9PtC9SpNrkwaO_xs",
  authDomain: "snsproject-85107.firebaseapp.com",
  projectId: "snsproject-85107",
  storageBucket: "snsproject-85107.appspot.com",
  messagingSenderId: "273535426800",
  appId: "1:273535426800:web:d14c2cf64fe2468a232235",
});

const messaging = firebase.messaging();

// 백그라운드 알림 수신 처리
messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드에서 알림 수신:', payload);
  const notificationTitle = payload.notification?.title || '백그라운드 알림';
  const notificationOptions = {
    body: payload.notification?.body || '알림 내용 없음',
    icon: '/firebase-logo.png', // 알림에 표시할 아이콘 이미지
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});