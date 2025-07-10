// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8dj_9oHSQdTVs_Z_48b8eFJUAnu7y8QI",
  authDomain: "dolphins-test-db.firebaseapp.com",
  projectId: "dolphins-test-db",
  storageBucket: "dolphins-test-db.firebasestorage.app",
  messagingSenderId: "249394344777",
  appId: "1:249394344777:web:31ca626e939bf3827be098",
  measurementId: "G-2GR9EWLMZF"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
