import React, { useEffect, useState } from 'react';
import { profileEditStore } from '../../states/store';

interface ModalProps {
  isOpen: boolean;
}

const ProfileEdit: React.FC<ModalProps> = ({ isOpen }) => {
  const { isEditOpen, closeEdit } = profileEditStore();
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
            className={`relative w-2/5 h-2/5 p-6 bg-white rounded-t-lg transform transition-transform duration-300 ease-in-out ${
              animate ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <button
              onClick={closeEdit}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              닫기
            </button>
            
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
