import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { usersAPI, ordersAPI } from '../utils/api';

function Admin({ token, user }) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (activeTab === 'users') {
        const result = await usersAPI.getAll(token);
        setUsers(result.data || []);
      } else {
        const result = await ordersAPI.getAll(token);
        setOrders(result.data || []);
      }
    } catch (err) {
      setError('Failed to load data. You may not have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, userEmail) => {
    if (user && user.email === userEmail) {
      alert('You cannot delete your own account!');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(token, id);
      setUsers(users.filter(u => u._id !== id));
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user');
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

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="admin-table">
                <h2>All Users</h2>
                {users.length === 0 ? (
                  <p className="no-data">No users found</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name} {user && user.email === u.email && <span className="badge badge-admin">(You)</span>}</td>
                          <td>{u.email}</td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            {user && user.email === u.email ? (
                              <span className="text-muted">Cannot delete yourself</span>
                            ) : (
                              <button 
                                className="btn btn-danger btn-small"
                                onClick={() => handleDeleteUser(u._id, u.email)}
                              >
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="admin-table">
                <h2>All Orders</h2>
                {orders.length === 0 ? (
                  <p className="no-data">No orders found</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{order.customerName}</td>
                          <td>{order.customerEmail}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-danger btn-small"
                              onClick={() => handleDeleteOrder(order._id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;