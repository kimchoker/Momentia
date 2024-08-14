"use client"
import { uploadImage } from "../firebase/firebaseApi";
import { useState } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const upload = async() => {
    if (selectedImage) {
      try {
        const url = await uploadImage(selectedImage);
        setImageUrl(url)
      } catch(e) {
        
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum-barun-gothic">
      <form>
        <input type="file" accept="image/*" onChange={handleImageChange}/>
        <button type="submit" onClick={upload}>업로드</button>
        <p>{imageUrl}</p>
      </form>
      
    </div>
  );
}