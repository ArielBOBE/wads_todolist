import React, { useState } from "react";
import "../App.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddAcc = () => {
  const [new_acc, setAcc] = useState({
    username: "",
    email: "",
    password: "",
  });

  const add_acc = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "todos"), {
        todo: new_acc,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <div className="fields">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="johnDoe67"
        />
      </div>
      <div className="fields">
        <label for="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="example@gmail.com"
        />
      </div>
      <div className="fields">
        <label for="password">Password</label>
        <input
          type="text"
          id="password"
          name="password"
          placeholder="enter your password"
        />
      </div>
      <button type="submit" className="submit">
        Submit form
      </button>
    </div>
  );
};

export default AddAcc;
