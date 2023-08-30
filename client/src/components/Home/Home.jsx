import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import { UserContext } from "../../App";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="instagram-card" key={item._id}>
            <div className="user-info">
              <div className="one">
                <img
                  className="profile-picture"
                  src={item.postedBy.profilephoto}
                  alt="Profile"
                />
                <span className="username">
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.username}
                  </Link>
                </span>
              </div>
              {item.postedBy._id === state._id && (
                <MdDelete
                  cursor={"pointer"}
                  onClick={() => deletePost(item._id)}
                  size={30}
                />
              )}
            </div>
            <img className="post-image" src={item.photo} alt="Post" />
            <div className="like">
              {item.likes.includes(state._id) ? (
                <FaHeart
                  color="red"
                  size={25}
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                />
              ) : (
                <FaRegHeart
                  size={25}
                  onClick={() => {
                    likePost(item._id);
                  }}
                />
              )}
            </div>
            <div className="caption">
              <h4>{item.likes.length} Likes</h4>
              <h4>{item.title}</h4>
              <h5>{item.body}</h5>
            </div>
            {item.comments.map((record) => {
              return (
                <h5 key={record._id}>
                  <span style={{ fontWeight: "300" }}>
                    {record.postedBy.username}
                  </span>
                  {" - "}
                  {record.text}
                </h5>
              );
            })}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                makeComment(e.target[0].value, item._id);
              }}
            >
              <input
                className="comment-input"
                type="text"
                placeholder="Add a comment"
              />
            </form>
          </div>
        );
      })}
    </div>
  );
}
