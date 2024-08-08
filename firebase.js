// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo-GG89U2cA723lNC9PtC9SpNrkwaO_xs",
  authDomain: "snsproject-85107.firebaseapp.com",
  projectId: "snsproject-85107",
  storageBucket: "snsproject-85107.appspot.com",
  messagingSenderId: "273535426800",
  appId: "1:273535426800:web:d14c2cf64fe2468a232235",
  measurementId: "G-ZJZ0LHQN67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);