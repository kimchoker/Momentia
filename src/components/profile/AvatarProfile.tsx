"use client"
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useModalStore } from '../../states/store';
import { useStore } from 'zustand';

const AvatarProfile = ({ nickname, userId, profileImage }) => {
  const router = useRouter();
  const { closeModal } = useStore(useModalStore); 

  const handleProfileClick = () => {
    router.push(`/profile/${userId}`);
    closeModal();
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={handleProfileClick}
    >
      <Avatar>
        <AvatarImage src={profileImage} />
        <AvatarFallback />
      </Avatar>
      <div className="text-black">
        <p className="text-md font-bold">{nickname}</p>
        <p>{userId}</p>
      </div>
    </div>
  );
};

export default AvatarProfile;
