import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
//   const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const userData = JSON.parse(localStorage.getItem("user"));
    setIsAdmin(userData?.role === "admin");
  }, []);


  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

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
        
        {!isLoggedIn && (
          <NavLink
            className={({ isActive }) => "link" + (isActive ? " active" : "")}
            to="/login"
          >
            Login
          </NavLink>
        )}

          {isLoggedIn && (
            <NavLink
              className={({ isActive }) => "link" + (isActive ? " active" : "")}
              to="/orders"
            >
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              className={({ isActive }) => "link" + (isActive ? " active" : "")}
              to="/admin"
            >
              Admin Panel
            </NavLink>
          )}
          {isLoggedIn && (
            <button className="btn btn--link" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
