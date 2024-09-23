'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Profile, ProfileFallback, ProfileImage } from "../ui/profile";
import { Button } from "../ui/button";
import { profileEditStore, authStore } from "../../states/store";
import { MainProfileProps } from "../../types/types";
import ProfileEdit from "./new-neo-profileEdit";
import FollowButton from '../follow/followButton';
import axios from 'axios';
const MainProfile: React.FC<MainProfileProps> = ({
  email,
  nickname,
  bio,
  follower,
  following,
  profileImage,
}) => {
  const { isEditOpen, openEdit } = profileEditStore();
  const { email: loggedInUserEmail } = authStore((state) => ({
    email: state.email,
  }));

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null); // 팔로우 상태

  const isCurrentUser = email === loggedInUserEmail;

  useEffect(() => {
    // 팔로우 상태를 서버에서 가져옴
    if (!isCurrentUser) {
      const checkFollowStatus = async () => {
        try {
          const response = await axios.post('/api/follow/status', {
            loggedInUserEmail,
            targetUserEmail: email,
          });

          setIsFollowing(response.data.isFollowing);
        } catch (error) {
          console.error('팔로우 상태를 확인하는 중 오류 발생:', error);
        }
      };

      checkFollowStatus();
    }
  }, [loggedInUserEmail, email, isCurrentUser]);

  const handleEdit = () => {
    openEdit(); // 프로필 수정 열기
  };

  return (
    <div className="bg-white p-5 border-b border-[#d6d6d6] z-10 flex flex-row justify-between">
      <div className="flex flex-row">
        {/* 프로필 이미지 */}
        <Profile>
          <ProfileImage
            src={profileImage}
          />
          <ProfileFallback />
        </Profile>
        {/* 닉네임/아이디 */}
        <div className="flex flex-col ml-5 justify-evenly">
          <div className="flex flex-row">
            <p className="font-bold text-xl">{nickname}</p>
          </div>
          <p className="text-s">{email}</p>
          {/* 상태 메시지 */}
          <div className="mt-3 mb-5">
            <p className="text-s">{bio || ""}</p>
          </div>
          {/* 팔로우/팔로잉 정보 */}
          <div className="flex flex-row mb-2 text-m font-bold">
            <Link href={`/follow/${email}`} className="mr-[60px] hover:underline">
              팔로잉 {following || 0}
            </Link>
            <Link href={`/follow/${email}`} className="hover:underline">
              팔로워 {follower || 0}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {/* 내 프로필일 때만 수정 버튼 */}
        {isCurrentUser ? (
          <Button variant="outline" onClick={handleEdit}>
            프로필 수정
          </Button>
        ) : isFollowing !== null ? ( // 팔로우 상태가 확인된 경우 팔로우 버튼을 렌더링
          <FollowButton targetUserId={email} isFollowing={isFollowing} />
        ) : (
          <div>Loading...</div> // 로딩 상태
        )}
      </div>

      {/* 프로필 수정 모달 */}
      {isEditOpen && <ProfileEdit isOpen={isEditOpen} />}
    </div>
  );
};

export default MainProfile;
