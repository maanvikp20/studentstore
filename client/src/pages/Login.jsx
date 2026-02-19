import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const FEATURES = [
  'High-quality PLA, PETG & specialty filaments',
  'Custom orders with your own STL files',
  'Fast turnaround from our student-run shop',
];

function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authAPI.login(email, password);
      if (result.error)       setError(result.error);
      else if (result.data) { onLogin(result.data.user, result.data.token); navigate('/inventory'); }
    } catch {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="panel-brand">
          <div className="panel-logo">3</div>
          <span className="panel-brand-name">3D Print Store</span>
        </div>
        <div className="panel-copy">
          <h2 className="panel-quote">
            Turn your ideas into<br />
            <span className="quote-accent">real objects.</span>
          </h2>
          <p className="panel-sub">
            Shop our in-stock prints or submit a fully custom order with your own design files.
          </p>
        </div>
        <div className="panel-features">
          {FEATURES.map((f, i) => (
            <div className="panel-feature" key={i}>
              <span className="feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-container">
        <div>
          <div className="auth-card">
            <div className="auth-logo-mobile">
              <div className="mobile-logo">3</div>
              <span className="mobile-brand">3D Print Store</span>
            </div>

            <h1>Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account?{' '}
              <Link className="link" to="/register">Create one here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;