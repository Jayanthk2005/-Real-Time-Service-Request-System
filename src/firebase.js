// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDX1tb3MmjFfi1O34Z43ZKZH_ZaC0kF9jM",
  authDomain: "househelp-hub.firebaseapp.com",
  projectId: "househelp-hub",
  storageBucket: "househelp-hub.firebasestorage.app",
  messagingSenderId: "803892785983",
  appId: "1:803892785983:web:5b01c47586804f640b998a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth & provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
