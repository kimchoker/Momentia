"use client"
import React, { useState, useEffect } from "react";
import { BsEnvelope, BsLock } from "react-icons/bs";
import { validateEmail } from "../components/utils";
import { useRouter } from "next/router";

// children을 포함하도록 타입을 수정
const Background: React.FC<{ onClick: () => void; children?: React.ReactNode }> = ({ onClick, children }) => (
  <div className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum-barun-gothic" onClick={onClick}>
    {children}
  </div>
);

const LoginBox: React.FC<{ onClick: () => void; children?: React.ReactNode }> = ({ onClick, children }) => (
  <div className="flex justify-center items-center h-3/5 w-2/5 min-w-[300px] min-h-[500px] max-w-[600px] bg-white" onClick={onClick}>
    {children}
  </div>
);

const LoginCol: React.FC<{ onClick: () => void; children?: React.ReactNode }> = ({ onClick, children }) => (
  <div className="w-4/5 flex flex-col" onClick={onClick}>
    {children}
  </div>
);

const LabelDiv: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 flex flex-col">
    {children}
  </div>
);

const Label: React.FC<{ htmlFor: string; children?: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-2 font-bold text-sm">
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full p-2 box-border border-none bg-transparent focus:outline-none"
  />
);

const Relative: React.FC<{
  hover?: boolean;
  clicked?: boolean;
  validate?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}> = ({
  hover = false,
  clicked = false,
  validate,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children
}) => (
  <div
    onClick={onClick}
    className={`flex items-center border rounded p-2 h-9 transition-colors duration-500
      ${clicked ? (validate ? 'border-black' : 'border-red-500') : 'border-[#E3E1D9]'}
      ${hover || clicked ? 'bg-[#EEEDEB]' : 'bg-transparent'}
    `}
  >
    {children}
  </div>
);



const LoginButton: React.FC<{
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}> = ({ disabled, onClick, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex justify-center items-center text-center rounded bg-black border-transparent h-9 transition-all duration-300 p-2 disabled:bg-[#C7C8CC] cursor-not-allowed"
  >
    <p className="text-white text-sm mb-0">{children}</p>
  </button>
);

const SignUpButton: React.FC<{ onClick?: React.MouseEventHandler<HTMLButtonElement>; children?: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="h-9 rounded p-2 border border-[#E3E1D9] bg-transparent flex flex-row justify-center items-center text-center"
  >
    {children}
  </button>
);

const NaverLogo: React.FC<{ src: string }> = ({ src }) => (
  <img src={src} className="w-4 h-4 mb-1" alt="Naver Logo" />
);

const RecoveryButton: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="text-xs text-center text-[#C7C8CC] mt-2 cursor-pointer">
    {children}
  </div>
);

const Login: React.FC = () => {

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

  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputPW, setInputPW] = useState<string>('');
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
    // try {
    //   const response = await axios.post('http://localhost:8080/login', {
    //     username: inputEmail,
    //     password: inputPW
    //   });

    //   if (response.status === 200) {
        
    //   } else {
    //     alert('로그인에 실패했습니다.');
    //   }
    // } catch (error) {
    //   console.error('로그인 에러:', error);
    //   alert('로그인에 실패했습니다.');
    // }
  };

  return (
    <Background onClick={Clicked}>
      <LoginBox onClick={Clicked}>
        <LoginCol onClick={Clicked}>
          <h5 className="font-bold">로그인</h5>
          <hr />
          <LabelDiv>
            <Label htmlFor="id">아이디</Label>
            <Relative
              hover={IDHover}
              onMouseEnter={IDentered}
              onMouseLeave={IDleaved}
              clicked={IDClick}
              onClick={IDClicked}
              validate={validate}
            >
              <BsEnvelope />
              <Input
                name="username"
                id="id"
                type="email"
                value={inputEmail}
                onChange={onChangeEmail}
              />
            </Relative>
          </LabelDiv>

          <LabelDiv>
            <Label htmlFor="pw">비밀번호</Label>
            <Relative
              hover={PWHover}
              onMouseEnter={PWentered}
              onMouseLeave={PWleaved}
              clicked={PWClick}
              onClick={PWClicked}
              validate={true}
            >
              <BsLock />
              <Input
                name="password"
                id="pw"
                type="password"
                value={inputPW}
                onChange={(event) => setInputPW(event.target.value)}
              />
            </Relative>
          </LabelDiv>

          <LoginButton disabled={buttonDisabled} onClick={login}>
            로그인
          </LoginButton>
          <RecoveryButton>
            도움이 필요하신가요?
          </RecoveryButton>
          <hr />
          <SignUpButton onClick={() => null}>
            <BsEnvelope />
            이메일로 가입하기
          </SignUpButton>

          <SignUpButton>
            <NaverLogo src="/path/to/btnD.png" />
            네이버로 가입/로그인하기
          </SignUpButton>
        </LoginCol>
      </LoginBox>
    </Background>
  );
};

export default Login;
