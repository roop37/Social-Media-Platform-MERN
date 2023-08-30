import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/LogIn/Login";
import Home from "./components/Home/Home";
import Signup from "./components/SignUp/Signup";
import Profile from "./components/Profile/Profile";
import "./App.css";
import React, { useEffect, createContext, useReducer, useContext } from "react";
import CreatePost from "./components/CreatePost/CreatePost";
import { reducer, initialState } from "./reducers/useReducers";
import UserProfile from "./components/UserProfile/UserProfile";
import SuscribedPost from "./components/suscribedPost/SuscribedPost";
export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/signin");
    }
  }, []);
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/myfollowingpost" element={<SuscribedPost />} />
      </Routes>
    </>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
