import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, title, children }) {
  const [shouldRender, setShouldRender] = useState(isOpen); // 렌더링 여부 상태 관리
  const [animationClass, setAnimationClass] = useState(''); // 애니메이션 클래스를 관리하는 상태

  // 모달이 열리고 닫힐 때 애니메이션 설정
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true); // 모달을 렌더링
      setTimeout(() => setAnimationClass('animate-modal-in'), 0); // 약간의 지연 후에 애니메이션 시작
    } else {
      setAnimationClass('animate-modal-out');
      setTimeout(() => setShouldRender(false), 300); // 닫히는 애니메이션이 끝난 후 DOM에서 제거
    }
  }, [isOpen]);

  if (!shouldRender) return null; // 모달이 닫힌 후 DOM에서 제거

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 모달 콘텐츠 */}
      <div
        className={`relative bg-white rounded-lg shadow-lg w-[90%] h-[90%] sm:w-[90%] md:w-3/5 p-6 transition-all duration-300 ${animationClass}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="overflow-auto h-[80%]">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
