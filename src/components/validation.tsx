export const validateEmail = (
  email: string,
  setInputEmail: React.Dispatch<React.SetStateAction<string>>,
  setValidate: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  setInputEmail(email);

  if (email === '') {
    setValidate(true); 
  } else if (regex.test(email)) {
    setValidate(true);
  } else {
    setValidate(false);
  }
};

export const validatePassword = (
  password: string,
  setInputPW: React.Dispatch<React.SetStateAction<string>>,
  setPWValidate: React.Dispatch<React.SetStateAction<boolean>>
): void => {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/;
  setInputPW(password);

  if (password === '') {
    setPWValidate(true);
  } else if (regex.test(password)) {
    setPWValidate(true);
  } else {
    setPWValidate(false);
  }
};
