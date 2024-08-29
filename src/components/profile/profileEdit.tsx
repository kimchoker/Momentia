"use client"
import { Profile, ProfileFallback, ProfileImage } from "../ui/profile";
import { Button } from "../ui/button";
import { authStore } from "../../states/store";

const ProfileEdit = () => {
  const { email, nickname, bio, follower, following, profileImage } = authStore(state => ({
    email: state.email,
    nickname: state.nickname,
    bio: state.bio,
    follower: state.follower,
    following: state.following,
    profileImage: state.profileImage,
  }));

  return (
    <div>

		</div>
  );
};

export default ProfileEdit;
