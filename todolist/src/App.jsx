import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AddAcc from "./components/signup.jsx";
import { auth, signInWithGoogle } from "./firebase";

function Home() {
  return (
    <>
      <div className="title">
        <p id="title">BOB TO/DO/LIST</p>
      </div>
      <div className={"options" + " " + "bodygrid"}>
        <Link to="/login">
          <button className="logsign">Log In</button>
        </Link>
        <Link to="/signup">
          <button className="logsign">Sign Up</button>
        </Link>
      </div>
    </>
  );
}

function Login() {
  return (
    <>
      <p>
        <Link to="/">{`<<< BACK`}</Link>
      </p>
      <div className="title">
        <p>LOG IN</p>
      </div>
      <div className={"bodygrid2"}>
        <div className="lgsu">
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
            Submit
          </button>
          <p className="here">
            Don't have an account yet? Click{" "}
            <Link to="/signup">{<u>here</u>}</Link>
            to Sign Up!
          </p>
          <button
            className="login__btn login__google"
            onClick={signInWithGoogle}
          >
            Login with Google
          </button>
        </div>
      </div>
    </>
  );
}

function Signup() {
  return (
    <>
      <p>
        <Link to="/">{`<<< BACK`}</Link>
      </p>

      <div className="title">
        <p>SIGN UP</p>
      </div>

      <div className={"bodygrid2"}>
        <div className="lgsu">
          <AddAcc />
        </div>
      </div>
    </>
  );
}

function App() {
  // const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
