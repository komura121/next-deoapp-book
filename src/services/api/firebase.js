import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtummALVerDJ8QzNTxAk3xAyFTaGA_758",
  authDomain: "deopp-book.firebaseapp.com",
  projectId: "deopp-book",
  storageBucket: "deopp-book.appspot.com",
  messagingSenderId: "347141491662",
  appId: "1:347141491662:web:d5ad969a313f2dc93e399f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const db = getFirestore(app);
export const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
export { googleProvider };
export const auth = getAuth(app);
export * from "firebase/firestore"; // Export Firestore functions
export * from "firebase/storage"; // Export Storage functions
