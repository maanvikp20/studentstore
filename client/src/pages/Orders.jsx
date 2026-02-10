import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { ordersAPI } from '../utils/api';

function Orders({ token, user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const result = await ordersAPI.getAll(token);
      setOrders(result.data || []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await ordersAPI.delete(token, id);
      setOrders(orders.filter(order => order._id !== id));
      alert('Order deleted successfully');
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-data">
            <p>You haven't placed any orders yet.</p>
            <a href="/inventory" className="btn btn-primary">Start Shopping</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p className="order-card-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    className="btn btn-danger btn-small"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
                
                <div className="order-card-body">
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Email:</strong> {order.customerEmail}</p>
                  
                  <div className="order-card-details">
                    <strong>Items:</strong>
                    <ul>
                      {order.orderDetails.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;