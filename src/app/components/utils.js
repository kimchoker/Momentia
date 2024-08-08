export const validateEmail = (email, setInputEmail, setValidate) => {
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