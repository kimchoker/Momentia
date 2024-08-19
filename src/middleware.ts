import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// NextRequest: Next.js에서 들어오는 http 요청
// NextResponse: 미들웨어에서 다시 보내는 응답 -> 리디렉션, 요청 계속 등

export const middleware = (req: NextRequest) => {
  // const { pathname } = req.nextUrl;
  // const loginNecessary = ["/profile", "/notification", "/dm"];
	
	// console.log('Current Pathname:', pathname);
  // console.log('Auth Cookie:', req.cookies.get('auth'));

  // // auth 쿠키가 없으면
  // if (!req.cookies.get('auth')) {
  //   // .some() -> JS 의 배열 메소드 배열의 요소 중 최소 하나가 콜백함수에 정의된 조건에 해당하는지 확인
  //   if (loginNecessary.some((path) => pathname.startsWith(path))) {
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notification/:path*', '/dm/:path*'],
};

