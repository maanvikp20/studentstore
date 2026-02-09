import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../utils/api';

function Cart({ cart, removeFromCart, clearCart, token, user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + parseFloat(item.itemPrice || 0), 0);

  const handleCheckout = async () => {
    if (!token) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderDetails = cart.map(item => `${item.itemName} - ${item.filament} - $${item.itemPrice}`);
      
      const result = await ordersAPI.create(token, {
        customerName: user.name,
        customerEmail: user.email,
        orderDetails
      });

      if (result.data) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/inventory');
      }
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="no-data">
            <p>Your cart is empty</p>
            <a href="/inventory" className="btn btn--primary">Continue Shopping</a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item__image">
                    <img src={item.imageURL} alt={item.itemName} />
                  </div>
                  <div className="cart-item__details">
                    <h3>{item.itemName}</h3>
                    <p className="cart-item__filament">
                      <span className="badge">{item.filament}</span>
                    </p>
                  </div>
                  <div className="cart-item__price">
                    ${item.itemPrice}
                  </div>
                  <button 
                    className="btn btn--danger btn--small"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="cart-summary__row cart-summary__total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                className="btn btn--primary btn--full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>
              <button 
                className="btn btn--secondary btn--full"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;