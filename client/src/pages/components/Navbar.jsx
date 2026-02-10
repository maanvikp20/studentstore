import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    onLogout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  return (
    <header className="nav">
      <nav className="nav-inner">
        <div className="menu">
          <div className="order-menu">
            <NavLink
              className={({ isActive }) => "link" + (isActive ? " active" : "")}
              to="/home"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => "link" + (isActive ? " active" : "")}
              to="/inventory"
            >
              Inventory
            </NavLink>
            <NavLink
              className={({ isActive }) => "link" + (isActive ? " active" : "")}
              to="/custom-orders"
            >
              Custom Orders
            </NavLink>
          </div>
        </div>

        <div className="logo-section">
          <div className="logo"></div>
          <div className="brand">3D Print Store</div>
        </div>

        <div className="personal-menu">
          <NavLink
            className={({ isActive }) => "link" + (isActive ? " active" : "")}
            to="/cart"
          >
            Cart
          </NavLink>
        
          {!isLoggedIn ? (
            <NavLink
              className={({ isActive }) => "link" + (isActive ? " active" : "")}
              to="/login"
            >
              Login
            </NavLink>
          ) : (
            <>
              <NavLink
                className={({ isActive }) => "link" + (isActive ? " active" : "")}
                to="/profile"
              >
                Profile
              </NavLink>
              
              {isAdmin && (
                <NavLink
                  className={({ isActive }) => "link" + (isActive ? " active" : "")}
                  to="/admin"
                >
                  Admin Panel
                </NavLink>
              )}

              <button className=" link" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}