"use client"
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useModalStore } from '../../states/store';
import FeedDetail from './feedDetail';
import { FaHeart, FaComment } from 'react-icons/fa'; // 좋아요와 댓글 아이콘을 위한 라이브러리

const FeedItem = ({ nickname, userId, content, images, postId, time, commentCount, likeCount, profileImage }) => {
  const createdAt = new Date(time);

  const formattedCreatedAt = `${createdAt.getFullYear() % 100}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일 ${createdAt.getHours()}시 ${createdAt.getMinutes()}분 ${createdAt.getSeconds()}초`;

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
    )
    openModal();
  }

  return (
    <div className="w-[100%] min-w-[500px] border-b border-[#d6d6d6] bg-white" onClick={handleClick}>
      <div className="flex flex-row justify-start ml-5 p-3 ">
        <Avatar>
          <AvatarImage src={profileImage} />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col ml-3">
          <p className="font-bold">{nickname}</p>
          <p className="text-xs text-gray-500">{userId}</p>
          <p className="text-xs text-gray-400 mt-1">{formattedCreatedAt}</p> {/* 시간 표시 */}
        </div>
      </div>
      
      {/* 글&사진 부분 */}
      <div className="p-3 ml-3 mr-3">
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

      {/* 좋아요와 댓글 부분 추가 */}
      <div className="flex justify-start ml-5 p-3 text-gray-500">
        <div className="flex items-center mr-4">
          <FaHeart className="mr-1 text-red-500" /> {/* 좋아요 아이콘 */}
          <span>{likeCount}</span> {/* 좋아요 수 */}
        </div>
        <div className="flex items-center">
          <FaComment className="mr-1 text-black-500" /> {/* 댓글 아이콘 */}
          <span>{commentCount}</span> {/* 댓글 수 */}
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
