"use client"
import { Profile, ProfileFallback, ProfileImage } from "../ui/profile";
import { Button } from "../ui/button";
import { useUserStore } from "../../states/store";

const MainProfile = () => {
  const { email, nickname, bio, follower, following, profileImage } = useUserStore(state => ({
    email: state.email,
    nickname: state.nickname,
    bio: state.bio,
    follower: state.follower,
    following: state.following,
    profileImage: state.profileImage,
  }));

  return (
    <div className="bg-[#d6d6d6] p-5 border-b-2 border-black z-10">
      <div className="flex flex-row justify-start">
        {/* 프로필 이미지 */}
        <Profile>
          <ProfileImage src={profileImage || "default-profile-image-url"} />
          <ProfileFallback />
        </Profile>
        {/* 닉네임/아이디 */}
        <div className="flex flex-row justify-end ml-5">
          <div className="flex flex-col ml-3">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">{nickname}</p>
              <Button variant="outline">프로필 수정</Button>
            </div>
            <p className="text-s">{email}</p>
            {/* 상태메시지 */}
            <div className="mt-3 mb-5">
              <p className="text-s">
                {bio || ''}
              </p>
            </div>
            <div className='flex flex-row justify-start mb-2 text-m font-bold'>
              <p className='mr-[120px]'>팔로잉 {following || 0}</p>
              <p>팔로워 {follower || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProfile;
