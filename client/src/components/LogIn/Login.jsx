import React from "react";
import { useState, useContext } from "react";
import "./Login.css";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Toast from "../others/Toast/Toast";

export default function Login() {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setToastMessage("Invalid email");
      return setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          setToastMessage(data.error);
          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          setToastMessage("Signed Successfull");
          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="cont">
      <div className="form-container">
        <h2>Login to Your Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => PostData()}>Login</button>
        <h3>
          <Link to="/signup">Create an account</Link>
        </h3>
      </div>
    </div>
  );
}
