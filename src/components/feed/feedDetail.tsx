'use client';

import React from 'react';
import FeedHeader from './feedHeader';
import FeedContent from './feedContent';
import FeedActions from './feedActions';
import CommentSection from './comment/CommentSection';

const FeedDetail = ({
  nickname,
  userId,
  content,
  images,
  postId,
  time,
  likeCount,
  commentCount,
  profileImage,
  user,
}) => {
  return (
    <div className="relative p-3 bg-white rounded-lg overflow-hidden w-full mx-auto">
      {/* 프로필 및 작성 시간 */}
      <FeedHeader
        nickname={nickname}
        userId={userId}
        profileImage={profileImage}
        time={time}
      />

      {/* 글 내용 및 이미지 */}
      <FeedContent content={content} images={images} />

      {/* 좋아요 및 댓글 버튼 */}
      <FeedActions
        postId={postId}
        likeCount={likeCount}
        commentCount={commentCount}
        user={user}
      />

      <hr className="my-6 border-gray-300" />

      {/* 댓글 섹션 */}
      <CommentSection postId={postId} />
    </div>
  );
};

export default FeedDetail;
