import React, { useState, useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
