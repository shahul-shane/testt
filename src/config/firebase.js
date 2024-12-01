import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAcb_x_tHkVMP2jIPurw2OBIRBB9Ob9i3o",
    authDomain: "adruleai.firebaseapp.com",
    projectId: "adruleai",
    storageBucket: "adruleai.firebasestorage.app",
    messagingSenderId: "303860420438",
    appId: "1:303860420438:web:4c7b600b2700df72d810f7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
