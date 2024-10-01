import React, { useState, useEffect, useCallback, useRef } from 'react';
import { uploadImage, savePost } from '../../lib/api/feedApi';
import { useModalStore } from '../../states/store';
import { Button } from '../ui/button';
import { CircleX } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'IMAGE'; // 드래그 가능한 아이템 타입

// 이미지 썸네일 컴포넌트
const DraggableImage = ({ url, index, moveImage, handleImageDelete }: any) => {
  const ref = useRef<HTMLDivElement>(null); // useRef로 ref 생성

  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: any) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref)); // drag와 drop을 결합

  return (
    <div ref={ref} className="relative w-20 h-20 border border-gray-300 rounded-lg overflow-hidden m-1">
      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={() => handleImageDelete(index)}
        className="absolute top-1 right-1 bg-transparent text-white rounded-full hover:bg-red-600"
      >
        <CircleX />
      </button>
    </div>
  );
};

const WritingComponent = () => {
  const [content, setContent] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();


  const [userData, setUserData] = useState(null);

    useEffect(() => {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } else {
        alert('로그인이 필요합니다.');
        // 필요하다면 로그인 페이지로 리다이렉트
        // router.push('/login');
      }
    }, []);

  // 텍스트 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 이미지 선택 핸들러 (최대 5장 제한)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      const totalImages = selectedImages.length + newImages.length;

      if (totalImages > 5) {
        alert('이미지는 최대 5장까지 업로드할 수 있습니다.');
        return;
      }

      setSelectedImages([...selectedImages, ...newImages]);

      const newPreviewUrls = newImages.map(image => URL.createObjectURL(image));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  // 이미지 순서 변경 핸들러
  const moveImage = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newPreviewUrls = [...previewUrls];
      const draggedUrl = newPreviewUrls[dragIndex];
      newPreviewUrls.splice(dragIndex, 1);
      newPreviewUrls.splice(hoverIndex, 0, draggedUrl);
      setPreviewUrls(newPreviewUrls);

      const newSelectedImages = [...selectedImages];
      const draggedImage = newSelectedImages[dragIndex];
      newSelectedImages.splice(dragIndex, 1);
      newSelectedImages.splice(hoverIndex, 0, draggedImage);
      setSelectedImages(newSelectedImages);
    },
    [previewUrls, selectedImages]
  );

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
        userId: userData.uid,
        email: userData.email,
        content,
        likeCount: 0,
        commentCount: 0,
        images: uploaded.map(img => ({ url: img.url, fileName: img.fileName })),
      };

      // 글 저장
      await savePost(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      closeModal();
    },
    onError: (error) => {
      console.error('글 작성 중 오류:', error);
    },
  });

  // 글 저장 핸들러
  const handlePostSubmit = async () => {
    if (!content.trim()) {
      alert('글 내용을 입력하세요.');
      return;
    }

    postMutation.mutate();
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-full h-full p-1 bg-white rounded-lg overflow-auto">
        <textarea
          className="w-[100%] p-3 border border-gray-300 min-h-40 h-[75%] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="글을 작성해주세요."
          value={content}
          onChange={handleChange}
        />
        <div className="mb-2">
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block px-4 py-2 bg-black transition-all 0.1s ease-in text-white rounded-md shadow-sm hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            이미지 업로드
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="mt-4 flex flex-wrap">
          {previewUrls.map((url, index) => (
            <DraggableImage
              key={index}
              url={url}
              index={index}
              moveImage={moveImage}
              handleImageDelete={handleImageDelete}
            />
          ))}
        </div>
        <div className="mt-4 relative bottom-2 right-2 flex flex-row justify-end">
          <Button className="mr-3" onClick={handlePostSubmit}>
            글쓰기
          </Button>
          <Button onClick={closeModal}>취소</Button>
        </div>
      </div>
    </DndProvider>
  );
};

export default WritingComponent;
