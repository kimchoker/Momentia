"use client"
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { imageArray } from '../../types/types';
import { useModalStore } from '../../states/store';
import { X } from 'lucide-react';
import EditPostComponent from './feedEdit';


const FeedDetail = ({ nickname, userId, content, images, postId }) => {
  const { closeModal } = useModalStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
		
  };


  const handleDelete = () => {
    // 여기에 삭제 로직 추가
    alert("삭제 기능은 구현되지 않았습니다.");  // 예시 경고창
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

      {/* 수정 및 삭제 버튼 */}
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

      {/* 댓글 영역 (나중에 댓글 컴포넌트를 추가) */}
      <div>댓글 부분</div>
    </div>
  );
};

export default FeedDetail;
