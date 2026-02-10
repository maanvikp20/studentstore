import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { customOrdersAPI } from '../utils/api';

function CustomOrders({ token, user }) {
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    orderDetails: '',
    orderFileURL: ''
  });

  useEffect(() => {
    if (token) {
      fetchCustomOrders();
    }
  }, [token]);

  const fetchCustomOrders = async () => {
    try {
      const result = await customOrdersAPI.getAll(token);
      setCustomOrders(result.data || []);
    } catch (err) {
      setError('Failed to load custom orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderDetailsArray = formData.orderDetails.split(',').map(item => item.trim());
      const result = await customOrdersAPI.create(token, {
        ...formData,
        orderDetails: orderDetailsArray
      });
      
      if (result.data) {
        setCustomOrders([result.data, ...customOrders]);
        setShowForm(false);
        setFormData({
          customerName: user?.name || '',
          customerEmail: user?.email || '',
          orderDetails: '',
          orderFileURL: ''
        });
        alert('Custom order created successfully!');
      }
    } catch (err) {
      alert('Failed to create custom order');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom order?')) return;

    try {
      await customOrdersAPI.delete(token, id);
      setCustomOrders(customOrders.filter(order => order._id !== id));
      alert('Custom order deleted successfully');
    } catch (err) {
      alert('Failed to delete custom order');
    }
  };

  if (loading) {
    return <div className="loading">Loading custom orders...</div>;
  }

  return (
    <div className="custom-orders-page">
      <div className="container">
        <div className="page-header">
          <h1>Custom Orders</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Create Custom Order</>}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="custom-order-form">
            <h2>New Custom Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Order Details (comma-separated)</label>
                <textarea
                  value={formData.orderDetails}
                  onChange={(e) => setFormData({...formData, orderDetails: e.target.value})}
                  placeholder="e.g., Custom phone case, Blue PLA, 10cm x 5cm"
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>File URL (STL, OBJ, etc.)</label>
                <input
                  type="url"
                  value={formData.orderFileURL}
                  onChange={(e) => setFormData({...formData, orderFileURL: e.target.value})}
                  placeholder="https://example.com/file.stl"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">Submit Order</button>
            </form>
          </div>
        )}

        {customOrders.length === 0 ? (
          <div className="no-data">
            <p>You haven't created any custom orders yet.</p>
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
                  <button 
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(order._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
                
                <div className="order-card-body">
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Email:</strong> {order.customerEmail}</p>
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
    </div>
  );
}

export default CustomOrders;