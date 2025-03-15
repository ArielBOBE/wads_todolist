import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOObPqgM55KECkDOSsiQs1DGPmqRum5SE",
  authDomain: "wads-todo.firebaseapp.com",
  projectId: "wads-todo",
  storageBucket: "wads-todo.firebasestorage.app",
  messagingSenderId: "305200734801",
  appId: "1:305200734801:web:fe0df2a64e2a2ad1ee4e70",
  measurementId: "G-2C7CJMFJPS",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export { auth, db, signInWithGoogle };
