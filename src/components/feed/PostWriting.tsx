"use client"

import React, { useState } from 'react';

interface WritingComponentProps {
  placeholder?: string;
}

const WritingComponent: React.FC<WritingComponentProps> = ({ placeholder }) => {
  const [content, setContent] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Write Something:</h2>
      <textarea
        className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={placeholder || 'Start writing...'}
        value={content}
        onChange={handleChange}
      />
      <div className="mt-4">
        <p className="text-gray-700">Preview:</p>
        <div className="p-3 mt-2 border border-gray-300 rounded-lg bg-gray-100">
          {content || 'Your text will appear here...'}
        </div>
      </div>
    </div>
  );
};

export default WritingComponent;