"use client"
import React, { useState, useEffect } from "react";
import { validateEmail } from "../components/utils";
import { BsEnvelope, BsEnvelopeArrowUp } from "react-icons/bs";

const SignUp: React.FC = () => {
  // 이메일 검증
  const [inputEmail, setInputEmail] = useState<string>("");
  const [validate, setValidate] = useState<boolean>(true);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateEmail(event.target.value, setInputEmail, setValidate);
  };

  // hover
  const [IDHover, setIDHover] = useState<boolean>(false);
  const [IDClick, setIDClick] = useState<boolean>(false);

  const IDentered = () => {
    setIDHover(true);
  };

  const IDleaved = () => {
    setIDHover(false);
  };

  const IDClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setIDClick(true);
  };

  const Clicked = () => {
    setIDClick(false);
  };

  // button disabled
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [info, setInfo] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (inputEmail === "") {
      setInfo("");
      setVisible(false);
    } else if (inputEmail !== "" && validate) {
      setButtonDisabled(false);
      setInfo("");
    } else {
      setButtonDisabled(true);
      setInfo("올바른 이메일을 입력해주세요");
      setVisible(true);
    }
  }, [inputEmail, validate]);

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
            <label htmlFor="email" className="mb-2 font-bold text-sm">
              이메일
            </label>
            <div
              className={`flex items-center rounded-md p-2 h-[35px] transition-colors duration-500 ${
                IDClick && !validate
                  ? "border-2 border-red-500"
                  : IDClick && validate
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
                visible ? "visible" : "invisible"
              }`}
            >
              {info}
            </p>
          </div>
          <button
            disabled={buttonDisabled}
            className={`flex items-center justify-center rounded-md bg-black h-[35px] p-2 transition-all duration-300 ${
              buttonDisabled
                ? "bg-[#C7C8CC] cursor-not-allowed"
                : "hover:bg-gray-700"
            }`}
          >
            <p className="text-white text-xs mr-2">이메일 인증</p>
            <BsEnvelopeArrowUp className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
