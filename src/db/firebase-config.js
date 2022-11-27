import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAY3-Y5RGLS4lF6ehdPvNeektIv_Po9y3Y",
  authDomain: "chanproject-f6e42.firebaseapp.com",
  projectId: "chanproject-f6e42",
  storageBucket: "chanproject-f6e42.appspot.com",
  messagingSenderId: "609891338460",
  appId: "1:609891338460:web:04eefecbdffbb15bdb8c19"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)