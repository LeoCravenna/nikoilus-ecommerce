import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fb-iluscuadros.firebaseapp.com",
  projectId: "fb-iluscuadros",
  storageBucket: "fb-iluscuadros.appspot.com",
  messagingSenderId: "385731229403",
  appId: "1:385731229403:web:1aaf7d945d420f9af1befe",
  measurementId: "G-0X0ZTWMWR8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db as default, storage };