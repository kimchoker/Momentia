"use client"
import React, { useState, useEffect } from "react";
import { validateEmail, validatePW } from "../../components/validation";
import { BsEnvelope, BsFillLockFill } from "react-icons/bs";
import { useRouter } from "next/navigation";


const SignUp: React.FC = () => {

  // ID 부분
  const [inputEmail, setInputEmail] = useState<string>("");
  const [validateID, setValidateID] = useState<boolean>(true);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateEmail(event.target.value, setInputEmail, setValidateID);
  };

  // ID 부분 hover
  const [IDHover, setIDHover] = useState<boolean>(false);
  const [IDClick, setIDClick] = useState<boolean>(false);

  const IDentered = () => {
    setIDHover(true);
  };

  const IDleaved = () => {
    setIDHover(false);
  };

  const IDClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setIDClick(true)
    setPWClick(false)
  };

  useEffect(() => {
    if (inputEmail === "") {
      setIDInfo("");
      setIDInfoVisible(false);
    } else if (inputEmail !== "" && validateID) {
      setIDInfo("");
    } else {
      setButtonDisabled(true);
      setIDInfo("올바른 형식의 이메일을 입력해주세요");
      setIDInfoVisible(true);
    }
  }, [inputEmail, validateID]);



  // PW 부분
  const [inputPW, setInputPW] = useState<string>("");
  const [IsPWvalidate, setIsPWValidate] = useState<boolean>(true);

  const onChangePW = (event: React.ChangeEvent<HTMLInputElement>) => {
    validatePW(event.target.value, setInputPW, setIsPWValidate);
  }  

  // PW 부분 hover
  const [PWHover, setPWHover] = useState<boolean>(false);
  const [PWClick, setPWClick] = useState<boolean>(false);

  const PWentered = () => {
    setPWHover(true)
  };

  const PWLeaved = () => {
    setPWHover(false)
  }

  const PWClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setPWClick(true)
    setIDClick(false)
  };

  useEffect(() => {
    if (inputPW === "") {
      setPWInfo("");
      setPWInfoVisible(false);
    } else if(inputPW !== "" && IsPWvalidate) {
      setPWInfo("")
    } else {
      setButtonDisabled(true);
      setPWInfo("비밀번호 형식에 맞추어 입력해주세요");
      setPWInfoVisible(true);
    }
  }, [inputPW, validatePW])


  // 바깥을 클릭한 경우
  const Clicked = () => {
    setIDClick(false)
    setPWClick(false)
  };

  // button disabled
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [IDInfo, setIDInfo] = useState<string>("");
  const [PWInfo, setPWInfo] = useState<string>("");
  const [IDInfoVisible, setIDInfoVisible] = useState<boolean>(false);
  const [PWInfoVisible, setPWInfoVisible] = useState<boolean>(false);




 
  // 아이디 비밀번호가 모두 옳으면
  useEffect(() => {
    if (validateID && IsPWvalidate) {
      setButtonDisabled(false);
    }
  }, [validateID, IsPWvalidate])

  const router = useRouter();


  return (
    <div
      className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum"
      onClick={Clicked}
    >
      <div
        className="flex justify-center items-center h-3/5 w-2/5 min-w-[300px] min-h-[500px] max-w-[600px] bg-white"
        onClick={Clicked}
      >
        <div className="w-4/5 flex flex-col" onClick={Clicked}>
          <h5 className="font-bold">회원가입</h5>
          <hr />
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="mb-2 font-bold text-sm mt-2">
              이메일
            </label>
            <div
              className={`flex items-center rounded-md p-2 h-[35px] transition-colors duration-500 ${
                IDClick && !validateID
                  ? "border-2 border-red-500"
                  : IDClick && validateID
                  ? "border-2 border-black"
                  : IDClick
                  ? "border-2 border-black"
                  : "border border-[#E3E1D9]"
              } ${IDHover || IDClick ? "bg-[#EEEDEB]" : "bg-transparent"}`}
              onMouseEnter={IDentered}
              onMouseLeave={IDleaved}
              onClick={IDClicked}
            >
              <BsEnvelope />
              <input
                id="id"
                type="email"
                value={inputEmail}
                onChange={onChangeEmail}
                className="w-full p-2 bg-transparent border-none focus:outline-none ml-2"
              />
            </div>
            <p
              className={`mt-1 text-red-500 text-xs h-4 ${
                IDInfoVisible ? "visible" : "invisible"
              }`}
            >
              {IDInfo}
            </p>
            <label htmlFor="email" className="mb-2 font-bold text-sm">
              비밀번호
            </label>
            <div
              className={`flex items-center rounded-md p-2 h-[35px] transition-colors duration-500 ${
                PWClick && !validatePW
                  ? "border-2 border-red-500"
                  : PWClick && validatePW
                  ? "border-2 border-black"
                  : PWClick
                  ? "border-2 border-black"
                  : "border border-[#E3E1D9]"
              } ${PWHover || PWClick ? "bg-[#EEEDEB]" : "bg-transparent"}`}
              onMouseEnter={PWentered}
              onMouseLeave={PWLeaved}
              onClick={PWClicked}
            >
              <BsFillLockFill />
              <input
                id="id"
                type="password"
                value={inputPW}
                onChange={onChangePW}
                className="w-full p-2 bg-transparent border-none focus:outline-none ml-2"
              />
            </div>
            <p
              className={`mt-1 text-red-500 text-xs h-4 ${
                PWInfoVisible ? "visible" : "invisible"
              }`}
            >
              {PWInfo}
            </p>
          </div>
          <button
            disabled={buttonDisabled}
            className={`flex items-center justify-center rounded-md bg-black h-[35px] p-2 transition-all duration-300 ${
              buttonDisabled
                ? "bg-[#C7C8CC] cursor-not-allowed"
                : "hover:bg-gray-700"
            }`}
            onClick={null}
          >
            <p className="text-white text-xs mr-2">회원가입</p>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
