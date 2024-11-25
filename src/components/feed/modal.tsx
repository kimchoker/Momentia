import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-[90%] h-[90%] sm:w-[90%] md:w-3/5 p-6">
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
