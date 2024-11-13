'use client';

import React, { useState, useEffect } from 'react';
import { BsEnvelope, BsLock } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { validateEmail } from '../../lib/validation/validation';
import { login, fetchUserInfo } from '../../lib/api/userApi';

const Login: React.FC = () => {
  const router = useRouter();
  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputPW, setInputPW] = useState<string>('');
  const [validate, setValidate] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateEmail(event.target.value, setInputEmail, setValidate);
  };

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  useEffect(() => {
    if (inputEmail !== '' && validate && inputPW !== '') {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [inputEmail, validate, inputPW]);

  // 로그인 시 처리
  const handleLogin = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!inputEmail || !inputPW) {
      setErrorMessage('이메일을 입력해 주세요.');
      return;
    }

    try {
      const user = await login(inputEmail, inputPW);
      console.log(user);
      if (user) {
        // 새로운 토큰 발급 및 세션 스토리지에 저장
        const token = await user.getIdToken(true);
        console.log('로그인 성공');
        sessionStorage.setItem('token', token);

        // 토큰을 fetchUserInfo 함수에 전달
        const userData = await fetchUserInfo(token); // 사용자 정보 가져오기
        console.log(userData);

        if (userData) {
          sessionStorage.setItem('userData', JSON.stringify(userData));
          router.push('/main');
        } else {
          setErrorMessage('사용자 정보를 가져오는 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error: any) {
      console.error('로그인 실패:', error);
      setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const [isIDFocused, setIsIDFocused] = useState<boolean>(false);
  const [isPWFocused, setIsPWFocused] = useState<boolean>(false);

  return (
    <div className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum-barun-gothic">
      <div className="flex justify-center items-center h-3/5 w-2/5 min-w-[300px] min-h-[500px] max-w-[600px] bg-white">
        <div className="w-4/5 flex flex-col">
          <h5 className="font-bold text-lg">로그인</h5>
          <hr />

          {/* 오류 메시지 출력 */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          {/* form 요소 추가 */}
          <form onSubmit={handleLogin} className="contents">
            <div className="mb-4 flex flex-col">
              <label htmlFor="id" className="mb-2 font-bold text-sm">
                아이디
              </label>
              <div
                className={`flex items-center 
                            border rounded p-2 h-9 
                            transition-colors duration-500 
                            bg-transparent 
                            hover:bg-[#EEEDEB]
                            ${validate ? '' : 'border-red-500'}
                            ${
                              isIDFocused
                                ? 'bg-[#EEEDEB] border-2 border-black'
                                : 'border-[#EEEDEB]'
                            }
                          `}
              >
                <BsEnvelope />
                <input
                  name="username"
                  id="id"
                  type="email"
                  value={inputEmail}
                  onChange={onChangeEmail}
                  onFocus={() => setIsIDFocused(true)}
                  onBlur={() => setIsIDFocused(false)}
                  className="w-full p-2 
                            box-border 
                            border-none 
                            bg-transparent 
                            focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-col">
              <label htmlFor="pw" className="mb-2 font-bold text-sm">
                비밀번호
              </label>
              <div
                className={`flex items-center 
                            border rounded p-2 h-9 
                            transition-colors duration-500 
                            border #E3E1D9
                            bg-transparent
                            hover:bg-[#EEEDEB]
                            ${
                              isPWFocused
                                ? 'bg-[#EEEDEB] border-2 border-[#000000]'
                                : 'border-[#EEEDEB]'
                            }
                `}
              >
                <BsLock />
                <input
                  name="password"
                  id="pw"
                  type="password"
                  value={inputPW}
                  onChange={(event) => setInputPW(event.target.value)}
                  onFocus={() => setIsPWFocused(true)}
                  onBlur={() => setIsPWFocused(false)}
                  className="w-full p-2 box-border border-none bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit" // 버튼 타입을 submit으로 변경
              disabled={buttonDisabled}
              className="flex 
                        justify-center 
                        items-center 
                        text-center 
                        rounded bg-black 
                        border-transparent h-9 
                        transition-all duration-300 p-2 
                        disabled:bg-[#C7C8CC] 
                        "
            >
              <p className="text-white text-sm mb-0">로그인</p>
            </button>
          </form>

          <div className="text-xs text-center text-[#C7C8CC] mt-2 cursor-pointer mb-2">
            도움이 필요하신가요?
          </div>

          <hr className="mb-2" />

          <button
            onClick={() => router.push('/signup')}
            className="h-9 rounded p-2 border border-[#E3E1D9] bg-transparent flex flex-row justify-center items-center text-center mb-2"
          >
            <BsEnvelope className="mr-2 mb-1" />
            이메일로 가입하기
          </button>

          <button className="h-9 rounded p-2 border border-[#E3E1D9] bg-transparent flex flex-row justify-center items-center text-center">
            <img
              src="../images/google.png"
              className="w-4 h-4 mb-1 mr-1"
              alt="google logo"
            />
            구글로 가입/로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
