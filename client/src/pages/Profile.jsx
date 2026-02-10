import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaShoppingBag, FaBox } from 'react-icons/fa';
import { ordersAPI, customOrdersAPI } from '../utils/api';

function Profile({ token, user }) {
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const [ordersResult, customOrdersResult] = await Promise.all([
        ordersAPI.getAll(token),
        customOrdersAPI.getAll(token)
      ]);
      
      setOrders(ordersResult.data || []);
      setCustomOrders(customOrdersResult.data || []);
    } catch (err) {
      console.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>

        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <FaUser /> Profile Info
          </button>
          <button 
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> My Orders ({orders.length})
          </button>
          <button 
            className={`profile-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <FaBox /> Custom Orders ({customOrders.length})
          </button>
        </div>

        {/* Profile Info Tab */}
        {activeTab === 'info' && (
          <div className="profile-info">
            <div className="profile-card">
              <div className="profile-avatar">
                <FaUser />
              </div>
              <div className="profile-details">
                <div className="profile-field">
                  <label>Name</label>
                  <p>{user.name}</p>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-field">
                  <label>Account Type</label>
                  <p className="profile-role">
                    <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </p>
                </div>
                <div className="profile-stats">
                  <div className="stat-box">
                    <div className="stat-number">{orders.length}</div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">{customOrders.length}</div>
                    <div className="stat-label">Custom Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="profile-orders">
            <h2>Order History</h2>
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
                      <span className="badge badge-success">Completed</span>
                    </div>
                    
                    <div className="order-card-body">
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
        )}

        {/* Custom Orders Tab */}
        {activeTab === 'custom' && (
          <div className="profile-custom-orders">
            <h2>Custom Order Requests</h2>
            {customOrders.length === 0 ? (
              <div className="no-data">
                <p>You haven't created any custom orders yet.</p>
                <a href="/custom-orders" className="btn btn-primary">Create Custom Order</a>
              </div>
            ) : (
              <div className="orders-list">
                {customOrders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <h3>Custom Order #{order._id.slice(-6)}</h3>
                        <p className="order-card-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="badge badge-warning">In Progress</span>
                    </div>
                    
                    <div className="order-card-body">
                      <p><strong>File:</strong> <a href={order.orderFileURL} target="_blank" rel="noopener noreferrer">View File</a></p>
                      
                      <div className="order-card-details">
                        <strong>Details:</strong>
                        <ul>
                          {order.orderDetails.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;