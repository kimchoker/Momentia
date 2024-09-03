"use client"
import React, { useState, useEffect } from "react";
import { validateEmail, validatePassword } from "../../lib/validation";
import { BsEnvelope, BsFillLockFill } from "react-icons/bs";
import { signUp, checkIDExists } from "../../lib/api/userApi";


const SignUp: React.FC = () => {


  // ID 부분
  const [inputEmail, setInputEmail] = useState<string>("");
  const [validateID, setValidateID] = useState<boolean>(true);
  const [isIDFocused, setIsIDFocused] = useState<boolean>(false);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateEmail(event.target.value, setInputEmail, setValidateID);
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

const checkID = async (id :string) => {
  const result = await checkIDExists(id);
  console.log(result)
  if(!result && validateID) {
    setIDInfo("사용 가능한 아이디입니다.")
    setIDInfoVisible(true)
  } else if(result && validateID) {
    setIDInfo("이미 존재하는 아이디입니다")
    setIDInfoVisible(true)
  }
}


  // PW 부분
  const [inputPW, setInputPW] = useState<string>("");
  const [validatePW, setValidatePW] = useState<boolean>(true);
  const [isPWFocused, setIsPWFocused] = useState<boolean>(false);

  const onChangePW = (event: React.ChangeEvent<HTMLInputElement>) => {
    validatePassword(event.target.value, setInputPW, setValidatePW);
  }  

  useEffect(() => {
    if (inputPW === "") {
      setPWInfo("");
      setPWInfoVisible(false);
    } else if(inputPW !== "" && validatePW) {
      setPWInfo("")
    } else {
      setButtonDisabled(true);
      setPWInfo("비밀번호 형식에 맞추어 입력해주세요");
      setPWInfoVisible(true);
    }
  }, [inputPW, validatePW])


  // button disabled
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [IDInfo, setIDInfo] = useState<string>("");
  const [PWInfo, setPWInfo] = useState<string>("");
  const [IDInfoVisible, setIDInfoVisible] = useState<boolean>(false);
  const [PWInfoVisible, setPWInfoVisible] = useState<boolean>(false);



  // 닉네임 부분
  const [inputNickname, setInputNickname] = useState<string>("");
  const [isNicknameFocused, setIsNicknameFocused] = useState<boolean>(false);

  useEffect(() => {
    if (inputEmail !== "" && inputPW !== "" && inputNickname !== "" && validateID && validatePW) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true)
    }
  }, [validateID, validatePW, inputEmail, inputPW, inputNickname])




  return (
    <div
      className="flex justify-center items-center h-screen bg-[#EEEDEB] font-nanum"
    >
      <div
        className="flex justify-center items-center h-3/5 w-2/5 min-w-[300px] min-h-[500px] max-w-[600px] bg-white"
      >
        <div className="w-4/5 flex flex-col">
          <h5 className="font-bold">회원가입</h5>
          <hr />
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="mb-2 font-bold text-sm mt-2">
              이메일
            </label>
            <div className="flex flex-row">
              <div
                className={`flex 
                            items-center 
                            rounded-md p-2 h-[35px] 
                            transition-colors 
                            duration-500 
                            bg-transparent
                            hover:bg-[#EEEDEB]
                            border rounded p-2 h-9 
                            w-[75%]
                            mr-5
                            ${
                              validateID ? "" : "border-red-500"
                            }
                            ${
                              isIDFocused
                                ? "bg-[#EEEDEB] border-2 border-black"
                                : "border-[#EEEDEB]"
                            }
                `}
              
              >
                <BsEnvelope />
                <input
                  id="id"
                  type="email"
                  value={inputEmail}
                  onChange={onChangeEmail}
                  onFocus={()=>{setIsIDFocused(true)}}
                  onBlur={()=>{setIsIDFocused(false)}}
                  className="w-full p-2 bg-transparent border-none focus:outline-none ml-2"
                />
              </div>
              <button className="flex items-center justify-center rounded-md bg-black h-[35px] p-2 transition-all duration-300 w-[20%] hover:bg-gray-700"
                  onClick={() => checkID(inputEmail)}
              >
                <p className="text-white text-xs items-center justify-center">중복확인</p>
              </button>
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
              className={`flex items-center rounded-md p-2 h-[35px] transition-colors duration-500 bg-transparent hover:bg-[#EEEDEB] border rounded p-2 h-9 
                        ${
                          validatePW ? "" : "border-red-500"
                        } 
                        ${
                          isPWFocused
                            ? "bg-[#EEEDEB] border-2 border-black"
                            : "border-[#EEEDEB]"
                        }

              `}
            >
              <BsFillLockFill />
              <input
                id="id"
                type="password"
                value={inputPW}
                onChange={onChangePW}
                onFocus={()=>{setIsPWFocused(true)}}
                onBlur={()=>{setIsPWFocused(false)}}
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
            <label htmlFor="email" className="mb-2 font-bold text-sm">
              닉네임
          </label>
            <div
                className={`flex 
                            items-center 
                            rounded-md p-2 h-[35px] 
                            border rounded p-2 h-9 
                            transition-colors 
                            duration-500 
                            bg-transparent
                            hover:bg-[#EEEDEB]
                            mb-2

                            ${
                              isNicknameFocused
                                ? "bg-[#EEEDEB] border-2 border-black"
                                : "border-[#EEEDEB]"
                            }
                `}

              >
                <input
                  id="id"
                  value={inputNickname}
                  onChange={(e)=>{setInputNickname(e.target.value)}}
                  onFocus={()=>{setIsNicknameFocused(true)}}
                  onBlur={()=>{setIsNicknameFocused(false)}}
                  className="w-full p-2 bg-transparent border-none focus:outline-none ml-2"
                />
              </div>

          </div>
          <button
            disabled={buttonDisabled}
            className={`flex items-center justify-center rounded-md bg-black h-[35px] p-2 transition-all duration-300  ${
              buttonDisabled
                ? "bg-[#C7C8CC] cursor-not-allowed"
                : "hover:bg-gray-700"
            }`}
            onClick={() => signUp(inputEmail, inputPW, inputNickname)}
          >
            <p className="text-white text-xs mr-2">회원가입</p>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
