import React from "react";
import { useState, useEffect } from "react";
import "./Signup.css"; // Import the CSS file
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Toast from "../others/Toast/Toast";
export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);
  const uploadpic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instaclone");
    data.append("cloud_name", "roop37");
    fetch("https://api.cloudinary.com/v1_1/roop37/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        setShowToast(true); // Show the success toast
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const uploadFields = () => {
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
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        username,
        profilephoto: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setToastMessage(data.error);
          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
        } else {
          setToastMessage(data.message);
          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const PostData = () => {
    if (image) {
      uploadpic();
    } else uploadFields();
  };

  return (
    <div className="cont">
      {toastMessage && <Toast message={toastMessage} />}
      <div className="form-container">
        <h2>Create Your Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="upload-container">
          <label htmlFor="file-upload" className="upload-button">
            Upload Profile Picture
            <h6>You can also do it later</h6>
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden-input"
          />
          {uploadedFileName && <p className="file-name">{uploadedFileName}</p>}
        </div>
        <button onClick={() => PostData()}>Create Account</button>
        <h3>
          <Link to="/signin">Already have an account</Link>
        </h3>
      </div>
    </div>
  );
}
