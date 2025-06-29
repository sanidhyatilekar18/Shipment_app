import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore}from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyDXhNTU5UJogng3UdLHdURUL8GaWk6AGCk",
  authDomain: "shipmentapp-b8181.firebaseapp.com",
  projectId: "shipmentapp-b8181",
  storageBucket: "shipmentapp-b8181.firebasestorage.app",
  messagingSenderId: "648418301120",
  appId: "1:648418301120:web:de310f1981830436b8c925",
  measurementId: "G-62FMWXZJG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 export const auth = getAuth(app);
 export const provider = new GoogleAuthProvider();
 export const db = getFirestore(app);