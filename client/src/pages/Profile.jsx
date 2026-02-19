import React, { useState, useEffect } from 'react';
import { FaUser, FaShoppingBag, FaBox, FaEnvelope, FaShieldAlt, FaPen, FaCheck, FaTimes, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { ordersAPI, customOrdersAPI, authAPI } from '../utils/api';

function Profile({ token, user, onUserUpdate }) {
  const [orders, setOrders]             = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('info');
  const [error, setError]               = useState('');

  const [editing, setEditing]           = useState(false);
  const [saveLoading, setSaveLoading]   = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [saveError, setSaveError]       = useState('');

  const [form, setForm] = useState({
    name:     user?.name  || '',
    email:    user?.email || '',
    phone:    user?.phone || '',
    location: user?.location || '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [pwLoading, setPwLoading]   = useState(false);
  const [pwSuccess, setPwSuccess]   = useState(false);
  const [pwError, setPwError]       = useState('');
  const [showPwForm, setShowPwForm] = useState(false);

  useEffect(() => { if (token) fetchUserData(); }, [token]);

  useEffect(() => {
    if (user) {
      setForm({
        name:     user.name     || '',
        email:    user.email    || '',
        phone:    user.phone    || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersResult, customOrdersResult] = await Promise.all([
        ordersAPI.getAll(token),
        customOrdersAPI.getAll(token),
      ]);
      setOrders(ordersResult.data || []);
      setCustomOrders(customOrdersResult.data || []);
    } catch {
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim())  { setSaveError('Name cannot be empty.'); return; }
    if (!form.email.trim()) { setSaveError('Email cannot be empty.'); return; }
    setSaveError('');
    setSaveLoading(true);
    try {
      const result = await authAPI.updateProfile(token, {
        name:     form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        location: form.location.trim(),
      });
      if (result.error) {
        setSaveError(result.error);
      } else {
        if (onUserUpdate) onUserUpdate(result.data?.user || { ...user, ...form });
        setEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name:     user?.name     || '',
      email:    user?.email    || '',
      phone:    user?.phone    || '',
      location: user?.location || '',
    });
    setSaveError('');
    setEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match.'); return; }
    setPwLoading(true);
    try {
      const result = await authAPI.changePassword(token, {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      if (result.error) {
        setPwError(result.error);
      } else {
        setPwSuccess(true);
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPwForm(false);
        setTimeout(() => setPwSuccess(false), 3000);
      }
    } catch {
      setPwError('Failed to change password. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

  const renderOrderItem = (item, index) => {
    if (typeof item === 'string') return <li key={index}>{item}</li>;
    if (typeof item === 'object' && item !== null) {
      return (
        <li key={index}>
          {item.item || item.name || 'Unknown Item'}
          {item.quantity && ` · Qty: ${item.quantity}`}
          {item.price    && ` · ${item.price}`}
        </li>
      );
    }
    return null;
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const TABS = [
    { id: 'info',   icon: <FaUser />,        label: 'Profile' },
    { id: 'orders', icon: <FaShoppingBag />, label: `Orders (${orders.length})` },
    { id: 'custom', icon: <FaBox />,         label: `Custom (${customOrders.length})` },
  ];

  const FIELDS = [
    { key: 'name',     icon: <FaUser />,          label: 'Full Name',      type: 'text',  placeholder: 'John Doe' },
    { key: 'email',    icon: <FaEnvelope />,       label: 'Email Address',  type: 'email', placeholder: 'you@example.com' },
    { key: 'phone',    icon: <FaPhone />,          label: 'Phone Number',   type: 'tel',   placeholder: '+1 (555) 000-0000' },
    { key: 'location', icon: <FaMapMarkerAlt />,   label: 'Location',       type: 'text',  placeholder: 'City, State' },
  ];

  if (loading) return (
    <div className="profile-page">
      <div className="profile-skeleton">
        <div className="skel-banner" />
        <div className="skel-body">
          {[70, 50, 90, 60].map((w, i) => (
            <div key={i} className="skel-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">

      <div className="profile-banner">
        <div className="profile-banner-inner">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-identity">
              <h1>{user.name}</h1>
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>
            </div>
          </div>

          <div className="profile-banner-stats">
            <div className="banner-stat">
              <div className="banner-stat-number">{orders.length}</div>
              <div className="banner-stat-label">Orders</div>
            </div>
            <div className="banner-stat-divider" />
            <div className="banner-stat">
              <div className="banner-stat-number">{customOrders.length}</div>
              <div className="banner-stat-label">Custom</div>
            </div>
            <div className="banner-stat-divider" />
            <div className="banner-stat">
              <div className="banner-stat-number">{orders.length + customOrders.length}</div>
              <div className="banner-stat-label">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-body">
        {error      && <div className="error-message">{error}</div>}
        {saveSuccess && <div className="success-message"><FaCheck /> Profile updated successfully.</div>}
        {pwSuccess   && <div className="success-message"><FaCheck /> Password changed successfully.</div>}

        <div className="profile-tabs profile-section">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`btn profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="profile-info">

            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-header-left">
                  <div className="profile-avatar-lg">{initials}</div>
                  <div>
                    <h2>{user.name}</h2>
                    <p className="profile-card-sub">{user.email}</p>
                  </div>
                </div>

                <div className="profile-card-actions">
                  {!editing ? (
                    <button className="btn btn-edit" onClick={() => setEditing(true)}>
                      <FaPen /> Edit Profile
                    </button>
                  ) : (
                    <div className="edit-action-row">
                      <button className="btn btn-save" onClick={handleSave} disabled={saveLoading}>
                        {saveLoading ? <span className="btn-spinner" /> : <><FaCheck /> Save</>}
                      </button>
                      <button className="btn btn-cancel-edit" onClick={handleCancel}>
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {saveError && <div className="error-message card-error">{saveError}</div>}

              <div className="profile-details">
                {FIELDS.map(({ key, icon, label, type, placeholder }) => (
                  <div key={key} className="profile-field">
                    <div className="field-icon">{icon}</div>
                    <div className="field-content">
                      <label>{label}</label>
                      {editing ? (
                        <input
                          type={type}
                          value={form[key]}
                          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="field-input"
                        />
                      ) : (
                        <p className={!form[key] ? 'field-empty' : ''}>
                          {form[key] || `No ${label.toLowerCase()} set`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="profile-field">
                  <div className="field-icon"><FaShieldAlt /></div>
                  <div className="field-content">
                    <label>Account Type</label>
                    <p>
                      <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </p>
                  </div>
                </div>
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
                <div className="stat-box">
                  <div className="stat-number">{orders.length + customOrders.length}</div>
                  <div className="stat-label">All Time</div>
                </div>
              </div>
            </div>

            <div className="password-section profile-card">
              <div className="password-header" onClick={() => setShowPwForm(p => !p)}>
                <div className="password-header-left">
                  <div className="field-icon"><FaLock /></div>
                  <div>
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                  </div>
                </div>
                <span className={`pw-toggle-arrow ${showPwForm ? 'open' : ''}`}>›</span>
              </div>

              {showPwForm && (
                <form className="password-form" onSubmit={handlePasswordChange}>
                  {pwError && <div className="error-message">{pwError}</div>}

                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={pwForm.currentPassword}
                      onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={pwForm.newPassword}
                        onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={pwForm.confirmPassword}
                        onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Repeat new password"
                        required
                      />
                    </div>
                  </div>

                  <div className="pw-strength">
                    {['weak', 'fair', 'good', 'strong'].map((level, i) => (
                      <div
                        key={level}
                        className={`strength-bar ${pwForm.newPassword.length > i * 3 ? `strength-${level}` : ''}`}
                      />
                    ))}
                    <span className="strength-label">
                      {pwForm.newPassword.length === 0 ? '' :
                       pwForm.newPassword.length < 4  ? 'Weak' :
                       pwForm.newPassword.length < 8  ? 'Fair' :
                       pwForm.newPassword.length < 12 ? 'Good' : 'Strong'}
                    </span>
                  </div>

                  <button type="submit" className="btn btn-primary pw-submit" disabled={pwLoading}>
                    {pwLoading ? <span className="btn-spinner" /> : <><FaLock /> Update Password</>}
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-orders">
            <div className="tab-header">
              <h2>Order History</h2>
              <span className="tab-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>
            {orders.length === 0 ? (
              <div className="no-data">
                <FaShoppingBag className="no-data-icon" />
                <p>You haven't placed any orders yet.</p>
                <a href="/inventory" className="btn btn-primary">Start Shopping</a>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                        <p className="order-card-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className="badge badge-success">Completed</span>
                    </div>
                    <div className="order-card-body">
                      <div className="order-card-details">
                        <strong>Items:</strong>
                        <ul>
                          {Array.isArray(order.orderDetails) &&
                            order.orderDetails.map((item, i) => renderOrderItem(item, i))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="profile-custom-orders">
            <div className="tab-header">
              <h2>Custom Order Requests</h2>
              <span className="tab-count">{customOrders.length} request{customOrders.length !== 1 ? 's' : ''}</span>
            </div>
            {customOrders.length === 0 ? (
              <div className="no-data">
                <FaBox className="no-data-icon" />
                <p>You haven't created any custom orders yet.</p>
                <a href="/custom-orders" className="btn btn-primary">Create Custom Order</a>
              </div>
            ) : (
              <div className="orders-list">
                {customOrders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <h3>Custom #{order._id.slice(-6).toUpperCase()}</h3>
                        <p className="order-card-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className="badge badge-warning">In Progress</span>
                    </div>
                    <div className="order-card-body">
                      <p>
                        <strong>File:</strong>{' '}
                        <a href={order.orderFileURL} target="_blank" rel="noopener noreferrer">
                          View File ↗
                        </a>
                      </p>
                      <div className="order-card-details">
                        <strong>Details:</strong>
                        <ul>
                          {Array.isArray(order.orderDetails) &&
                            order.orderDetails.map((detail, i) => {
                              if (typeof detail === 'string') return <li key={i}>{detail}</li>;
                              if (typeof detail === 'object' && detail !== null)
                                return <li key={i}>{detail.description || JSON.stringify(detail)}</li>;
                              return null;
                            })}
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