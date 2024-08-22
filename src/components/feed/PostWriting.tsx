"use client";

import React, { useState } from 'react';
import { uploadImage } from '../../services/clientApi';
import Cookies from 'js-cookie';
import { savePost } from '../../services/clientApi';
import { useModalStore } from '../../states/store';
import { Button } from '../ui/button';


interface WritingComponentProps {
  placeholder?: string;
}

const WritingComponent: React.FC<WritingComponentProps> = ({ placeholder }) => {
  const [content, setContent] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; fileName: string }[]>([]); // 업로드된 이미지 정보 저장
  const { closeModal } = useModalStore();

  // 텍스트 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 이미지 선택 핸들러 (다중 파일 선택 가능)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages([...selectedImages, ...newImages]);

      // 선택된 이미지의 URL을 미리보기 위해 생성
      const newPreviewUrls = newImages.map(image => URL.createObjectURL(image));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  // 이미지 업로드 및 글 저장 처리
  const handlePostSubmit = async () => {
    try {
      // 쿠키에서 저장된 토큰 가져오기
      const token = Cookies.get('token');

      // 토큰이 없으면 함수 종료
      if (!token) return;

      // 서버에 토큰을 보내 사용자 UID를 얻음
      const response = await fetch("/api/getuseruid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: token }),
      });

      const { userData } = await response.json();
      const userID = userData.uid;

      // 선택된 이미지 업로드
      const uploaded: { url: string; fileName: string }[] = [];
      for (const image of selectedImages) {
        const result = await uploadImage(image);
        if (result) {
          uploaded.push(result);
        }
      }

      setUploadedImages([...uploadedImages, ...uploaded]);

      // 파이어베이스에 글 데이터 저장
      const postData = {
        userId: userID, // 서버에서 받은 UID
        content: content,
        likeCount: 0,
        commentCount: 0,
        images: uploaded.map(img => ({ url: img.url, fileName: img.fileName })), // 이미지 URL과 파일 이름 포함
     };

      await savePost(postData); // 파이어베이스에 저장
      alert("게시글이 성공적으로 등록되었습니다!");

      // 초기화
      setContent('');
      setSelectedImages([]);
      setPreviewUrls([]);
      setUploadedImages([]);
      closeModal()
    } catch (e) {
      console.error("게시글 저장 중 오류 발생:", e);
    }
  };


  return (
    <div className="max-w-lg mx-auto p-1 bg-white  rounded-lg">
      <h2 className="text-2xl font-semibold mb-4"></h2>
      <textarea
        className="w-full h-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder={placeholder || '멋진 글을 올려주세요!'}
        value={content}
        onChange={handleChange}
      />

      {/* 이미지 업로드 폼 */}
      
        <input 
          type="file" 
          accept="image/*" 
          multiple // 다중 이미지 선택 가능
          onChange={handleImageChange} 
          className="mb-2"
        />
      

      {/* 선택된 이미지 미리보기 (썸네일) */}
      <div className="mt-4 flex flex-wrap">
        {previewUrls.map((url, index) => (
          <div key={index} className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden m-1">
            <img 
              src={url} 
              alt={`Preview ${index}`} 
              className="w-full h-full object-contain" // 이미지 비율을 유지하면서 박스 내에 맞춤
            />
          </div>
        ))}
      </div>
      

      <div className='mt-4 flex flex-row justify-end'>
        <Button className='mr-3' onClick={handlePostSubmit}>글쓰기</Button>
        <Button onClick={closeModal}>취소</Button>

      </div>
    </div>
    
  );
};

export default WritingComponent;
