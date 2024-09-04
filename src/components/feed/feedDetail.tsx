import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useModalStore, authStore } from '../../states/store';
import { X, ArrowUp } from 'lucide-react';
import { deletePost } from '../../lib/api/feedApi';
import { FaHeart, FaComment } from 'react-icons/fa';
import CommentComponent from './CommentComponent';
import EditPostComponent from './feedEdit';

const FeedDetail = ({ nickname, userId, content, images, postId, time, likeCount, commentCount, profileImage }) => {
  const { closeModal } = useModalStore();
  const [isEditing, setIsEditing] = useState(false);
  const { email } = authStore();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('댓글 불러오기 실패:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSave = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      postId,
      userId: email,
      nickname,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post('/api/comments', newComment);
      setComments((prevComments) => [response.data, ...prevComments]);
      setCommentText("");
    } catch (error) {
      console.error('댓글 저장 중 오류 발생:', error);
    }
  };

  const createdAt = new Date(time);
  const formattedCreatedAt = `${createdAt.getFullYear() % 100}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일 ${createdAt.getHours()}시 ${createdAt.getMinutes()}분`;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const confirmed = confirm("정말로 이 글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deletePost(postId);
      alert("글이 성공적으로 삭제되었습니다.");
      closeModal();
    } catch (error) {
      alert("글 삭제 중 오류가 발생했습니다.");
    }
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

  return (
    <div className="relative p-3">
      <button 
        onClick={closeModal} 
        className="absolute top-2 right-2 p-1 rounded-full transition-all hover:bg-gray-300"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-row justify-start">
        <Avatar>
          <AvatarImage src={profileImage} />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col ml-3">
          <p className="font-bold">{nickname}</p>
          <p className="text-xs">{userId}</p>
          <p className="text-xs text-gray-400 mt-1">{formattedCreatedAt}</p>
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
              className="w-24 h-24 object-cover"
            />
          ))}
        </div>
      </div>

      <div className="flex items-center mt-4 text-gray-500">
        <div className="flex items-center mr-4">
          <FaHeart className="mr-1 text-red-500" />
          <span>{likeCount}</span>
        </div>
        <div className="flex items-center">
          <FaComment className="mr-1 text-black-500" />
          <span>{commentCount}</span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="댓글을 입력하세요"
        />
        <button
          onClick={handleCommentSave}
          className="px-1 py-1 bg-black text-white rounded-full transition-all hover:bg-[#d6d6d6]"
        >
          <ArrowUp />
        </button>
      </div>

      <div className="mt-4">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            commentId={comment.id}
            postId={postId}
            currentUserId={email}
            userId={comment.userId}
            nickname={comment.nickname}
            comment={comment.text}
            createdAt={comment.createdAt}
          />
        ))}
      </div>

      {email === userId && (
        <div className="flex justify-end space-x-2 mt-4">
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
      )}
    </div>
  );
};

export default FeedDetail;
