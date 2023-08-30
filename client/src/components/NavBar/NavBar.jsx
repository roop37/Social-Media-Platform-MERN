import React, { useContext } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
export default function NavBar() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <>
          <li>
            <Link to="/myfollowingpost">Feed</Link>
          </li>
          <li>
            <Link to="/">explore</Link>
          </li>
          <li>
            <Link to="/createpost">Create Post</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <button
            className="log-ot"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/signin");
            }}
          >
            Log out
          </button>
        </>,
      ];
    } else {
      return [
        <>
          <li>
            <Link to="/signin">Login</Link>
          </li>
          ,
          <li>
            <Link to="/signup">Create Account</Link>
          </li>
        </>,
      ];
    }
  };
  return (
    <>
      <div className="topbar">
        <div className="wrapper">
          <div className="left">
            <h3>ProjectGram</h3>
          </div>
          <div className="right">
            <div className="listing">
              <ul>{renderList()}</ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
