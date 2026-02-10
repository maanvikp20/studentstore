import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import Profile from "./pages/Profile";
import CustomOrders from "./pages/CustomOrders";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import "./SASS/index.scss";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Error loading user:", e);
        }
      }
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (userData, authToken) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setToken(null);
    setUser(null);
    setCart([]);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} cartCount={cart.length} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/inventory" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !user ? (
              <Register onLogin={handleLogin} />
            ) : (
              <Navigate to="/inventory" />
            )
          }
        />
        <Route
          path="/inventory"
          element={<Inventory addToCart={addToCart} user={user} />}
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile token={token} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/custom-orders"
          element={
            user ? (
              <CustomOrders token={token} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              token={token}
              user={user}
            />
          }
        />
        <Route
          path="/admin"
          element={user ? <Admin token={token} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
