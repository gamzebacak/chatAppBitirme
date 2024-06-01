import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "bitirmechat-1f9db.firebaseapp.com",
  projectId: "bitirmechat-1f9db",
  storageBucket: "bitirmechat-1f9db.appspot.com",
  messagingSenderId: "262648248344",
  appId: "1:262648248344:web:24a8d58239db8d785aeb6d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();




