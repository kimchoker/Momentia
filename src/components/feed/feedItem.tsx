"use client"
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useModalStore } from '../../states/store';
import FeedDetail from './feedDetail';
import { FaHeart, FaComment } from 'react-icons/fa';

const FeedItem = ({ nickname, userId, content, images, postId, time, commentCount, likeCount, profileImage }) => {
  const createdAt = new Date(time);
  const formattedCreatedAt = `${createdAt.getFullYear()}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일`;

  const { openModal, setModalContent } = useModalStore();

  const handleClick = () => {
    setModalContent(
      <FeedDetail
        nickname={nickname}
        profileImage={profileImage}
        userId={userId}
        content={content}
        images={images}
        postId={postId}
        time={createdAt}
        commentCount={commentCount}
        likeCount={likeCount}
      />
    );
    openModal();
  };

  return (
    <div
      className="relative w-full sm:w-[90%] md:w-[90%] h-[400px] bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 p-3"
      onClick={handleClick}
      style={{
        backgroundImage: `url(${images[0]?.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for darker background on the image */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* User profile and time */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
        <Avatar>
          <AvatarImage src={profileImage} />
          <AvatarFallback />
        </Avatar>
        <div className="text-white">
          <p className="text-sm font-bold">{nickname}</p>
          <p className="text-xs text-gray-300">{formattedCreatedAt}</p>
        </div>
      </div>

      {/* 좋아요와 댓글 */}
      <div className="absolute top-3 right-3 flex items-center space-x-2 z-10 text-white">
        <FaHeart className="text-red-500" />
        <span>{likeCount}</span>
        <FaComment />
        <span>{commentCount}</span>
      </div>

      {/* 글 내용 */}
      <div className="absolute bottom-10 left-3 text-white z-10">
        <p className="text-sm font-semibold">{content}</p>
      </div>
    </div>
  );
};

export default FeedItem;
