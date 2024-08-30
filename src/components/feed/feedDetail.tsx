"use client";
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { imageArray } from '../../types/types';
import { useModalStore } from '../../states/store';
import { X } from 'lucide-react';
import EditPostComponent from './feedEdit';
import { deletePost } from '../../services/clientApi';
import { authStore } from '../../states/store';
import Cookies from 'js-cookie';

const FeedDetail = ({ nickname, userId, content, images, postId }) => {
  const { closeModal } = useModalStore();
  const [isEditing, setIsEditing] = useState(false);
  const { email } = authStore();

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
      const imageFiles = images.map(image => image.fileName); // 삭제할 이미지 파일 이름 목록
      await deletePost(postId, imageFiles); // 삭제 요청 실행
      closeModal();
      // 삭제 후 추가 작업 (예: UI에서 글 삭제, 페이지 새로고침 등)
    } catch (error) {
      console.error("글 삭제 중 오류가 발생했습니다:", error);
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (isEditing) {
    return (
      <div className="relative p-3">
        <EditPostComponent
          initialContent={content}
          initialImages={images}
          postId={postId}
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

      {/* 글과 댓글 사이의 구분선 */}
      <hr className="my-4" />

      {/* 수정 및 삭제 버튼 - uid와 userId가 같을 때만 보이도록 */}
      {email === userId && (
        <div className="flex justify-end space-x-2">
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

      {/* 댓글 영역 (나중에 댓글 컴포넌트를 추가) */}
      <div>댓글 부분</div>
    </div>
  );
};

export default FeedDetail;