// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi4MP4ZoCL0W2zZSwdFrMlxJBjhltYZJw",
  authDomain: "aiinterview-cb435.firebaseapp.com",
  projectId: "aiinterview-cb435",
  storageBucket: "aiinterview-cb435.firebasestorage.app",
  messagingSenderId: "375211181535",
  appId: "1:375211181535:web:68fa202bb499a9a93f306a",
  measurementId: "G-QT3YZEDC5R"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);