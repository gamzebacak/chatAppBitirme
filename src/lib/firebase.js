import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-fdc76.firebaseapp.com",
  projectId: "reactchat-fdc76",
  storageBucket: "reactchat-fdc76.appspot.com",
  messagingSenderId: "370319316222",
  appId: "1:370319316222:web:5a3437d354b957d42601af",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
