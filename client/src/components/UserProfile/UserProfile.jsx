import React, { useEffect, useState, useContext } from "react";
import "./UserProfile.css";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
export default function Profile() {
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [userProfile, setProfile] = useState(null);
  const [showfollow, setshowfollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch(`/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setshowfollow(false);
      });
  };
  const unfollowUser = () => {
    fetch(`/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );

          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setshowfollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile">
          <div className="containerprof">
            <div className="topsec">
              <div className="pp">
                <img
                  src={userProfile.user.profilephoto}
                  alt="https://www.tenforums.com/attachments/user-accounts-family-safety/322690d1615743307t-user-account-image-log-user.png"
                />
              </div>
              <div className="details">
                <h2>{userProfile.user.username}</h2>
                <h3>{userProfile.user.name}</h3>

                <div className="followers">
                  <h4>34 posts</h4>
                  <h4>{userProfile.user.followers.length} followers</h4>
                  <h4>{userProfile.user.following.length} following</h4>
                </div>

                <div className="buttns">
                  {showfollow ? (
                    <button className="follow" onClick={() => followUser()}>
                      Follow
                    </button>
                  ) : (
                    <button className="follow" onClick={() => unfollowUser()}>
                      unfollow
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="gallery">
              {userProfile.posts.map((item) => {
                return (
                  <img
                    key={item._id}
                    src={item.photo}
                    alt=""
                    className="item"
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
}
