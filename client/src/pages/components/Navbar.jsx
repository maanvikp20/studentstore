import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  // 1. Uncomment and initialize navigate
  const navigate = useNavigate();

  // 2. Check for auth status on mount
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    
    setIsLoggedIn(!!token);

    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setIsAdmin(userData?.role === "admin");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const logout = () => {
    // 3. Clear storage and state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    
    // 4. Redirect to login
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
                to="/orders"
              >
                My Orders
              </NavLink>
              
              {isAdmin && (
                <NavLink
                  className={({ isActive }) => "link" + (isActive ? " active" : "")}
                  to="/admin"
                >
                  Admin Panel
                </NavLink>
              )}

              <button className="btn btn--link" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}