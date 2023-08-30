import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import { UserContext } from "../../App";
import { json } from "react-router-dom";

export default function Profile() {
  const { state, dispatch } = useContext(UserContext);
  const [toastMessage, setToastMessage] = useState(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [mypics, setPics] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch(`/mypost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);
  useEffect(() => {
    if (image) {
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
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <div className="profile">
      <div className="containerprof">
        <div className="topsec">
          <div className="pp">
            <img
              src={state ? state.profilephoto : "Loading"}
              alt="https://www.tenforums.com/attachments/user-accounts-family-safety/322690d1615743307t-user-account-image-log-user.png"
            />
          </div>
          <div className="details">
            <h2>{state ? state.username : "Loading..."}</h2>
            <h3>{state ? state.name : "Loading..."}</h3>

            <div className="followers">
              <h4>{state ? mypics.length : "Loading..."} posts</h4>
              <h4>{state ? state.followers.length : "Loading..."} followers</h4>
              <h4>{state ? state.following.length : "Loading"} following</h4>
            </div>
            {/* <div
              className="upload-container"
              style={{ textAlign: "center", margin: "20px" }}
            >
              <input
                type="file"
                id="profile-pic-input"
                onChange={(e) => updatePhoto(e.target.files[0])}
                style={{ display: "none" }} // Hide the default file input
              />
              <label
                htmlFor="profile-pic-input"
                className="custom-upload-button"
                style={{ cursor: "pointer" }}
              >
                Update Profile Pic
              </label>
            </div> */}
          </div>
        </div>

        <div className="gallery">
          {mypics.map((item) => {
            return (
              <img key={item._id} src={item.photo} alt="" className="item" />
            );
          })}
        </div>
      </div>
    </div>
  );
}
