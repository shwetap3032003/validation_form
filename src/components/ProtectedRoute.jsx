import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  if (token) {
    return children;
  }

  return <div></div>;
};

export default ProtectedRoute;
