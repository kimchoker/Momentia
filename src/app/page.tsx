import { uploadImage } from "../firebase/firebaseApi";

export default function Home() {
  return (
    <div>
      <form>
        <input type="file" />
        <button type="submit">업로드</button>
      </form>
      
    </div>
  );
}