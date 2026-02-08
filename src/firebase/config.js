import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLlcJoqLDYWHa9ddQbh4sVt8lAwm3SCVc",
  authDomain: "qawem-84368.firebaseapp.com",
  projectId: "qawem-84368",
  storageBucket: "qawem-84368.firebasestorage.app",
  messagingSenderId: "505203353467",
  appId: "1:505203353467:web:8c511fa072a5fc9cf07fde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
