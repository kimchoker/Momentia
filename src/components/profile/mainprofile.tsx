'use client';

import Link from 'next/link';
import { Profile, ProfileFallback, ProfileImage } from "../ui/profile";
import { Button } from "../ui/button";
import { profileEditStore, authStore } from "../../states/store";
import { MainProfileProps } from "../../types/types";
import ProfileEdit from "./new-neo-profileEdit";

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

  const isCurrentUser = email === loggedInUserEmail;

  const handleEdit = () => {
    openEdit(); // 프로필 수정 열기
  };

  return (
    <div className="bg-white p-5 border-b border-[#d6d6d6] z-10 flex flex-row justify-between">
      <div className="flex flex-row">
        {/* 프로필 이미지 */}
        <Profile>
          <ProfileImage
            src={
              profileImage ||
              "https://firebasestorage.googleapis.com/v0/b/snsproject-85107.appspot.com/o/images%2Fvecteezy_user-profile-vector-flat-illustration-avatar-person-icon_37336395.jpg?alt=media&token=15901e92-e23a-4295-9b6d-c8e5715100e0"
            }
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
            <Link href={`/profile/${email}/following`} className="mr-[60px] hover:underline">
              팔로잉 {following || 0}
            </Link>
            <Link href={`/profile/${email}/followers`} className="hover:underline">
              팔로워 {follower || 0}
            </Link>
          </div>
        </div>
      </div>

      {/* 프로필 수정 버튼은 내 프로필일 때만 표시 */}
      {isCurrentUser && (
        <Button variant="outline" onClick={handleEdit}>
          프로필 수정
        </Button>
      )}

      {/* 프로필 수정 모달 */}
      {isEditOpen && <ProfileEdit isOpen={isEditOpen} />}
    </div>
  );
};

export default MainProfile;
