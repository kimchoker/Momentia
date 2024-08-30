import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { adminAuth } from "../../../firebase/firebaseAdmin"; // Firebase Admin SDK 사용

export async function POST(req: NextRequest) {
  try {
    // 요청 본문에서 글 ID와 사용자 토큰을 추출
    const { postId, idToken } = await req.json();

    if (!postId || !idToken) {
      return NextResponse.json({ message: "Post ID and Token are required" }, { status: 400 });
    }

    // 토큰을 통해 사용자 인증
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 삭제하려는 글의 문서 참조를 가져옴
    const postRef = doc(db, "Feed", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const postData = postDoc.data();

    // 글 작성자와 현재 사용자 ID 비교
    if (postData.userId !== userId) {
      return NextResponse.json({ message: "You can only delete your own posts" }, { status: 403 });
    }

    // 글 삭제 처리
    await deleteDoc(postRef);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ message: "Failed to delete post" }, { status: 500 });
  }
}
