import { NextRequest, NextResponse } from 'next/server';

// 로그인 상태를 확인하는 미들웨어
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // 쿠키에 저장된 로그인 토큰 가져오기

  const url = req.nextUrl.clone();

  if (!token) {
    // 로그인되지 않은 상태:
    if (url.pathname === '/') {
      url.pathname = '/beforeLogin';
      return NextResponse.rewrite(url);
    }
  } else {
    // 로그인된 상태:
    if (url.pathname === '/') {
      url.pathname = '/main';
      return NextResponse.rewrite(url);
    }
  }

  // 그 외의 요청은 원래대로 처리
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/main', '/', '/beforeLogin'], // 적용 경로 설정
};
