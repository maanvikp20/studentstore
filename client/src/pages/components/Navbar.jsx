import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout, cartCount = 0 }) {
  const navigate = useNavigate();

  const logout = () => {
    onLogout();
    navigate("/home");
  };

  const isAdmin    = user?.role === "admin";
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
              Shop
            </NavLink>
            {isLoggedIn && !isAdmin && (
              <NavLink
                className={({ isActive }) => "link" + (isActive ? " active" : "")}
                to="/custom-orders"
              >
                Custom Orders
              </NavLink>
            )}
          </div>
        </div>

        <NavLink className="logo-section" to="/home">
          <div className="logo" />
          <div className="brand">3D Print Store</div>
        </NavLink>

        <div className="personal-menu">
          {!isLoggedIn ? (
            <>
              <NavLink
                className={({ isActive }) => "link" + (isActive ? " active" : "")}
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className={({ isActive }) => "link" + (isActive ? " active" : "")}
                to="/register"
              >
                Register
              </NavLink>
            </>
          ) : isAdmin ? (
            <>
              <NavLink
                className={({ isActive }) => "link" + (isActive ? " active" : "")}
                to="/admin"
              >
                Admin Panel
              </NavLink>
              <div className="nav-divider" />
              <button className="link logout-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                className={({ isActive }) => "link" + (isActive ? " active" : "")}
                to="/cart"
              >
                Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </NavLink>
              <NavLink
                className={({ isActive }) => "link" + (isActive ? " active" : "")}
                to="/profile"
              >
                Profile
              </NavLink>
              <div className="nav-divider" />
              <button className="link logout-btn" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}