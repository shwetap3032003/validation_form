import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");

  async function handleLogout() {
    try {
      const res = await fetch("https://ex-5n9q.onrender.com/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      });
      const result = await res.json();

      if (res.ok) {
        console.log("logout successfull");
        localStorage.removeItem("authtoken");
        navigate("/login");
      } else {
        alert("logout failed");
      }
    } catch (error) {
      alert("Error occurred");
    }
  }

  return (
    <div>
      <nav className="bg-blue-500 text-white flex items-center">
        <Link to="/" className="p-3">
          Home
        </Link>
        <Link to="/about" className="p-3">
          About
        </Link>
        <Link to="/contact" className="p-3">
          Contact
        </Link>
        <Link to="/users" className="p-3">
          Users
        </Link>
        <div>
          {token ? (
            <button
              className="bg-red-500 ml-235 p-1 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <div>
              <Link to="/signup" className="pl-220">
                SignUp
              </Link>
              <Link to="/login" className="pl-5">
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
