import React from 'react';
import MainProfile from './mainprofile';

interface ProfileInfoProps {
  email: string;
  nickname: string;
  bio: string;
  follower: number;
  following: number;
  profileImage: string;
  isCurrentUser: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ email, nickname, bio, follower, following, profileImage, isCurrentUser }) => {
  return (
    <MainProfile
      email={email}
      nickname={nickname}
      bio={bio}
      follower={follower}
      following={following}
      profileImage={profileImage}
      isCurrentUser={isCurrentUser}
    />
  );
};

export default ProfileInfo;
