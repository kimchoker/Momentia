'use client';
import React, { useState, useEffect } from 'react';
import ImageModal from './imageModal';
import EditPostComponent from './feedEdit';
import CommentSection from './CommentSection';
import AvatarProfile from '../profile/AvatarProfile'; // AvatarProfile 임포트
import { useModalStore } from '../../states/store';
import { X, Edit, Trash } from 'lucide-react'; // 아이콘 추가
import { deletePost, likePost, unlikePost } from '../../lib/api/feedApi';
import { FaHeart, FaComment } from 'react-icons/fa';
import { ScrollArea } from '../ui/scroll-area';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const FeedDetail = ({
  nickname,
  userId,
  content,
  images,
  postId,
  time,
  likeCount,
  commentCount,
  profileImage,
}) => {
  const queryClient = useQueryClient();
  const { closeModal, setModalTitle } = useModalStore();

  // 사용자 데이터를 상태로 관리
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

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasLiked, setHasLiked] = useState(false); // 좋아요 여부 상태
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount); // likeCount 상태로 관리

  // 좋아요 추가 Mutation
  const likeMutation = useMutation({
    mutationFn: () => likePost(postId, userData.email),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previousPost = queryClient.getQueryData(['post', postId]);

      queryClient.setQueryData(['post', postId], (oldData: any) => {
        if (oldData && typeof oldData === 'object' && 'likeCount' in oldData) {
          return {
            ...oldData,
            likeCount: oldData.likeCount + 1,
          };
        }
        return oldData;
      });

      setHasLiked(true);
      setCurrentLikeCount((prevCount) => prevCount + 1);

      return { previousPost };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['post', postId], context.previousPost);
      setHasLiked(false);
      setCurrentLikeCount((prevCount) => prevCount - 1);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // 좋아요 취소 Mutation
  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(postId, userData.email),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previousPost = queryClient.getQueryData(['post', postId]);

      queryClient.setQueryData(['post', postId], (oldData: any) => {
        if (oldData && typeof oldData === 'object' && 'likeCount' in oldData) {
          return {
            ...oldData,
            likeCount: oldData.likeCount - 1,
          };
        }
        return oldData;
      });

      setHasLiked(false);
      setCurrentLikeCount((prevCount) => prevCount - 1);

      return { previousPost };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['post', postId], context.previousPost);
      setHasLiked(true);
      setCurrentLikeCount((prevCount) => prevCount + 1);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = () => {
    if (!userData || !userData.email) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (hasLiked) {
      unlikeMutation.mutate(postId);
    } else {
      likeMutation.mutate(postId);
    }
  };

  // 글 수정 모드
  const handleEdit = () => {
    setIsEditing(true);
    setModalTitle('글 수정하기');
  };

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

  // 작성 시간 포맷팅
  const createdAt = new Date(time);
  const formattedCreatedAt = `${createdAt.getFullYear() % 100}년 ${
    createdAt.getMonth() + 1
  }월 ${createdAt.getDate()}일 ${createdAt.getHours()}시 ${createdAt.getMinutes()}분`;

  // userData가 로드되기 전 로딩 표시
  if (!userData) {
    return <div>Loading...</div>;
  }

  // 현재 사용자가 글 작성자인지 확인
  const isAuthor = userData.email === userId;

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
    <>
      <button className="w-5 h-5" onClick={closeModal}>
        <X className="w-5 h-5 absolute top-5 right-5 z-25" />
      </button>
      <ScrollArea>
        <div className="relative p-3 bg-white rounded-lg overflow-hidden w-full mx-auto">
          {/* 프로필과 작성 시간을 같은 줄에 배치 */}
          <div className="flex justify-between items-center mb-4">
            <AvatarProfile nickname={nickname} userId={userId} profileImage={profileImage} />
            <p className="text-gray-500 text-sm">{formattedCreatedAt}</p>
          </div>

          {/* 글 내용 표시 */}
          <div className="mt-4">
            <p>{content}</p>
            <div className="flex gap-2 overflow-x-auto mt-2">
              {images &&
                images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.fileName}
                    className="w-32 h-32 object-cover rounded-md cursor-pointer"
                    onClick={() => handleImageClick(image.url)}
                  />
                ))}
            </div>
          </div>

          {/* 좋아요/댓글수와 수정/삭제 버튼을 같은 줄에 배치 */}
          <div className="flex items-center justify-between mt-4 text-gray-500">
            <div className="flex items-center justify-start">
              <button onClick={handleLikeClick} className="focus:outline-none flex flex-row">
                <FaHeart className={`m-2 ${hasLiked ? 'text-red-500' : 'text-gray-500'}`} />
                <span className="mt-1">{currentLikeCount}</span>
              </button>
              <div className="flex flex-row">
                <FaComment className="m-2 text-gray-500" />
                <span className="mt-1">{commentCount}</span>
              </div>
            </div>

            {isAuthor && (
              <div className="flex space-x-2">
                <button onClick={handleEdit} className="p-1 text-gray-500 hover:text-black">
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={handleDelete} className="p-1 text-gray-500 hover:text-red-500">
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <hr className="my-6 border-gray-300" />

          {/* 댓글 섹션 */}
          <CommentSection postId={postId} />

          {/* 이미지 모달 */}
          {selectedImage && (
            <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default FeedDetail;
