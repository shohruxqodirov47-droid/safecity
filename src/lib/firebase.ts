import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNrXWZxddeTL6ZAMQmh2LwzkEQwtdW48A",
  authDomain: "safecity-d16ee.firebaseapp.com",
  projectId: "safecity-d16ee",
  storageBucket: "safecity-d16ee.firebasestorage.app",
  messagingSenderId: "312754423749",
  appId: "1:312754423749:web:61adbfeb81db5fe5e4edac",
  measurementId: "G-P9DJ3BCPH7"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged };
