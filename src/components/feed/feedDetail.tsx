'use client';
import React, { useState } from 'react';
import ImageModal from './imageModal';
import EditPostComponent from './feedEdit';
import CommentSection from './CommentSection';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useModalStore, authStore } from '../../states/store';
import { X, Edit, Trash } from 'lucide-react'; // 아이콘 추가
import { deletePost } from '../../lib/api/feedApi';
import { FaHeart, FaComment } from 'react-icons/fa';
import { ScrollArea } from '../ui/scroll-area';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePost, unlikePost } from '../../lib/api/feedApi';

const FeedDetail = ({ nickname, userId, content, images, postId, time, likeCount, commentCount, profileImage }) => {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();
  const { email } = authStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasLiked, setHasLiked] = useState(false); // 좋아요 여부 상태

    // 좋아요 추가 Mutation
    const likeMutation = useMutation({
      mutationFn: likePost,
      onMutate: async () => {
        // 기존 데이터를 백업
        await queryClient.cancelQueries({ queryKey: ['post', postId] });
  
        const previousPost = queryClient.getQueryData(['post', postId]);
  
        // 낙관적 업데이트: 캐시에서 likeCount를 증가
        queryClient.setQueryData(['post', postId], (oldData: any) => {
          if (oldData && typeof oldData === 'object' && 'likeCount' in oldData) {
            return {
              ...oldData,
              likeCount: (oldData as { likeCount: number }).likeCount + 1,
            };
          }
          return oldData;
        });
  
        setHasLiked(true); // UI에서 좋아요 표시를 변경
  
        return { previousPost }; // 에러 발생 시 복원할 데이터
      },
      onError: (error, variables, context) => {
        // 에러 발생 시, 캐시 복원
        queryClient.setQueryData(['post', postId], context.previousPost);
        setHasLiked(false); // UI 상태도 복원
      },
      onSettled: () => {
        // 성공/실패에 관계없이 데이터를 다시 가져옴
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
      },
    });
  
    // 좋아요 취소 Mutation
    const unlikeMutation = useMutation({
      mutationFn: unlikePost,
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ['post', postId] });
  
        const previousPost = queryClient.getQueryData(['post', postId]);
  
        queryClient.setQueryData(['post', postId], (oldData: any) => {
          if (oldData && typeof oldData === 'object' && 'likeCount' in oldData) {
            return {
              ...oldData,
              likeCount: (oldData as { likeCount: number }).likeCount - 1,
            };
          }
          return oldData;
        });
  
        setHasLiked(false);
  
        return { previousPost };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(['post', postId], context.previousPost);
        setHasLiked(true);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
      },
    });
  
  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = () => {
    if (!email) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (hasLiked) {
      // 좋아요 취소
      unlikeMutation.mutate(postId); 
    } else {
      // 좋아요 추가
      likeMutation.mutate(postId); 
    }
  };

  // 글 수정 모드
  const handleEdit = () => setIsEditing(true);

  // 글 삭제
  const handleDelete = async () => {
    const confirmed = confirm('정말로 이 글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await deletePost(postId);
      alert('글이 성공적으로 삭제되었습니다.');
      closeModal();
    } catch (error) {
      alert('글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 이미지 클릭 시 모달 표시
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
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

  // 글 작성 시간 포맷팅
  const createdAt = new Date(time);
  const formattedCreatedAt = `${createdAt.getFullYear() % 100}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일 ${createdAt.getHours()}시 ${createdAt.getMinutes()}분`;

  return (
    <>
    <button className='w-5 h-5' onClick={closeModal}>
        <X className="w-5 h-5 absolute top-5 right-5 z-25" />
      </button>
    <ScrollArea>
      <div className="relative p-3 bg-white rounded-lg overflow-hidden w-full mx-auto"> {/* 가로 길이 확장 */}
      


      <div className="flex flex-row justify-start items-center relative">
        <Avatar>
          <AvatarImage src={profileImage} />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col ml-3 text-gray-700">
          <p className="font-bold">{nickname}</p>
          <p className="text-xs">{userId}</p>
          <p className="text-xs text-gray-400 mt-1">{formattedCreatedAt}</p>
        </div>
        <div className="absolute top-0 right-0 text-gray-600">
          {email === userId && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-500 hover:text-black"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-500 hover:text-red-500"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p>{content}</p>
        <div className="flex gap-2 overflow-x-auto mt-2">
          {images && images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.fileName}
              className="w-32 h-32 object-cover rounded-md cursor-pointer"
              onClick={() => handleImageClick(image.url)} // 이미지 클릭 시 모달 열기
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-gray-500">
        <div className="flex items-center">
          <button onClick={handleLikeClick} className="focus:outline-none">
            <FaHeart className={`mr-1 ${hasLiked ? 'text-red-500' : 'text-gray-500'}`} />
          </button>
          <span>{commentCount}</span>
        </div>
      </div>

      {/* 회색 선 추가로 댓글과 본문 경계 구분 */}
      <hr className="my-6 border-gray-300" />

      {/* CommentSection 컴포넌트 */}
      <CommentSection postId={postId} />

      {/* 이미지 모달 표시 */}
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
    </ScrollArea>
    
    </>
    
  );
};

export default FeedDetail;
