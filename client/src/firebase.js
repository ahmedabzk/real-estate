// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "real-estate-1510a.firebaseapp.com",
  projectId: "real-estate-1510a",
  storageBucket: "real-estate-1510a.appspot.com",
  messagingSenderId: "521077967355",
  appId: "1:521077967355:web:098e5d3e6508023c1d635e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
