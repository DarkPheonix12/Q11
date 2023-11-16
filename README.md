Qalki

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnsRLHBLmaAbaUvBSWjw6Qf7_uBKR__zs",
  authDomain: "qalki-2aa9d.firebaseapp.com",
  projectId: "qalki-2aa9d",
  storageBucket: "qalki-2aa9d.appspot.com",
  messagingSenderId: "183412553995",
  appId: "1:183412553995:web:70cdc629ff552a89094a0e",
  measurementId: "G-XTYZB4XYYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);