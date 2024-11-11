'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sibar from '../../components/sidebar/new-neo-sidebar';

function DeleteAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // API 요청을 보내서 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/deleteAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '회원탈퇴에 실패했습니다.');
      }

      alert('회원 탈퇴가 정상적으로 완료되었습니다.');
      router.push('/'); // 탈퇴 후 메인 페이지로 리디렉션
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Sibar />
      <div className="bg-transparent p-8  w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">회원 탈퇴</h2>

        {errorMessage && (
          <div className="mb-4 text-red-600">{errorMessage}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className={`w-full px-4 py-2 text-white bg-red-600 rounded-md ${isDeleting ? 'opacity-50' : 'hover:bg-red-700'} transition-all`}
        >
          {isDeleting ? '계정 삭제 중...' : '계정 삭제'}
        </button>
      </div>
    </div>
  );
}

export default DeleteAccountPage;
