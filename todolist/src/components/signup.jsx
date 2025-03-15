import React, { useState } from "react";
import "../App.css";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth, signInWithGoogle } from "../firebase";

const AddAcc = () => {
  const [new_acc, setAcc] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [email_arr, emailize] = useState([]);

  const setUsername = (e) => {
    new_acc.username = e.target.value;
    console.log(new_acc);
  };

  const setEmail = async (e) => {
    new_acc.email = e.target.value;
    console.log(new_acc);
  };

  const setPassword = (e) => {
    new_acc.password = e.target.value;
    console.log(new_acc);
  };

  const readEmail = async () => {
    const docReference = doc(db, "emails", "9vTfJxSZheo04YG8FZPI"); // Get the document reference.
    const docSnapshot = await getDoc(docReference);
    const docData = docSnapshot.data()["used_email"];

    return docData;
  };

  // to be called as submit is pressed, if exists in the array then do not accept
  // else return true as default behaviour
  const checkEmail = async (email) => {
    var emailArr = await readEmail();
    const arrLen = emailArr.length;
    for (let i = 0; i < arrLen; i++) {
      if (emailArr[i] == email) {
        return false;
      }
    }
    emailArr[arrLen] = email;
    const newEmailArr = emailArr;
    const emailsRef = doc(db, "emails", "9vTfJxSZheo04YG8FZPI");

    // Set the new emails used field
    await updateDoc(emailsRef, { used_email: newEmailArr });
    console.log((await getDoc(emailsRef)).data()["used_email"]);
    return true;
  };

  const add_acc = async (e) => {
    e.preventDefault();

    const available = await checkEmail(new_acc.email);

    if (available) {
      try {
        const docRef = await addDoc(collection(db, "users_3142025"), {
          todo: new_acc,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      alert("Sign up successful!");
    } else {
      alert("Email already in use!");
    }
  };

  return (
    <>
      <form onSubmit={add_acc}>
        <div className="fields">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="johnDoe67"
            onChange={setUsername}
          />
        </div>
        <div className="fields">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            onChange={setEmail}
          />
        </div>
        <div className="fields">
          <label for="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="enter your password"
            onChange={setPassword}
          />
        </div>
        <button type="submit" className="submit">
          Submit
        </button>
      </form>
      <button className="login__btn login__google" onClick={signInWithGoogle}>
        Login with Google
      </button>
    </>
  );
};

export default AddAcc;
