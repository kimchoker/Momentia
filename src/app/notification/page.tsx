"use client";
import React, { useState, useEffect } from "react";
import NotificationItem from "../../components/notification/NotificationComponent";
import axios from "axios";
import { Notification } from "../../types/types";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 알림 목록을 서버에서 가져오는 함수
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("알림을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (notifications.length === 0) {
    return <p className="text-center p-4">알림이 없습니다.</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">알림</h1>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </div>
  );
};

export default NotificationsPage;
