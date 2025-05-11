// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwifT6JKJBbEhLU5uqW3a9eVi4qEfA_Eg",
  authDomain: "noorai-d4452.firebaseapp.com",
  projectId: "noorai-d4452",
  storageBucket: "noorai-d4452.appspot.com", 
  messagingSenderId: "723362658649",
  appId: "1:723362658649:web:2ce4d10a8438ef3a707448",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
