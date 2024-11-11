'use client';

import { X } from 'lucide-react';

function ImageModal({ imageUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="relative">
        <button className="absolute top-2 right-2 text-white" onClick={onClose}>
          <X className="w-8 h-8" />
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="max-w-full max-h-screen"
        />
      </div>
    </div>
  );
}

export default ImageModal;
