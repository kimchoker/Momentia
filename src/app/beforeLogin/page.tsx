'use client';
import Link from 'next/link';

const UnauthenticatedMainPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            <Link href="/">MyApp</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              로그인
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-gray-900">
              회원가입
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
              환영합니다! MyApp에서 새로운 소셜 경험을 시작하세요.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              친구들과 연결하고, 새로운 피드를 공유해보세요. 지금 시작하세요.
            </p>
            <div className="space-x-4">
              <Link
                href="/signup"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-300"
              >
                지금 가입하기
              </Link>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner">
        <div className="container mx-auto px-6 py-4 text-center text-gray-600">
          &copy; 2024 MyApp. 모든 권리 보유.
        </div>
      </footer>
    </div>
  );
};

export default UnauthenticatedMainPage;
