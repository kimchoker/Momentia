import React, { useState, useEffect } from 'react';
import { uploadImage, savePost } from '../../lib/api/feedApi'; // 기존 API 함수
import { useModalStore } from '../../states/store';
import { Button } from '../ui/button';
import { authStore } from '../../states/store';
import { CircleX } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query'; // react-query 추가

const WritingComponent = () => {
  const [content, setContent] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const queryClient = useQueryClient(); // useQueryClient로 queryClient 가져오기
  const { closeModal } = useModalStore();
  const { uid, email, nickname } = authStore();

  // 텍스트 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 이미지 선택 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages([...selectedImages, ...newImages]);

      const newPreviewUrls = newImages.map(image => URL.createObjectURL(image));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (index: number) => {
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // 글 작성 후 최신 피드를 불러오기 위한 Mutation
  const postMutation = useMutation({
    mutationFn: async () => {
      const uploaded: { url: string; fileName: string }[] = [];

      // 이미지 업로드
      for (const image of selectedImages) {
        const result = await uploadImage(image);
        if (result) uploaded.push(result);
      }

      const postData = {
        userId: uid,
        email: email,
        nickname: nickname,
        content,
        likeCount: 0,
        commentCount: 0,
        images: uploaded.map(img => ({ url: img.url, fileName: img.fileName })),
      };

      // 글 저장
      await savePost(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] }); // queryKey를 객체 형태로 전달
      closeModal(); // 모달 닫기
    },
    
    onError: (error) => {
      console.error("글 작성 중 오류:", error);
    },
  });

  // 글 저장 핸들러
  const handlePostSubmit = async () => {
    if (!content.trim()) {
      alert("글 내용을 입력하세요.");
      return;
    }

    postMutation.mutate(); // 글 작성 mutation 실행
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
        placeholder="Please post a great article!"
        value={content}
        onChange={handleChange}
      />
      <div>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-2" />
      </div>
      <div className="mt-4 flex flex-wrap">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative w-20 h-20 border border-gray-300 rounded-lg overflow-hidden m-1">
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleImageDelete(index)}
              className="absolute top-1 right-1 bg-transparent text-white rounded-full hover:bg-red-600"
            >
              <CircleX />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-row justify-end">
        <Button className="mr-3" onClick={handlePostSubmit}>
          Write
        </Button>
        <Button onClick={closeModal}>Cancel</Button>
      </div>
    </div>
  );
};

export default WritingComponent;
