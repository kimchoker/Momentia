'use client';
import React, { useState, useEffect } from "react";
import { BsEnvelope, BsLock } from "react-icons/bs";
import { validateEmail } from "../components/utils";
import { useRouter } from "next/navigation";


const Login: React.FC = () => {
  const router = useRouter();

  const [IDHover, setIDHover] = useState(false);
  const [IDClick, setIDClick] = useState(false);
  const [PWHover, setPWHover] = useState(false);
  const [PWClick, setPWClick] = useState(false);

  const IDentered = () => setIDHover(true);
  const IDleaved = () => setIDHover(false);
  const PWentered = () => setPWHover(true);
  const PWleaved = () => setPWHover(false);

  const IDClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIDClick(true);
    setPWClick(false);
  };

  const PWClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPWClick(true);
    setIDClick(false);
  };

  const Clicked = () => {
    setIDClick(false);
    setPWClick(false);
  };

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

  const login = async () => {
    // 로그인 로직
  };

  

  return (
    <div
      className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum-barun-gothic"
      onClick={Clicked}
    >
      <div
        className="flex justify-center items-center h-3/5 w-2/5 min-w-[300px] min-h-[500px] max-w-[600px] bg-white"
        onClick={Clicked}
      >
        <div className="w-4/5 flex flex-col" onClick={Clicked}>
          <h5 className="font-bold text-lg ">로그인</h5>
          <hr />
          <div className="mb-4 flex flex-col">
            <label htmlFor="id" className="mb-2 font-bold text-sm">
              아이디
            </label>
            <div
              onClick={IDClicked}
              className={`flex items-center border rounded p-2 h-9 transition-colors duration-500
                ${IDClick ? (validate ? "border-black" : "border-red-500") : "border-[#E3E1D9]"}
                ${IDHover || IDClick ? "bg-[#EEEDEB]" : "bg-transparent"}
              `}
              onMouseEnter={IDentered}
              onMouseLeave={IDleaved}
            >
              <BsEnvelope />
              <input
                name="username"
                id="id"
                type="email"
                value={inputEmail}
                onChange={onChangeEmail}
                className="w-full p-2 box-border border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="pw" className="mb-2 font-bold text-sm">
              비밀번호
            </label>
            <div
              onClick={PWClicked}
              className={`flex items-center border rounded p-2 h-9 transition-colors duration-500
                ${PWClick ? "border-black" : "border-[#E3E1D9]"}
                ${PWHover || PWClick ? "bg-[#EEEDEB]" : "bg-transparent"}
              `}
              onMouseEnter={PWentered}
              onMouseLeave={PWleaved}
            >
              <BsLock />
              <input
                name="password"
                id="pw"
                type="password"
                value={inputPW}
                onChange={(event) => setInputPW(event.target.value)}
                className="w-full p-2 box-border border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={login}
            disabled={buttonDisabled}
            className="flex justify-center items-center text-center rounded bg-black border-transparent h-9 transition-all duration-300 p-2 disabled:bg-[#C7C8CC] cursor-not-allowed"
          >
            <p className="text-white text-sm mb-0">로그인</p>
          </button>

          <div className="text-xs text-center text-[#C7C8CC] mt-2 cursor-pointer">
            도움이 필요하신가요?
          </div>

          <hr />

          <button
            onClick={() => router.push('/signup')}
            className="h-9 rounded p-2 border border-[#E3E1D9] bg-transparent flex flex-row justify-center items-center text-center"
          >
            <BsEnvelope className="mr-1"/>
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
