import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

export { db };
