"use client"
import React, { useEffect, useState } from 'react';
import { profileEditStore, authStore } from '../../states/store';
import { CirclePlus } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
}

const ProfileEdit: React.FC<ModalProps> = ({ isOpen }) => {
  const { closeEdit } = profileEditStore();
  const {
    email,
    nickname: initialNickname,
    bio: initialBio,
    profileImage: initialProfileImage,
    setNickname,
    setBio,
    setProfileImage,
  } = authStore(state => ({
    email: state.email,
    nickname: state.nickname,
    bio: state.bio,
    profileImage: state.profileImage,
    setNickname: state.setNickname,
    setBio: state.setBio,
    setProfileImage: state.setProfileImage,
  }));

  const [newNickname, setNewNickname] = useState(initialNickname);
  const [newBio, setNewBio] = useState(initialBio);
  const [newProfileImage, setNewProfileImage] = useState(initialProfileImage);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimate(true), 10); // 애니메이션을 위해 약간의 딜레이 추가
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setVisible(false), 300); // 트랜지션 시간 후에 모달을 숨김
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSave = () => {
    let hasChanges = false;

    if (newNickname !== initialNickname) {
      setNickname(newNickname);
      hasChanges = true;
    }
    if (newBio !== initialBio) {
      setBio(newBio);
      hasChanges = true;
    }
    if (newProfileImage !== initialProfileImage) {
      setProfileImage(newProfileImage);
      hasChanges = true;
    }

    if (hasChanges) {
      closeEdit(); // 변경사항이 있을 경우에만 모달을 닫음
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProfileImage(imageUrl);
    }
  };

  return (
    <>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              animate ? 'opacity-50 bg-black' : 'opacity-0 bg-black'
            }`}
            onClick={closeEdit} 
          />
          <div
            className={`relative w-[500px] h-2/5 p-6 bg-white rounded-t-lg transform transition-transform duration-300 ease-in-out ${
              animate ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {/* 닫기 버튼 (왼쪽 상단) */}
            <button
              onClick={closeEdit}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-md"
            >
              닫기
            </button>

            {/* 저장 버튼 (오른쪽 상단) */}
            <button
              onClick={handleSave}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-md"
            >
              저장
            </button>

            {/* 프로필 사진 */}
            <div className="flex justify-center mb-4 mt-10 relative">
              <img
                src={newProfileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label
                htmlFor="profileImageUpload"
                className="absolute w-24 h-24 flex items-center justify-center text-sm text-white opacity-0 hover:opacity-100 cursor-pointer rounded-full bg-black bg-opacity-50 transition-opacity"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <CirclePlus/>
              </label>
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* 닉네임 수정 인풋 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 바이오 수정 인풋 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                바이오
              </label>
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
