'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useModalStore, authStore } from '../../states/store';
import { X, Edit, Trash, ArrowUp } from 'lucide-react'; // 아이콘 추가
import { deletePost } from '../../lib/api/feedApi';
import { FaHeart, FaComment } from 'react-icons/fa';
import CommentComponent from './CommentComponent';
import EditPostComponent from './feedEdit';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

// 댓글 가져오기 함수
const fetchComments = async (postId) => {
  const response = await axios.get(`/api/comments?postId=${postId}`);
  return response.data;
};

// 댓글 작성 함수
const createComment = async (newComment) => {
  const response = await axios.post('/api/comments', newComment);
  return response.data;
};

// 댓글 삭제 함수
const deleteCommentApi = async ({ commentId, postId }) => {
  return await axios.delete(`/api/comments?commentId=${commentId}&postId=${postId}`);
};

// 이미지 모달 컴포넌트
const ImageModal = ({ imageUrl, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
    <div className="relative">
      <button
        className="absolute top-2 right-2 text-white"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <img src={imageUrl} alt="Full size" className="max-w-full max-h-screen" />
    </div>
  </div>
);

const CommentSection = ({ postId }) => {
  const queryClient = useQueryClient();
  const { email, isLoggedIn } = authStore();
  const [commentText, setCommentText] = useState('');

  // useQuery로 댓글 불러오기
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  // 댓글 작성 Mutation
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  // 댓글 삭제 Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  // 댓글 저장 함수
  const handleCommentSave = () => {
    if (!commentText.trim()) return;
    if (!isLoggedIn || !email) {
      alert('로그인이 필요합니다.');
      setCommentText('');
      return;
    }

    const newComment = { postId, content: commentText, userId: email };
    createCommentMutation.mutate(newComment);
    setCommentText('');
  };

  if (isLoading) {
    return <p>댓글을 불러오는 중...</p>;
  }

  return (
    <div>
      <div className="mt-4 flex items-center space-x-2 w-full"> {/* 댓글 입력 영역 너비 조정 */}
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full" // 너비 조정
        />
        <button
          onClick={handleCommentSave}
          className="px-1 py-1 bg-black text-white rounded-full transition-all hover:bg-[#d6d6d6]"
        >
          <ArrowUp />
        </button>
      </div>

      <div className="comments-list mt-4">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentComponent
              key={comment.id}
              profileImage={comment.profileImage}
              commentId={comment.id}
              postId={postId}
              currentUserId={email}
              userId={comment.userId}
              nickname={comment.nickname}
              comment={comment.content}
              createdAt={comment.createdAt}
              onDelete={() => deleteCommentMutation.mutate({ commentId: comment.id, postId })}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

const FeedDetail = ({ nickname, userId, content, images, postId, time, likeCount, commentCount, profileImage }) => {
  const { closeModal } = useModalStore();
  const [isEditing, setIsEditing] = useState(false);
  const { email } = authStore();
  const [selectedImage, setSelectedImage] = useState(null); // 이미지 클릭 시 모달 표시용 상태

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
    <div className="relative p-3 bg-white rounded-lg overflow-hidden w-full mx-auto"> {/* 가로 길이 확장 */}
      <button onClick={closeModal}>
        <X className="w-5 h-5 absolute top-2 right-2 z-25" />
      </button>


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
          <FaHeart className="mr-1 text-red-500" />
          <span>{likeCount}</span>
          <FaComment className="ml-4 mr-1 text-black-500" />
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
  );
};

export default FeedDetail;
