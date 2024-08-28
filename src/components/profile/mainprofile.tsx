"use client"
import { Profile, ProfileFallback, ProfileImage } from "../ui/profile";
import { Button } from "../ui/button";
import { useUserStore } from "../../states/store";
import { profileEditStore } from "../../states/store";

const MainProfile = () => {
  const { email, nickname, bio, follower, following, profileImage } = useUserStore(state => ({
    email: state.email,
    nickname: state.nickname,
    bio: state.bio,
    follower: state.follower,
    following: state.following,
    profileImage: state.profileImage,
  }));

  const { isEditOpen } = profileEditStore();

  const handleEdit = () => {
    profileEditStore.getState().openEdit();
  }

  return (
    <div className="bg-[#d6d6d6] p-5 border-b-2 border-black z-10 flex flex-row justify-evenly">
      <div className="flex flex-row">
        {/* 프로필 이미지 */}
        <Profile>
          <ProfileImage src={profileImage || "https://firebasestorage.googleapis.com/v0/b/snsproject-85107.appspot.com/o/images%2Fvecteezy_user-profile-vector-flat-illustration-avatar-person-icon_37336395.jpg?alt=media&token=15901e92-e23a-4295-9b6d-c8e5715100e0"} />
          <ProfileFallback />
        </Profile>
        {/* 닉네임/아이디 */}
        <div className="flex flex-row ml-5 justify-evenly">
          <div className="flex flex-col ml-3">
            <div className="flex flex-row ">
              <p className="font-bold text-xl">{nickname}</p>
              
            </div>

            <p className="text-s">{email}</p>
            {/* 상태메시지 */}
            <div className="mt-3 mb-5">
              <p className="text-s">
                {bio || ''}
              </p>
            </div>
            <div className='flex flex-row mb-2 text-m font-bold'>
              <p className='mr-[60px]'>팔로잉 {following || 0}</p>
              <p>팔로워 {follower || 0}</p>
            </div>
          </div>
          
        </div>
        
      </div>
      <Button variant="outline" onClick={handleEdit} >프로필 수정</Button>
    </div>
  );
};

export default MainProfile;
