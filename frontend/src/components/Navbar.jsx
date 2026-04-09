import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✈️ SkyBook
        </Link>
        <div className="nav-links">
          <Link to="/search">Search Flights</Link>
          {user ? (
            <>
              <Link to="/my-bookings">My Bookings</Link>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
