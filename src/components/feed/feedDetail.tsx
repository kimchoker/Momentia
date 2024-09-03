"use client";
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { imageArray } from '../../types/types';
import { useModalStore, authStore } from '../../states/store';
import { X, ArrowUp } from 'lucide-react';
import { deletePost } from '../../services/clientApi';
import CommentComponent from './CommentComponent';
import EditPostComponent from './feedEdit';
import { FaHeart, FaComment } from 'react-icons/fa'; // 좋아요와 댓글 아이콘을 위한 라이브러리
import { getAuth } from 'firebase/auth';

const FeedDetail = ({ nickname, userId, content, images, postId, time, likes = 0, commentsCount = 0 }) => {
  const { closeModal } = useModalStore();
  const [isEditing, setIsEditing] = useState(false);
  const { email } = authStore();
  const [commentText, setCommentText] = useState(""); // 댓글 텍스트 상태 추가
  const [comments, setComments] = useState([]); // 댓글 목록 상태 추가

  const createdAt = new Date(time);
  const formattedCreatedAt = `${createdAt.getFullYear() % 100}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일 ${createdAt.getHours()}시 ${createdAt.getMinutes()}분`;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (email !== userId) {
      alert("자신이 작성한 글만 삭제할 수 있습니다.");
      return;
    }
  
    const confirmed = confirm("정말로 이 글을 삭제하시겠습니까?");
    if (!confirmed) return;
  
    try {
      // 분리된 API 함수 호출
      await deletePost(postId);
  
      alert("글이 성공적으로 삭제되었습니다.");
      closeModal();
      // 삭제 후 추가 작업 (예: UI에서 글 삭제, 페이지 새로고침 등)
    } catch (error) {
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCommentSave = () => {
    if (!commentText.trim()) return;

    // 새로운 댓글 추가
    const newComment = {
      id: Date.now(), // 임시로 고유한 ID 생성
      userId: email,
      nickname, // 현재 사용자의 닉네임
      text: commentText,
    };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  if (isEditing) {
    return (
      <div className="relative p-3">
        <EditPostComponent
          initialContent={content}
          initialImages={images}
          postId={postId}
          setIsEditing={setIsEditing} 
        />
      </div>
    );
  }

  return (
    <div className="relative p-3">
      {/* 닫기 버튼 (오른쪽 상단) */}
      <button 
        onClick={closeModal} 
        className="absolute top-2 right-2 p-1 rounded-full transition-all hover:bg-gray-300"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* 글 작성자 정보 */}
      <div className="flex flex-row justify-start">
        <Avatar>
          <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/snsproject-85107.appspot.com/o/images%2Fkuromi.jpg?alt=media&token=b82213e1-0e86-4146-b1f4-5454fcd6220e" />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col ml-3">
          <p className="font-bold">{nickname}</p>
          <p className="text-xs">{userId}</p>
          <p className="text-xs text-gray-400 mt-1">{formattedCreatedAt}</p> {/* 시간 표시 */}
        </div>
      </div>

      {/* 글 내용 및 이미지 */}
      <div className="mt-4">
        <p>{content}</p>
        <div className="flex gap-2 overflow-x-auto mt-2">
          {images && images.map((image: imageArray, index: string) => (
            <img
              key={index}
              src={image.url}
              alt={image.fileName}
              className="w-24 h-24 object-cover"
            />
          ))}
        </div>
      </div>

      {/* 좋아요 및 댓글 수 */}
      <div className="flex items-center mt-4 text-gray-500">
        <div className="flex items-center mr-4">
          <FaHeart className="mr-1 text-red-500" /> {/* 좋아요 아이콘 */}
          <span>{likes}</span> {/* 좋아요 수 */}
        </div>
        <div className="flex items-center">
          <FaComment className="mr-1 text-blue-500" /> {/* 댓글 아이콘 */}
          <span>{commentsCount}</span> {/* 댓글 수 */}
        </div>
      </div>

      {/* 글과 댓글 사이의 구분선 */}
      <hr className="my-4" />

      {/* 댓글 작성 및 저장 버튼 */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="댓글을 입력하세요"
        />
        <button
          onClick={handleCommentSave}
          className="px-1 py-1 bg-black text-white rounded-full transition-all hover:bg-[#d6d6d6]"
        >
          <ArrowUp/>
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-4">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            currentUserId={email}
          />
        ))}
      </div>

      {/* 수정 및 삭제 버튼 - email과 userId가 같을 때만 보이도록 */}
      {email === userId && (
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            onClick={handleEdit}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-[#d6d6d6]"
          >
            수정
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-[#d6d6d6]"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedDetail;
