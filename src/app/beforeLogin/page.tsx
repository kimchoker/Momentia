'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import Image from 'next/image';
import logo from "../../../public/images/Logo.png";


const MainPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#EEEDEB] py-40">
      {/* 로고 이미지 */}
      <div className="flex flex-col items-center">
        <Image src={logo} alt="서비스 로고" width={200} height={200} className="mb-4" />
      </div>

      {/* 서비스 소개 */}
      <div className="text-center max-w-2xl px-4">
        <h2 className="text-2xl font-semibold text-black mb-4 leading-relaxed">
          하루에 한 번, 순간을 기록하다.
        </h2>
        <p className="text-base text-gray-700 leading-relaxed">
          Momentia는 하루에 딱 한 번, 최대 4장의 사진으로 당신의 특별한 순간을 기록할 수 있는 마이크로 SNS입니다. 간결한 기록으로 더 의미 있는 하루를 만들어보세요.
        </p>
      </div>

      {/* 로그인/회원가입 버튼 */}
      <div className="flex flex-col space-y-4 w-full max-w-sm mt-8">
        <Button
          onClick={() => router.push('/login')}
          className="bg-black text-white px-6 py-3 rounded-lg text-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          로그인
        </Button>

        <Button
          onClick={() => router.push('/signup')}
          className="bg-white border border-black text-black px-6 py-3 rounded-lg text-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default MainPage;
