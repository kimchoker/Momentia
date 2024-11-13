/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { CirclePlus } from 'lucide-react';
import axios from 'axios';
import { profileEditStore } from '../../states/store';
// `authStore` 임포트 제거

interface ModalProps {
  isOpen: boolean;
}

interface UserData {
  uid: string;
  email: string;
  nickname: string;
  bio: string;
  profileImage: string;
  follower: string;
  following: number;
}

const ProfileEdit: React.FC<ModalProps> = ({ isOpen }) => {
  const { closeEdit } = profileEditStore((state) => ({
    closeEdit: state.closeEdit,
  }));

  // 세션 스토리지에서 사용자 정보 초기화
  const [email, setEmail] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newProfileImage, setNewProfileImage] = useState('');
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimate(true), 10); // 애니메이션을 위해 딜레이 추가
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setVisible(false), 300); // 트랜지션 시간 후 모달 숨김
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    // 세션 스토리지에서 사용자 데이터 가져오기
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const userData: UserData = JSON.parse(storedUserData);
      setEmail(userData.email || '');
      setNewNickname(userData.nickname || '');
      setNewBio(userData.bio || '');
      setNewProfileImage(userData.profileImage || '');
    } else {
      // 사용자 데이터가 없을 경우 처리 (예: 로그인 페이지로 이동)
      alert('로그인이 필요합니다.');
      // 필요하다면 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
    }
  }, []);

  const handleSave = async () => {
    let hasChanges = false;

    // 세션 스토리지에서 사용자 데이터 가져오기
    const storedUserData = sessionStorage.getItem('userData');
    let userData: UserData;
    if (storedUserData) {
      userData = JSON.parse(storedUserData);
    } else {
      alert('로그인이 필요합니다.');
      return;
    }

    // 변경 사항 확인 및 userData 업데이트
    if (newNickname !== userData.nickname) {
      userData.nickname = newNickname;
      hasChanges = true;
    }
    if (newBio !== userData.bio) {
      userData.bio = newBio;
      hasChanges = true;
    }
    if (newProfileImage !== userData.profileImage) {
      userData.profileImage = newProfileImage;
      hasChanges = true;
    }

    if (hasChanges) {
      try {
        const idToken = sessionStorage.getItem('token'); // 세션 스토리지에서 토큰 가져오기
        const response = await axios.post('/api/profile', {
          idToken,
          nickname: newNickname,
          bio: newBio,
          profileImage: newProfileImage,
        });

        if (response.status === 200) {
          console.log('프로필 업데이트 성공:', response.data);
          // 업데이트된 사용자 정보를 세션 스토리지에 저장
          sessionStorage.setItem('userData', JSON.stringify(userData));
        } else {
          console.error('프로필 업데이트 실패:', response.statusText);
        }

        closeEdit(); // 변경사항이 있을 경우에만 모달 닫기
      } catch (error) {
        console.error('프로필 업데이트 중 오류 발생:', error);
      }
    } else {
      // 변경사항이 없을 경우 모달 닫기
      closeEdit();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result as string); // 이미지 데이터를 Base64로 변환
      };
      reader.readAsDataURL(file);
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
            {/* 닫기 버튼 */}
            <button
              onClick={closeEdit}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-md"
            >
              닫기
            </button>

            {/* 저장 버튼 */}
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
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CirclePlus />
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
