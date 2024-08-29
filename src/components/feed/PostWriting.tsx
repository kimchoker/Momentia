import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../services/clientApi';
import { savePost } from '../../services/clientApi';
import { useModalStore } from '../../states/store';
import { Button } from '../ui/button';
import { fetchUserInfo } from '../../services/clientApi';
import { authStore } from '../../states/store';
import { CircleX } from 'lucide-react';

interface WritingComponentProps {
  placeholder?: string;
}

const WritingComponent: React.FC<WritingComponentProps> = ({ placeholder }) => {
  const [content, setContent] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; fileName: string }[]>([]);
  const { closeModal } = useModalStore();
  const { isLoggedIn, uid, email, nickname } = authStore();
  console.log("글쓰기 컴포넌트 상태:", isLoggedIn, uid, email, nickname)


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
  const handleImageDelete = (index: number) => {
    // 삭제할 이미지의 URL과 파일 객체를 필터링
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // 이미지 업로드 및 글 저장 처리
  const handlePostSubmit = async () => {
    try {
    

      const uploaded: { url: string; fileName: string }[] = [];
      for (const image of selectedImages) {
        const result = await uploadImage(image);
        if (result) uploaded.push(result);
      }

      setUploadedImages([...uploadedImages, ...uploaded]);

      const postData = {
        userId: uid,
        email: email,
        nickname: nickname,
        content,
        likeCount: 0,
        commentCount: 0,
        images: uploaded.map(img => ({ url: img.url, fileName: img.fileName })),
      };

      await savePost(postData);
      alert("새 글이 등록되었습니다.");

      setContent('');
      setSelectedImages([]);
      setPreviewUrls([]);
      setUploadedImages([]);
      closeModal();
    } catch (e) {
      console.error("글 작성 중 오류가 발생했습니다 :", e);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="max-w-full p-1 bg-white rounded-lg">
      <textarea
        className="w-[100%] h-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder={placeholder || 'Please post a great article!'}
        value={content}
        onChange={handleChange}
      />

      <div>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-2"/>
      </div>

      <div className="mt-4 flex flex-wrap">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative w-20 h-20 border border-gray-300 rounded-lg overflow-hidden m-1">
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover"/>
            <button
              type="button"
              onClick={() => handleImageDelete(index)}
              className="absolute top-1 right-1 bg-transparent text-white rounded-full hover:bg-red-600"
            >
              <CircleX/>
            </button>
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
