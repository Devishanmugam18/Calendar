// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0mQ8avoxUu7WD2AK4ihBYUD3iPMZm7hU",
  authDomain: "calenderappauth.firebaseapp.com",
  projectId: "calenderappauth",
  storageBucket: "calenderappauth.firebasestorage.app",
  messagingSenderId: "408915253320",
  appId: "1:408915253320:web:dc1859c4c14f2c988f607d",
  measurementId: "G-1SFEC78H9F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
