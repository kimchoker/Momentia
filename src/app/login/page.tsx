'use client';
import React, { useState, useEffect } from "react";
import { BsEnvelope, BsLock } from "react-icons/bs";
import { validateEmail } from "../../utils/validation";
import { useRouter } from "next/navigation";
import { login } from "../../firebase/firebaseApi";



const Login: React.FC = () => {

  const router = useRouter();
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPW, setInputPW] = useState<string>("");
  const [validate, setValidate] = useState<boolean>(true);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateEmail(event.target.value, setInputEmail, setValidate);
  };

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  useEffect(() => {
    if (inputEmail !== "" && validate && inputPW !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [inputEmail, validate, inputPW]);

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    try {
      const userCredential = await login(inputEmail, inputPW);

      if (userCredential) {
        console.log("로그인 성공");
        router.push('/');
      }
    } catch (error) {
      console.error("로그인 실패:", error.message);
    }
  };

  const [isIDFocused, setIsIDFocused] = useState<boolean>(false);
  const [isPWFocused, setIsPWFocused] = useState<boolean>(false);
  

  return (
    <div
      className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum-barun-gothic"
    >
      <div
        className="flex justify-center items-center h-3/5 w-2/5 min-w-[300px] min-h-[500px] max-w-[600px] bg-white"
      >
        <div className="w-4/5 flex flex-col">
          <h5 className="font-bold text-lg ">로그인</h5>
          <hr />
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
                          ${validate ? "" : "border-red-500"}
                          ${
                            isIDFocused
                              ? "bg-[#EEEDEB] border-2 border-black"
                              : "border-[#EEEDEB]"
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
                              ? "bg-[#EEEDEB] border-2 border-[#000000]"
                              : "border-[#EEEDEB]"
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
            onClick={handleLogin}
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

          <div className="text-xs text-center text-[#C7C8CC] mt-2 cursor-pointer mb-2">
            도움이 필요하신가요?
          </div>

          <hr className="mb-2"/>

          <button
            onClick={() => router.push('/signup')}
            className="h-9 rounded p-2 border border-[#E3E1D9] bg-transparent flex flex-row justify-center items-center text-center mb-2"
          >
            <BsEnvelope className="mr-2 mb-1"/>
            이메일로 가입하기
          </button>

          <button
            className="h-9 rounded p-2 border border-[#E3E1D9] bg-transparent flex flex-row justify-center items-center text-center"
          >
            <img src="../images/google.png" className="w-4 h-4 mb-1 mr-1" alt="google logo" />
            구글로 가입/로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
