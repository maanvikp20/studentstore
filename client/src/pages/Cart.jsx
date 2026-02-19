import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { FaCartShopping } from "react-icons/fa6";
import { ordersAPI } from '../utils/api';

function Cart({ cart, removeFromCart, clearCart, token, user }) {
  const navigate  = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  const total    = cart.reduce((sum, item) => sum + parseFloat(item.itemPrice || 0), 0);
  const itemCount = cart.length;

  const handleCheckout = async () => {
    if (!token) { navigate('/login'); return; }
    setError('');
    setLoading(true);
    try {
      const orderDetails = cart.map(
        item => `${item.itemName} - ${item.filament} - $${item.itemPrice}`
      );
      const result = await ordersAPI.create(token, {
        customerName: user.name,
        customerEmail: user.email,
        orderDetails,
      });
      if (result.data) {
        setSuccess(true);
        setTimeout(() => {
          clearCart();
          navigate('/profile');
        }, 1800);
      }
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="cart-page">
      <div className="cart-success">
        <div className="success-icon"><FaCheck /></div>
        <h2>Order Placed!</h2>
        <p>Redirecting you to your profile…</p>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">

        <div className="cart-header">
          <button className="cart-back" onClick={() => navigate('/inventory')}>
            <FaArrowLeft /> Continue Shopping
          </button>
          <h1>
            <FaCartShopping />
            Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon"><FaCartShopping /></div>
            <h2>Your cart is empty</h2>
            <p>Browse our products and add something you like.</p>
            <button className="btn btn-primary" onClick={() => navigate('/inventory')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-image">
                    {item.imageURL
                      ? <img src={item.imageURL} alt={item.itemName} />
                      : <div className="cart-img-placeholder">{item.itemName?.charAt(0)}</div>
                    }
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.itemName}</h3>
                    {item.filament && (
                      <p className="cart-item-filament">
                        <span className="badge">{item.filament}</span>
                      </p>
                    )}
                    {item.color && (
                      <p className="cart-item-color">{item.color}</p>
                    )}
                  </div>

                  <div className="cart-item-price">
                    ${parseFloat(item.itemPrice).toFixed(2)}
                  </div>

                  <button
                    className="cart-remove"
                    onClick={() => removeFromCart(index)}
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-sidebar">
              <div className="cart-summary">
                <h2 className="cart-summary-title">Order Summary</h2>

                <div className="cart-summary-lines">
                  <div className="cart-summary-row">
                    <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span className="free-tag">Free</span>
                  </div>
                </div>

                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                  className="btn btn-primary btn-full checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="checkout-spinner" />
                  ) : (
                    'Place Order'
                  )}
                </button>

                <button
                  className="btn btn-secondary btn-full"
                  onClick={clearCart}
                  disabled={loading}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;