import React, { useState, useEffect } from 'react';
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
  const [uploadedImages, setUploadedImages] = useState<{ url: string; fileName: string }[]>([]);
  const [userInfo, setUserInfo] = useState<{ uid: string; email: string; nickname: string } | null>(null);
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

  // 유저 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await fetch("/api/getuseruid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      if (!response.ok) throw new Error(`Failed to fetch user info: ${await response.text()}`);

      const data = await response.json();
      setUserInfo({ uid: data.uid, email: data.email, nickname: data.nickname });
    } catch (e) {
      console.error("Error fetching user info:", e);
    }
  };

  // 이미지 업로드 및 글 저장 처리
  const handlePostSubmit = async () => {
    try {
      if (!userInfo) {
        await fetchUserInfo();
        if (!userInfo) throw new Error('User information is missing.');
      }

      const uploaded: { url: string; fileName: string }[] = [];
      for (const image of selectedImages) {
        const result = await uploadImage(image);
        if (result) uploaded.push(result);
      }

      setUploadedImages([...uploadedImages, ...uploaded]);

      const postData = {
        userId: userInfo.uid,
        email: userInfo.email,
        nickname: userInfo.nickname,
        content,
        likeCount: 0,
        commentCount: 0,
        images: uploaded.map(img => ({ url: img.url, fileName: img.fileName })),
      };

      await savePost(postData);
      alert("The post has been successfully registered!");

      setContent('');
      setSelectedImages([]);
      setPreviewUrls([]);
      setUploadedImages([]);
      closeModal();
    } catch (e) {
      console.error("An error occurred while saving the post:", e);
    }
  };

  useEffect(() => {
    // Fetch user info on component mount
    fetchUserInfo();

    // Prevent memory leak - release preview URLs
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="max-w-lg mx-auto p-1 bg-white rounded-lg">
      <textarea
        className="w-full h-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder={placeholder || 'Please post a great article!'}
        value={content}
        onChange={handleChange}
      />

      <div>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-2"/>
      </div>

      <div className="mt-4 flex flex-wrap">
        {previewUrls.map((url, index) => (
          <div key={index} className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden m-1">
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-contain"/>
          </div>
        ))}
      </div>

      <div className='mt-4 flex flex-row justify-end'>
        <Button className='mr-3' onClick={handlePostSubmit}>Write</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </div>
    </div>
  );
};

export default WritingComponent;
