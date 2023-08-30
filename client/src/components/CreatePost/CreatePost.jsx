import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import Toast from "../others/Toast/Toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null); // Changed initial value to null
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [url, setUrl] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
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
            setToastMessage("Created Post");
            setTimeout(() => {
              setToastMessage(null);
            }, 5000);
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setUploadedFileName(selectedImage.name); // Update file name immediately
  };

  const postDetails = () => {
    if (!image) {
      return; // Don't proceed if no image is selected
    }

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

  return (
    <div className="create-post">
      <h2>Create a New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="post-input"
      />
      <input
        placeholder="Body"
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="post-input"
      />
      <div className="upload-container">
        <label htmlFor="file-upload" className="upload-button">
          Upload File
        </label>
        <input
          type="file"
          id="file-upload"
          onChange={handleImageChange} // Updated the onChange handler
          className="hidden-input"
        />
        {uploadedFileName && <p className="file-name">{uploadedFileName}</p>}
      </div>
      <button className="post-button" onClick={postDetails}>
        Post
      </button>
    </div>
  );
};

export default CreatePost;
