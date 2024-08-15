"use client"
import { uploadImage } from "../firebase/firebaseApi";
import { useState } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const upload = async() => {
    event.preventDefault();
    if (selectedImage) {
      try {
        const url = await uploadImage(selectedImage);
        setImageUrl(url)
      } catch(e) {
        console.error("Error uploading image:", e);
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum-barun-gothic">
      <form onSubmit={upload}>
        <input type="file" accept="image/*" onChange={handleImageChange}/>
        <button type="submit">업로드</button>
        {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </div>
      )}
      </form>
      
    </div>
  );
}