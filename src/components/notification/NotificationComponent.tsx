'use client';

import React from 'react';
import { Notification } from '../../types/types';

// 댓글 알림 컴포넌트
function CommentNotification({ user, content, createdAt }: Notification) {
  return (
    <div className="p-4 border-b">
      <p>
        <strong>{user}</strong>님이 당신의 글에 댓글을 남겼습니다: "{content}"
      </p>
      <p className="text-gray-500 text-sm">{createdAt}</p>
    </div>
  );
}

// 좋아요 알림 컴포넌트
function LikeNotification({ user, createdAt }: Notification) {
  return (
    <div className="p-4 border-b">
      <p>
        <strong>{user}</strong>님이 당신의 글을 좋아합니다.
      </p>
      <p className="text-gray-500 text-sm">{createdAt}</p>
    </div>
  );
}

// 메인 알림 컴포넌트
function NotificationItem(props: Notification) {
  switch (props.type) {
    case 'comment':
      return <CommentNotification {...props} />;
    case 'like':
      return <LikeNotification {...props} />;
    default:
      return null;
  }
}

export default NotificationItem;
