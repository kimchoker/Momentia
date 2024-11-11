'use client';

import React, { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { uploadImage, updatePost } from '../../lib/api/feedApi';
import { useModalStore } from '../../states/store';
import { Button } from '../ui/button';

interface EditPostComponentProps {
  initialContent: string;
  initialImages: { url: string; fileName: string }[];
  postId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPostComponent: React.FC<EditPostComponentProps> = ({
  initialContent,
  initialImages,
  postId,
  setIsEditing,
}) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState<string>(initialContent);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialImages.map((image) => image.url),
  );
  const [uploadedImages, setUploadedImages] =
    useState<{ url: string; fileName: string }[]>(initialImages);
  const { closeModal, setModalTitle } = useModalStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages([...selectedImages, ...newImages]);
      const newPreviewUrls = newImages.map((image) =>
        URL.createObjectURL(image),
      );
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleImageDelete = (index: number) => {
    const removedUrl = previewUrls[index];
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setUploadedImages((prevImages) =>
      prevImages.filter((image) => image.url !== removedUrl),
    );
  };

  const handlePostSubmit = async () => {
    try {
      const uploaded: { url: string; fileName: string }[] = [];

      for (const image of selectedImages) {
        const result = await uploadImage(image);
        if (result) uploaded.push(result);
      }

      const removedImages = uploadedImages.filter(
        (image) => !previewUrls.includes(image.url),
      );

      const updatedPostData = {
        content,
        images: [...uploadedImages, ...uploaded],
      };

      if (!postId) {
        throw new Error('postId가 유효하지 않습니다.');
      }

      await updatePost(postId, updatedPostData, removedImages);
      alert('글이 성공적으로 수정되었습니다.');

      queryClient.setQueryData(['feeds', 'all'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            feeds: page.feeds.map((feed: any) =>
              feed.postId === postId ? { ...feed, ...updatedPostData } : feed,
            ),
          })),
        };
      });

      closeModal();
    } catch (e) {
      console.error('글 수정 중 오류가 발생했습니다:', e);
    }
  };

  useEffect(
    () => () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    },
    [previewUrls],
  );

  return (
    <div className="max-w-full p-1 bg-white rounded-lg">
      <textarea
        className="w-[100%] h-56 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder="수정할 내용을 입력하세요"
        value={content}
        onChange={handleChange}
      />

      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mb-2"
        />
      </div>

      <div className="mt-4 flex flex-wrap">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative w-20 h-20 border border-gray-300 rounded-lg overflow-hidden m-1"
          >
            <img
              src={url}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
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
          Save
        </Button>
        <Button
          onClick={() => {
            setIsEditing(false);
            setModalTitle('글 상세 페이지');
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditPostComponent;
