import firebase from "firebase/app";
import "firebase/functions";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

export default firebase;
const storage = firebase.storage();
export const firestoreRef = firebase.firestore();
export const firebaseAuth = firebase.auth();
export const storageRef = storage.ref();

if (window.location.hostname === "localhost") {
  firestoreRef.useEmulator("localhost", 8080);
  firebaseAuth.useEmulator("http://localhost:9099/");
  firebase.functions().useEmulator("localhost", 5001);
  storage.useEmulator("localhost", 9199);
}
