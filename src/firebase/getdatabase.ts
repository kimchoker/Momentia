import { getDatabase, ref, set } from "firebase/database";
// 데이터베이스를 불러오기

const writeUserData = (userId :unknown, name :string, email :string, imageUrl :string) =>  {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}


export default writeUserData