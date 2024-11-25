import React from 'react';

const FeedContent = ({ content, images }) => {
  return (
    <div className="mt-4">
      <p>{content}</p>
      <div className="flex gap-2 overflow-x-auto mt-2">
        {images &&
          images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.fileName}
              className="w-32 h-32 object-cover rounded-md cursor-pointer"
            />
          ))}
      </div>
    </div>
  );
};

export default FeedContent;
